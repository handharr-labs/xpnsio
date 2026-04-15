import type { PaymentAccount } from '../entities/PaymentAccount';

export interface PaymentAccountRepository {
  getByUserId(userId: string): Promise<PaymentAccount[]>;
  upsertMany(userId: string, accounts: { bankName: string; accountNumber: string }[]): Promise<void>;
}
