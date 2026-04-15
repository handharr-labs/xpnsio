import type { SplitBillDetail } from '../entities/SplitBillDetail';
import type { SplitBillRepository, CreateSplitBillParams } from '../repositories/SplitBillRepository';
import { DomainError } from '@/shared/domain/errors/DomainError';

export interface CreateSplitBillUseCase {
  execute(params: CreateSplitBillParams): Promise<SplitBillDetail>;
}

export class CreateSplitBillUseCaseImpl implements CreateSplitBillUseCase {
  constructor(private readonly repository: SplitBillRepository) {}

  async execute(params: CreateSplitBillParams): Promise<SplitBillDetail> {
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
    if (params.participants.filter((p) => p.isCreator).length > 1) {
      throw DomainError.validationFailed('participants', 'At most one participant can be marked as creator');
    }
    return this.repository.create(params);
  }
}
