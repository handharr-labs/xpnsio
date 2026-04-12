import { eq, inArray } from 'drizzle-orm';
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
      .orderBy(splitBills.createdAt);
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
                status: 'pending' as const,
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
