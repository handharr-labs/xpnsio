import { eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { paymentAccounts, type PaymentAccountRow } from '@/lib/schema';
import type { PaymentAccountDbDataSource } from './PaymentAccountDbDataSource';

export class PaymentAccountDbDataSourceImpl implements PaymentAccountDbDataSource {
  async getByUserId(userId: string): Promise<PaymentAccountRow[]> {
    return db.select().from(paymentAccounts).where(eq(paymentAccounts.userId, userId));
  }

  async upsertMany(userId: string, accounts: { bankName: string; accountNumber: string }[]): Promise<void> {
    if (accounts.length === 0) return;

    await db
      .insert(paymentAccounts)
      .values(
        accounts.map((a) => ({
          userId,
          bankName: a.bankName,
          accountNumber: a.accountNumber,
        }))
      )
      .onConflictDoUpdate({
        target: [paymentAccounts.userId, paymentAccounts.accountNumber],
        set: {
          bankName: sql`excluded.bank_name`,
          updatedAt: new Date(),
        },
      });
  }
}
