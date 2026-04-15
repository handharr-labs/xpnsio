import type { TripRow, TripParticipantSettlementRow } from '@/lib/schema';

export interface TripDetailRecord extends TripRow {
  settlements: TripParticipantSettlementRow[];
  billIds: string[];
}

export interface TripDbDataSource {
  create(data: {
    userId: string;
    name: string;
    startDate: string;
    endDate: string | null;
    description: string | null;
  }): Promise<TripRow>;

  findById(tripId: string, userId: string): Promise<TripDetailRecord | null>;

  /** Public access — no userId filter */
  findPublicById(tripId: string): Promise<TripDetailRecord | null>;

  findByUserId(userId: string): Promise<TripRow[]>;

  delete(tripId: string, userId: string): Promise<void>;

  addBills(tripId: string, billIds: string[], userId: string): Promise<void>;

  syncSettlements(tripId: string): Promise<void>;

  updateSettlementProof(settlementId: string, proofImageUrl: string): Promise<void>;

  updateSettlementStatus(
    settlementId: string,
    status: 'pending' | 'proof_uploaded' | 'approved' | 'rejected'
  ): Promise<void>;
}
