import type { PaymentAccount } from '../../domain/entities/PaymentAccount';
import type { PaymentAccountRepository } from '../../domain/repositories/PaymentAccountRepository';
import type { PaymentAccountDbDataSource } from '../data-sources/PaymentAccountDbDataSource';
import { PaymentAccountMapper } from '../mappers/PaymentAccountMapper';
import { DomainError } from '@/shared/domain/errors/DomainError';

export class PaymentAccountRepositoryImpl implements PaymentAccountRepository {
  private readonly mapper = new PaymentAccountMapper();

  constructor(private readonly dataSource: PaymentAccountDbDataSource) {}

  async getByUserId(userId: string): Promise<PaymentAccount[]> {
    try {
      const rows = await this.dataSource.getByUserId(userId);
      return rows.map((r) => this.mapper.toEntity(r));
    } catch (error) {
      throw DomainError.serverError(String(error));
    }
  }

  async upsertMany(
    userId: string,
    accounts: { bankName: string; accountNumber: string }[],
  ): Promise<void> {
    try {
      await this.dataSource.upsertMany(userId, accounts);
    } catch (error) {
      throw DomainError.serverError(String(error));
    }
  }
}
