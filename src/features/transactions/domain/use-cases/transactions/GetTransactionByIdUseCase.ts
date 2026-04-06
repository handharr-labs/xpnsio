import type { Transaction } from '@/features/transactions/domain/entities/Transaction';
import type { TransactionRepository } from '@/features/transactions/domain/repositories/TransactionRepository';

export interface GetTransactionByIdUseCase {
  execute(id: string): Promise<Transaction | null>;
}

export class GetTransactionByIdUseCaseImpl implements GetTransactionByIdUseCase {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(id: string): Promise<Transaction | null> {
    return this.repository.getById(id);
  }
}
