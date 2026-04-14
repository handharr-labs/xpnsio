export type ParticipantStatus = 'pending' | 'proof_uploaded' | 'approved' | 'rejected';

export interface SplitBillParticipant {
  readonly id: string;
  readonly billId: string;
  readonly name: string;
  readonly email: string | null;
  readonly finalAmount: number; // IDR integer
  readonly status: ParticipantStatus;
  readonly isCreator: boolean;
  readonly proofImageUrl: string | null;
  readonly proofUploadedAt: Date | null;
  readonly approvedAt: Date | null;
}
