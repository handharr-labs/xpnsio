export type SettlementStatus = 'pending' | 'proof_uploaded' | 'approved' | 'rejected';

export interface TripParticipantSettlement {
  readonly id: string;
  readonly tripId: string;
  readonly participantName: string;
  readonly participantEmail: string | null;
  readonly totalNetAmount: number; // IDR integer
  readonly proofImageUrl: string | null;
  readonly status: SettlementStatus;
  readonly proofUploadedAt: Date | null;
  readonly approvedAt: Date | null;
  readonly createdAt: Date;
}
