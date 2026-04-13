import type { SplitBillRepository, UpdateSplitBillParams } from '../repositories/SplitBillRepository';
import { DomainError } from '@/shared/domain/errors/DomainError';

export interface UpdateSplitBillUseCase {
  execute(params: UpdateSplitBillParams): Promise<void>;
}

export class UpdateSplitBillUseCaseImpl implements UpdateSplitBillUseCase {
  constructor(private readonly repository: SplitBillRepository) {}

  async execute(params: UpdateSplitBillParams): Promise<void> {
    if (!params.title.trim()) {
      throw DomainError.validationFailed('title', 'Title is required');
    }
    if (params.accounts.length === 0) {
      throw DomainError.validationFailed('accounts', 'At least one payment account is required');
    }
    if (params.participants.length === 0) {
      throw DomainError.validationFailed('participants', 'At least one participant is required');
    }
    if (params.participants.some((p) => p.finalAmount <= 0)) {
      throw DomainError.validationFailed('participants', 'All participant amounts must be greater than 0');
    }
    return this.repository.update(params);
  }
}
