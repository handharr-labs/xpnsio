import type { SplitBillDetail } from '../entities/SplitBillDetail';
import type { SplitBillRepository } from '../repositories/SplitBillRepository';
import { NotFoundError } from '@handharr-labs/core';

export interface GetSplitBillUseCase {
  execute(id: string): Promise<SplitBillDetail>;
}

export class GetSplitBillUseCaseImpl implements GetSplitBillUseCase {
  constructor(private readonly repository: SplitBillRepository) {}

  async execute(id: string): Promise<SplitBillDetail> {
    const bill = await this.repository.getById(id);
    if (!bill) throw new NotFoundError('Split bill');
    return bill;
  }
}
