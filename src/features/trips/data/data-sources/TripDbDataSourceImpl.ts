import { and, eq, isNull, inArray, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
  trips,
  tripParticipantSettlements,
  splitBills,
  splitBillParticipants,
  type TripRow,
  type TripParticipantSettlementRow,
} from '@/lib/schema';
import type { TripDbDataSource, TripDetailRecord } from './TripDbDataSource';
import { DomainError } from '@/shared/domain/errors/DomainError';

export class TripDbDataSourceImpl implements TripDbDataSource {
  async create(data: {
    userId: string;
    name: string;
    startDate: string;
    endDate: string | null;
    description: string | null;
  }): Promise<TripRow> {
    const [trip] = await db
      .insert(trips)
      .values({
        userId: data.userId,
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
      })
      .returning();
    return trip;
  }

  async findById(tripId: string, userId: string): Promise<TripDetailRecord | null> {
    // Fetch trip
    const tripRows = await db
      .select()
      .from(trips)
      .where(and(eq(trips.id, tripId), eq(trips.userId, userId)))
      .limit(1);

    if (!tripRows[0]) return null;
    const trip = tripRows[0];

    // Fetch settlements
    const settlements = await db
      .select()
      .from(tripParticipantSettlements)
      .where(eq(tripParticipantSettlements.tripId, tripId));

    // Fetch bill IDs associated with this trip
    const billRows = await db
      .select({ id: splitBills.id })
      .from(splitBills)
      .where(eq(splitBills.tripId, tripId));
    const billIds = billRows.map((b) => b.id);

    return {
      ...trip,
      settlements,
      billIds,
    };
  }

  async findPublicById(tripId: string): Promise<TripDetailRecord | null> {
    const tripRows = await db
      .select()
      .from(trips)
      .where(eq(trips.id, tripId))
      .limit(1);

    if (!tripRows[0]) return null;
    const trip = tripRows[0];

    const settlements = await db
      .select()
      .from(tripParticipantSettlements)
      .where(eq(tripParticipantSettlements.tripId, tripId));

    const billRows = await db
      .select({ id: splitBills.id })
      .from(splitBills)
      .where(eq(splitBills.tripId, tripId));
    const billIds = billRows.map((b) => b.id);

    return {
      ...trip,
      settlements,
      billIds,
    };
  }

  async findByUserId(userId: string): Promise<TripRow[]> {
    return db
      .select()
      .from(trips)
      .where(eq(trips.userId, userId))
      .orderBy(trips.createdAt);
  }

  async delete(tripId: string, userId: string): Promise<void> {
    await db.delete(trips).where(and(eq(trips.id, tripId), eq(trips.userId, userId)));
  }

  async addBills(tripId: string, billIds: string[], userId: string): Promise<void> {
    if (billIds.length === 0) return;

    return db.transaction(async (tx) => {
      // 1. Verify trip exists and belongs to user
      const tripCheck = await tx
        .select()
        .from(trips)
        .where(and(eq(trips.id, tripId), eq(trips.userId, userId)))
        .limit(1);

      if (!tripCheck[0]) {
        throw DomainError.notFound('Trip', tripId);
      }

      // 2. Verify all bills exist, belong to userId, and have trip_id IS NULL (standalone)
      const billCheck = await tx
        .select()
        .from(splitBills)
        .where(inArray(splitBills.id, billIds));

      if (billCheck.length !== billIds.length) {
        throw DomainError.validationFailed('billIds', 'One or more bills not found');
      }

      for (const bill of billCheck) {
        if (bill.userId !== userId) {
          throw DomainError.unauthorized();
        }
        if (bill.tripId !== null) {
          throw DomainError.validationFailed('billIds', 'One or more bills are already assigned to a trip');
        }
      }

      // 3. Update split_bills with trip_id
      await tx
        .update(splitBills)
        .set({ tripId })
        .where(inArray(splitBills.id, billIds));

      // 4. Sync settlements
      await this.syncSettlementsTransaction(tx, tripId);
    });
  }

  async syncSettlements(tripId: string): Promise<void> {
    return db.transaction(async (tx) => {
      await this.syncSettlementsTransaction(tx, tripId);
    });
  }

  private async syncSettlementsTransaction(tx: any, tripId: string): Promise<void> {
    // 1. Fetch all split_bill_participants for bills in this trip
    const participantRows = await tx
      .select()
      .from(splitBillParticipants)
      .innerJoin(splitBills, eq(splitBillParticipants.billId, splitBills.id))
      .where(eq(splitBills.tripId, tripId));

    // 2. Group by (participant_name lowercased, participant_email lowercased/null)
    interface ParticipantGroup {
      nameNorm: string;
      displayName: string; // original-cased name from the first occurrence
      emailNorm: string | null;
      totalAmount: number;
      isCreator: boolean;
    }

    const groupMap: Record<string, ParticipantGroup> = {};

    for (const row of participantRows) {
      const participant = row.split_bill_participants;
      const nameNorm = participant.name.toLowerCase();
      const emailNorm = participant.email ? participant.email.toLowerCase() : null;
      const key = `${nameNorm}|${emailNorm ?? ''}`;

      if (!groupMap[key]) {
        groupMap[key] = {
          nameNorm,
          displayName: participant.name,
          emailNorm,
          totalAmount: 0,
          isCreator: participant.isCreator,
        };
      }
      groupMap[key].totalAmount += participant.finalAmount;
      // If any occurrence is marked creator, the group is the creator
      if (participant.isCreator) groupMap[key].isCreator = true;
    }

    // 3. For each group: upsert into trip_participant_settlements
    for (const groupKey of Object.keys(groupMap)) {
      const group = groupMap[groupKey];

      // Find existing settlement
      const existing = await tx
        .select()
        .from(tripParticipantSettlements)
        .where(
          and(
            eq(tripParticipantSettlements.tripId, tripId),
            sql`LOWER(${tripParticipantSettlements.participantName}) = ${group.nameNorm}`,
            group.emailNorm === null
              ? sql`${tripParticipantSettlements.participantEmail} IS NULL`
              : sql`LOWER(${tripParticipantSettlements.participantEmail}) = ${group.emailNorm}`
          )
        )
        .limit(1);

      if (existing[0]) {
        if (existing[0].status === 'pending') {
          await tx
            .update(tripParticipantSettlements)
            .set({
              totalNetAmount: group.totalAmount,
              participantName: group.displayName,
              // Auto-approve the creator — they collect, not pay
              ...(group.isCreator ? { status: 'approved' as const, approvedAt: new Date() } : {}),
            })
            .where(eq(tripParticipantSettlements.id, existing[0].id));
        }
      } else {
        // Insert new settlement
        await tx.insert(tripParticipantSettlements).values({
          tripId,
          participantName: group.displayName,
          participantEmail: group.emailNorm,
          totalNetAmount: group.totalAmount,
          // Creator is auto-approved — they are the one collecting payments
          status: group.isCreator ? 'approved' : 'pending',
          ...(group.isCreator ? { approvedAt: new Date() } : {}),
        });
      }
    }
  }

  async updateSettlementProof(settlementId: string, proofImageUrl: string): Promise<void> {
    await db
      .update(tripParticipantSettlements)
      .set({
        proofImageUrl,
        proofUploadedAt: new Date(),
        status: 'proof_uploaded',
      })
      .where(eq(tripParticipantSettlements.id, settlementId));
  }

  async updateSettlementStatus(
    settlementId: string,
    status: 'pending' | 'proof_uploaded' | 'approved' | 'rejected'
  ): Promise<void> {
    const updateData: Record<string, any> = { status };
    if (status === 'approved') {
      updateData.approvedAt = new Date();
    }
    await db
      .update(tripParticipantSettlements)
      .set(updateData)
      .where(eq(tripParticipantSettlements.id, settlementId));
  }
}
