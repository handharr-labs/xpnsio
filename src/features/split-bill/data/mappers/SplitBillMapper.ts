import type { SplitBill } from '@/features/split-bill/domain/entities/SplitBill';
import type { SplitBillAccount } from '@/features/split-bill/domain/entities/SplitBillAccount';
import type { SplitBillParticipant } from '@/features/split-bill/domain/entities/SplitBillParticipant';
import type { SplitBillItem } from '@/features/split-bill/domain/entities/SplitBillItem';
import type { SplitBillAdjustment } from '@/features/split-bill/domain/entities/SplitBillAdjustment';
import type { SplitBillDetail } from '@/features/split-bill/domain/entities/SplitBillDetail';
import type {
  SplitBillDetailRecord,
} from '@/features/split-bill/data/data-sources/SplitBillDbDataSource';
import type {
  SplitBillRow,
  SplitBillAccountRow,
  SplitBillParticipantRow,
  SplitBillItemRow,
  SplitBillAdjustmentRow,
} from '@/lib/schema';

export class SplitBillMapper {
  toBill(row: SplitBillRow): SplitBill {
    return {
      id: row.id,
      userId: row.userId,
      title: row.title,
      description: row.description ?? null,
      date: row.date,
      splitMode: row.splitMode,
      createdAt: row.createdAt,
    };
  }

  toAccount(row: SplitBillAccountRow): SplitBillAccount {
    return {
      id: row.id,
      billId: row.billId,
      bankName: row.bankName,
      accountNumber: row.accountNumber,
    };
  }

  toParticipant(row: SplitBillParticipantRow): SplitBillParticipant {
    return {
      id: row.id,
      billId: row.billId,
      name: row.name,
      email: row.email ?? null,
      finalAmount: row.finalAmount,
      status: row.status,
      proofImageUrl: row.proofImageUrl ?? null,
      proofUploadedAt: row.proofUploadedAt ?? null,
      approvedAt: row.approvedAt ?? null,
    };
  }

  toItem(row: SplitBillItemRow & { assignedParticipantIds: string[] }): SplitBillItem {
    return {
      id: row.id,
      billId: row.billId,
      name: row.name,
      price: row.price,
      orderIndex: row.orderIndex,
      assignedParticipantIds: row.assignedParticipantIds,
    };
  }

  toAdjustment(row: SplitBillAdjustmentRow): SplitBillAdjustment {
    return {
      id: row.id,
      billId: row.billId,
      label: row.label,
      type: row.type,
      value: row.value,
      distribution: row.distribution,
      orderIndex: row.orderIndex,
    };
  }

  toDetail(record: SplitBillDetailRecord): SplitBillDetail {
    return {
      ...this.toBill(record),
      accounts: record.accounts.map((a) => this.toAccount(a)),
      participants: record.participants.map((p) => this.toParticipant(p)),
      items: record.items.map((i) => this.toItem(i)),
      adjustments: record.adjustments.map((a) => this.toAdjustment(a)),
    };
  }
}
