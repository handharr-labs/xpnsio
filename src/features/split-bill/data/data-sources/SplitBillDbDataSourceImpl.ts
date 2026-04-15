import { and, desc, eq, inArray, isNull, notInArray, or } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
  splitBills,
  splitBillAccounts,
  splitBillParticipants,
  splitBillItems,
  splitBillItemAssignments,
  splitBillAdjustments,
  type SplitBillRow,
  type SplitBillParticipantRow,
} from '@/lib/schema';
import type {
  SplitBillDbDataSource,
  SplitBillDetailRecord,
  CreateBillDataParams,
  UpdateBillDataParams,
} from './SplitBillDbDataSource';

export class SplitBillDbDataSourceImpl implements SplitBillDbDataSource {
  async findById(id: string): Promise<SplitBillDetailRecord | null> {
    const bills = await db.select().from(splitBills).where(eq(splitBills.id, id)).limit(1);
    if (!bills[0]) return null;
    const bill = bills[0];

    const [accounts, participants, items, adjustments] = await Promise.all([
      db.select().from(splitBillAccounts).where(eq(splitBillAccounts.billId, id)),
      db.select().from(splitBillParticipants).where(eq(splitBillParticipants.billId, id)),
      db.select().from(splitBillItems).where(eq(splitBillItems.billId, id)),
      db.select().from(splitBillAdjustments).where(eq(splitBillAdjustments.billId, id)).orderBy(splitBillAdjustments.orderIndex),
    ]);

    const itemIds = items.map((i) => i.id);
    const participantIds = participants.map((p) => p.id);

    const assignments = itemIds.length > 0
      ? await db.select().from(splitBillItemAssignments).where(inArray(splitBillItemAssignments.itemId, itemIds))
      : [];

    const participantAssignments = participantIds.length > 0
      ? await db.select().from(splitBillItemAssignments).where(inArray(splitBillItemAssignments.participantId, participantIds))
      : [];

    const itemsWithAssignees = items.map((item) => ({
      ...item,
      assignedParticipantIds: assignments
        .filter((a) => a.itemId === item.id)
        .map((a) => a.participantId),
    }));

    const participantsWithItems = participants.map((p) => ({
      ...p,
      assignedItemIds: participantAssignments
        .filter((a) => a.participantId === p.id)
        .map((a) => a.itemId),
    }));

    return { ...bill, accounts, participants: participantsWithItems, items: itemsWithAssignees, adjustments };
  }

  async findByUserId(userId: string): Promise<SplitBillRow[]> {
    return db
      .select()
      .from(splitBills)
      .where(eq(splitBills.userId, userId))
      .orderBy(desc(splitBills.createdAt));
  }

  async findStandaloneByUserId(userId: string): Promise<SplitBillRow[]> {
    return db
      .select()
      .from(splitBills)
      .where(and(eq(splitBills.userId, userId), isNull(splitBills.tripId)))
      .orderBy(desc(splitBills.createdAt));
  }

  async createBill(params: CreateBillDataParams): Promise<SplitBillDetailRecord> {
    return db.transaction(async (tx) => {
      // 1. Create bill
      const [bill] = await tx
        .insert(splitBills)
        .values({
          userId: params.userId,
          title: params.title,
          description: params.description,
          date: params.date,
          splitMode: params.splitMode,
        })
        .returning();

      // 2. Create accounts
      const accounts = params.accounts.length > 0
        ? await tx
            .insert(splitBillAccounts)
            .values(params.accounts.map((a) => ({ billId: bill.id, bankName: a.bankName, accountNumber: a.accountNumber })))
            .returning()
        : [];

      // 3. Create participants
      const insertedParticipants = params.participants.length > 0
        ? await tx
            .insert(splitBillParticipants)
            .values(
              params.participants.map((p) => ({
                billId: bill.id,
                name: p.name,
                email: p.email ?? null,
                finalAmount: p.finalAmount,
                status: p.isCreator ? 'approved' as const : 'pending' as const,
                isCreator: p.isCreator ?? false,
                approvedAt: p.isCreator ? new Date() : null,
              }))
            )
            .returning()
        : [];

      // Build local id → real db id map (insertion order matches params.participants order)
      const localIdToDbId: Record<string, string> = {};
      params.participantLocalIds.forEach((localId, i) => {
        if (insertedParticipants[i]) {
          localIdToDbId[localId] = insertedParticipants[i].id;
        }
      });

      // 4. Create items (itemized mode)
      const insertedItems = params.items.length > 0
        ? await tx
            .insert(splitBillItems)
            .values(params.items.map((item) => ({ billId: bill.id, name: item.name, price: item.price, orderIndex: item.orderIndex })))
            .returning()
        : [];

      // 5. Create item assignments
      const assignmentRows: { itemId: string; participantId: string }[] = [];
      params.items.forEach((item, itemIdx) => {
        const dbItem = insertedItems[itemIdx];
        if (!dbItem) return;
        item.assignedParticipantLocalIds.forEach((localId) => {
          const participantDbId = localIdToDbId[localId];
          if (participantDbId) assignmentRows.push({ itemId: dbItem.id, participantId: participantDbId });
        });
      });

      if (assignmentRows.length > 0) {
        await tx.insert(splitBillItemAssignments).values(assignmentRows);
      }

      // 6. Create adjustments
      const insertedAdjustments = params.adjustments.length > 0
        ? await tx
            .insert(splitBillAdjustments)
            .values(params.adjustments.map((a) => ({ billId: bill.id, label: a.label, type: a.type, value: a.value, distribution: a.distribution, orderIndex: a.orderIndex })))
            .returning()
        : [];

      const itemsWithAssignees = insertedItems.map((item, i) => ({
        ...item,
        assignedParticipantIds: params.items[i]?.assignedParticipantLocalIds.map((lid) => localIdToDbId[lid]).filter(Boolean) ?? [],
      }));

      const participantsWithItems = insertedParticipants.map((p) => ({
        ...p,
        assignedItemIds: assignmentRows.filter((a) => a.participantId === p.id).map((a) => a.itemId),
      }));

      return { ...bill, accounts, participants: participantsWithItems, items: itemsWithAssignees, adjustments: insertedAdjustments };
    });
  }

  async updateBill(params: UpdateBillDataParams): Promise<void> {
    await db.transaction(async (tx) => {
      // 1. Update bill fields
      await tx
        .update(splitBills)
        .set({ title: params.title, description: params.description, date: params.date, splitMode: params.splitMode })
        .where(eq(splitBills.id, params.billId));

      // 2. Replace accounts (no state to preserve)
      await tx.delete(splitBillAccounts).where(eq(splitBillAccounts.billId, params.billId));
      if (params.accounts.length > 0) {
        await tx.insert(splitBillAccounts).values(
          params.accounts.map((a) => ({ billId: params.billId, bankName: a.bankName, accountNumber: a.accountNumber }))
        );
      }

      // 3. Handle participants
      const existingDbIds = params.participants.filter((p) => p.dbId).map((p) => p.dbId!);

      // Delete participants no longer in the form (pending ones, OR creator rows being explicitly removed)
      if (existingDbIds.length > 0) {
        await tx
          .delete(splitBillParticipants)
          .where(
            and(
              eq(splitBillParticipants.billId, params.billId),
              notInArray(splitBillParticipants.id, existingDbIds),
              or(
                eq(splitBillParticipants.status, 'pending'),
                eq(splitBillParticipants.isCreator, true)
              )
            )
          );
      } else {
        // All participants are new → delete all pending and all creator rows for this bill
        await tx
          .delete(splitBillParticipants)
          .where(
            and(
              eq(splitBillParticipants.billId, params.billId),
              or(
                eq(splitBillParticipants.status, 'pending'),
                eq(splitBillParticipants.isCreator, true)
              )
            )
          );
      }

      // Update existing participants (preserve status / proof)
      const formIdToDbId: Record<string, string> = {};
      for (const p of params.participants.filter((p) => p.dbId)) {
        await tx
          .update(splitBillParticipants)
          .set({ name: p.name, finalAmount: p.finalAmount, email: p.email ?? null, isCreator: p.isCreator ?? false })
          .where(eq(splitBillParticipants.id, p.dbId!));
        formIdToDbId[p.formId] = p.dbId!;
      }

      // Insert new participants
      const newParticipants = params.participants.filter((p) => !p.dbId);
      if (newParticipants.length > 0) {
        const inserted = await tx
          .insert(splitBillParticipants)
          .values(
            newParticipants.map((p) => ({
              billId: params.billId,
              name: p.name,
              email: p.email ?? null,
              finalAmount: p.finalAmount,
              status: p.isCreator ? 'approved' as const : 'pending' as const,
              isCreator: p.isCreator ?? false,
              approvedAt: p.isCreator ? new Date() : null,
            }))
          )
          .returning();
        newParticipants.forEach((p, i) => {
          if (inserted[i]) formIdToDbId[p.formId] = inserted[i].id;
        });
      }

      // 4. Replace items + assignments (cascade handles assignment deletion)
      await tx.delete(splitBillItems).where(eq(splitBillItems.billId, params.billId));
      if (params.items.length > 0) {
        const insertedItems = await tx
          .insert(splitBillItems)
          .values(
            params.items.map((item) => ({
              billId: params.billId,
              name: item.name,
              price: item.price,
              orderIndex: item.orderIndex,
            }))
          )
          .returning();

        const assignmentRows: { itemId: string; participantId: string }[] = [];
        params.items.forEach((item, i) => {
          const dbItem = insertedItems[i];
          if (!dbItem) return;
          item.assignedParticipantFormIds.forEach((formId) => {
            const participantDbId = formIdToDbId[formId];
            if (participantDbId) assignmentRows.push({ itemId: dbItem.id, participantId: participantDbId });
          });
        });
        if (assignmentRows.length > 0) {
          await tx.insert(splitBillItemAssignments).values(assignmentRows);
        }
      }

      // 5. Replace adjustments
      await tx.delete(splitBillAdjustments).where(eq(splitBillAdjustments.billId, params.billId));
      if (params.adjustments.length > 0) {
        await tx.insert(splitBillAdjustments).values(
          params.adjustments.map((a) => ({
            billId: params.billId,
            label: a.label,
            type: a.type,
            value: a.value,
            distribution: a.distribution,
            orderIndex: a.orderIndex,
          }))
        );
      }
    });
  }

  async deleteBill(billId: string): Promise<void> {
    await db.delete(splitBills).where(eq(splitBills.id, billId));
  }

  async updateParticipantProof(participantId: string, imageUrl: string): Promise<SplitBillParticipantRow> {
    const [updated] = await db
      .update(splitBillParticipants)
      .set({ status: 'proof_uploaded', proofImageUrl: imageUrl, proofUploadedAt: new Date() })
      .where(eq(splitBillParticipants.id, participantId))
      .returning();
    if (!updated) throw new Error(`Participant ${participantId} not found`);
    return updated;
  }

  async updateParticipantStatus(participantId: string, status: 'approved' | 'rejected'): Promise<SplitBillParticipantRow> {
    const [updated] = await db
      .update(splitBillParticipants)
      .set({
        status,
        approvedAt: status === 'approved' ? new Date() : null,
      })
      .where(eq(splitBillParticipants.id, participantId))
      .returning();
    if (!updated) throw new Error(`Participant ${participantId} not found`);
    return updated;
  }
}
