import type { SplitBill } from '../entities/SplitBill';
import type { SplitBillDetail } from '../entities/SplitBillDetail';
import type { SplitBillParticipant, ParticipantStatus } from '../entities/SplitBillParticipant';

export interface CreateSplitBillParams {
  userId: string;
  title: string;
  description: string | null;
  date: string;
  splitMode: SplitBill['splitMode'];
  accounts: { bankName: string; accountNumber: string }[];
  participants: { name: string; email?: string; finalAmount: number }[];
  items: { name: string; price: number; orderIndex: number; assignedParticipantLocalIds: string[] }[];
  adjustments: { label: string; type: 'percentage' | 'fixed'; value: number; distribution: 'proportional' | 'equal'; orderIndex: number }[];
  // mapping: local temp id → participant index (for item assignments in itemized mode)
  participantLocalIds: string[];
}

export interface UpdateSplitBillParams {
  billId: string;
  title: string;
  description: string | null;
  date: string;
  splitMode: SplitBill['splitMode'];
  accounts: { bankName: string; accountNumber: string }[];
  /**
   * Each participant carries an optional dbId (existing) or no dbId (new).
   * formId is used as the local key for item assignment mapping.
   */
  participants: {
    dbId?: string;
    formId: string;
    name: string;
    email?: string;
    finalAmount: number;
  }[];
  items: { name: string; price: number; orderIndex: number; assignedParticipantFormIds: string[] }[];
  adjustments: { label: string; type: 'percentage' | 'fixed'; value: number; distribution: 'proportional' | 'equal'; orderIndex: number }[];
}

export interface SplitBillRepository {
  getById(id: string): Promise<SplitBillDetail | null>;
  getByUserId(userId: string): Promise<SplitBill[]>;
  create(params: CreateSplitBillParams): Promise<SplitBillDetail>;
  update(params: UpdateSplitBillParams): Promise<void>;
  delete(billId: string): Promise<void>;
  uploadProof(participantId: string, imageUrl: string): Promise<SplitBillParticipant>;
  updateParticipantStatus(participantId: string, status: Extract<ParticipantStatus, 'approved' | 'rejected'>): Promise<SplitBillParticipant>;
}
