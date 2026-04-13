import type { SplitBill } from '../entities/SplitBill';
import type { SplitBillRepository } from '../repositories/SplitBillRepository';

export interface GetSplitBillsUseCase {
  execute(userId: string): Promise<SplitBill[]>;
}

export class GetSplitBillsUseCaseImpl implements GetSplitBillsUseCase {
  constructor(private readonly repository: SplitBillRepository) {}

  async execute(userId: string): Promise<SplitBill[]> {
    return this.repository.getByUserId(userId);
  }
}
