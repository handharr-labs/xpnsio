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
  participants: { name: string; email?: string; finalAmount: number; isCreator?: boolean }[];
  items: { name: string; price: number; orderIndex: number; assignedParticipantLocalIds: string[] }[];
  adjustments: { label: string; type: 'percentage' | 'fixed'; value: number; distribution: 'proportional' | 'equal'; orderIndex: number }[];
  participantLocalIds: string[]; // local temp ids in same order as participants array
}

export interface UpdateBillDataParams {
  billId: string;
  title: string;
  description: string | null;
  date: string;
  splitMode: 'equal' | 'custom' | 'itemized';
  accounts: { bankName: string; accountNumber: string }[];
  participants: {
    dbId?: string;   // existing participant id — undefined means new
    formId: string;  // local form id for item assignment mapping
    name: string;
    email?: string;
    finalAmount: number;
    isCreator?: boolean;
  }[];
  items: { name: string; price: number; orderIndex: number; assignedParticipantFormIds: string[] }[];
  adjustments: { label: string; type: 'percentage' | 'fixed'; value: number; distribution: 'proportional' | 'equal'; orderIndex: number }[];
}

export interface SplitBillDbDataSource {
  findById(id: string): Promise<SplitBillDetailRecord | null>;
  findByUserId(userId: string): Promise<SplitBillRow[]>;
  createBill(params: CreateBillDataParams): Promise<SplitBillDetailRecord>;
  updateBill(params: UpdateBillDataParams): Promise<void>;
  deleteBill(billId: string): Promise<void>;
  updateParticipantProof(participantId: string, imageUrl: string): Promise<SplitBillParticipantRow>;
  updateParticipantStatus(participantId: string, status: 'approved' | 'rejected'): Promise<SplitBillParticipantRow>;
}
