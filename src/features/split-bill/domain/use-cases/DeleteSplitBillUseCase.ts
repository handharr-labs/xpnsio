import type { SplitBillRepository } from '../repositories/SplitBillRepository';
import { DomainError } from '@/shared/domain/errors/DomainError';

export interface DeleteSplitBillUseCase {
  execute(billId: string, userId: string): Promise<void>;
}

export class DeleteSplitBillUseCaseImpl implements DeleteSplitBillUseCase {
  constructor(private readonly repository: SplitBillRepository) {}

  async execute(billId: string, userId: string): Promise<void> {
    const bill = await this.repository.getById(billId);
    if (!bill) throw DomainError.notFound('SplitBill', billId);
    if (bill.userId !== userId) throw DomainError.unauthorized();
    await this.repository.delete(billId);
  }
}
