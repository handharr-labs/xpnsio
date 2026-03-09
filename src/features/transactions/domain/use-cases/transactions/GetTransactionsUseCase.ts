import type { Transaction } from '@/features/transactions/domain/entities/Transaction';
import type { TransactionRepository, TransactionFilter } from '@/features/transactions/domain/repositories/TransactionRepository';

export interface GetTransactionsUseCase {
  execute(filter: TransactionFilter): Promise<Transaction[]>;
}

export class GetTransactionsUseCaseImpl implements GetTransactionsUseCase {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(filter: TransactionFilter): Promise<Transaction[]> {
    return this.repository.getFiltered(filter);
  }
}
