import type {
  SplitBillRow,
  SplitBillAccountRow,
  SplitBillParticipantRow,
  SplitBillItemRow,
  SplitBillAdjustmentRow,
} from '@/lib/schema';

export interface SplitBillDetailRecord extends SplitBillRow {
  accounts: SplitBillAccountRow[];
  participants: (SplitBillParticipantRow & { assignedItemIds: string[] })[];
  items: (SplitBillItemRow & { assignedParticipantIds: string[] })[];
  adjustments: SplitBillAdjustmentRow[];
}

export interface CreateBillDataParams {
  userId: string;
  title: string;
  description: string | null;
  date: string;
  splitMode: 'equal' | 'custom' | 'itemized';
  accounts: { bankName: string; accountNumber: string }[];
  participants: { name: string; email?: string; finalAmount: number }[];
  items: { name: string; price: number; orderIndex: number; assignedParticipantLocalIds: string[] }[];
  adjustments: { label: string; type: 'percentage' | 'fixed'; value: number; distribution: 'proportional' | 'equal'; orderIndex: number }[];
  participantLocalIds: string[]; // local temp ids in same order as participants array
}

export interface SplitBillDbDataSource {
  findById(id: string): Promise<SplitBillDetailRecord | null>;
  findByUserId(userId: string): Promise<SplitBillRow[]>;
  createBill(params: CreateBillDataParams): Promise<SplitBillDetailRecord>;
  updateParticipantProof(participantId: string, imageUrl: string): Promise<SplitBillParticipantRow>;
  updateParticipantStatus(participantId: string, status: 'approved' | 'rejected'): Promise<SplitBillParticipantRow>;
}
