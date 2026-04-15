import type { PaymentAccountRow } from '@/lib/schema';

export interface PaymentAccountDbDataSource {
  getByUserId(userId: string): Promise<PaymentAccountRow[]>;
  upsertMany(userId: string, accounts: { bankName: string; accountNumber: string }[]): Promise<void>;
}
