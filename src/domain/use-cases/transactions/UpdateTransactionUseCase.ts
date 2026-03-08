import type { Transaction } from '@/domain/entities/Transaction';
import type { TransactionRepository } from '@/domain/repositories/TransactionRepository';

export interface UpdateTransactionInput {
  amount?: number;
  categoryId?: string | null;
  description?: string | null;
  date?: string;
  type?: 'income' | 'expense';
}

export interface UpdateTransactionUseCase {
  execute(id: string, data: UpdateTransactionInput): Promise<Transaction>;
}

export class UpdateTransactionUseCaseImpl implements UpdateTransactionUseCase {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(id: string, data: UpdateTransactionInput): Promise<Transaction> {
    return this.repository.update(id, data);
  }
}
