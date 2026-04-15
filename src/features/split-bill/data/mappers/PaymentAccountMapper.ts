import type { PaymentAccount } from '@/features/split-bill/domain/entities/PaymentAccount';
import type { PaymentAccountRow } from '@/lib/schema';

export class PaymentAccountMapper {
  toEntity(row: PaymentAccountRow): PaymentAccount {
    return {
      id: row.id,
      userId: row.userId,
      bankName: row.bankName,
      accountNumber: row.accountNumber,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
