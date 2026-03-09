import type { TransactionRepository } from '@/features/transactions/domain/repositories/TransactionRepository';

export interface DeleteTransactionUseCase {
  execute(id: string): Promise<void>;
}

export class DeleteTransactionUseCaseImpl implements DeleteTransactionUseCase {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
