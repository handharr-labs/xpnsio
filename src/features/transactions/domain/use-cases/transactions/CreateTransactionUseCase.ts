import type { Transaction } from '@/features/transactions/domain/entities/Transaction';
import type { TransactionRepository } from '@/features/transactions/domain/repositories/TransactionRepository';
import { DomainError } from '@/shared/domain/errors/DomainError';

export interface CreateTransactionInput {
  userId: string;
  categoryId?: string | null;
  amount: number;
  type: 'income' | 'expense';
  description?: string | null;
  date: string; // YYYY-MM-DD
}

export interface CreateTransactionUseCase {
  execute(data: CreateTransactionInput): Promise<Transaction>;
}

export class CreateTransactionUseCaseImpl implements CreateTransactionUseCase {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(data: CreateTransactionInput): Promise<Transaction> {
    if (data.amount <= 0) {
      throw DomainError.validationFailed('amount', 'Amount must be greater than 0');
    }

    return this.repository.create({
      userId: data.userId,
      categoryId: data.categoryId ?? null,
      amount: data.amount,
      type: data.type,
      description: data.description ?? null,
      date: data.date,
    });
  }
}
