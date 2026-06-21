import type { SplitBillRepository } from '../repositories/SplitBillRepository';
import { NotFoundError, UnauthorizedError } from '@handharr-labs/core';

export interface DeleteSplitBillUseCase {
  execute(billId: string, userId: string): Promise<void>;
}

export class DeleteSplitBillUseCaseImpl implements DeleteSplitBillUseCase {
  constructor(private readonly repository: SplitBillRepository) {}

  async execute(billId: string, userId: string): Promise<void> {
    const bill = await this.repository.getById(billId);
    if (!bill) throw new NotFoundError('SplitBill');
    if (bill.userId !== userId) throw new UnauthorizedError();
    await this.repository.delete(billId);
  }
}
