import type { SplitBillRepository, UpdateSplitBillParams } from '../repositories/SplitBillRepository';
import { ValidationError } from '@handharr-labs/forge-core';

export interface UpdateSplitBillUseCase {
  execute(params: UpdateSplitBillParams): Promise<void>;
}

export class UpdateSplitBillUseCaseImpl implements UpdateSplitBillUseCase {
  constructor(private readonly repository: SplitBillRepository) {}

  async execute(params: UpdateSplitBillParams): Promise<void> {
    if (!params.title.trim()) {
      throw new ValidationError('Title is required');
    }
    if (params.accounts.length === 0) {
      throw new ValidationError('At least one payment account is required');
    }
    if (params.participants.length === 0) {
      throw new ValidationError('At least one participant is required');
    }
    if (params.participants.some((p) => p.finalAmount <= 0)) {
      throw new ValidationError('All participant amounts must be greater than 0');
    }
    return this.repository.update(params);
  }
}
