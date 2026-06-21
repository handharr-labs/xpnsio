import type { SplitBillDetail } from '../entities/SplitBillDetail';
import type { SplitBillRepository, CreateSplitBillParams } from '../repositories/SplitBillRepository';
import type { SavePaymentAccountsUseCase } from './SavePaymentAccountsUseCase';
import { ValidationError } from '@handharr-labs/core';

export interface CreateSplitBillUseCase {
  execute(params: CreateSplitBillParams): Promise<SplitBillDetail>;
}

export class CreateSplitBillUseCaseImpl implements CreateSplitBillUseCase {
  constructor(
    private readonly repository: SplitBillRepository,
    private readonly savePaymentAccountsUseCase: SavePaymentAccountsUseCase,
  ) {}

  async execute(params: CreateSplitBillParams): Promise<SplitBillDetail> {
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
    if (params.participants.filter((p) => p.isCreator).length > 1) {
      throw new ValidationError('At most one participant can be marked as creator');
    }
    const bill = await this.repository.create(params);
    await this.savePaymentAccountsUseCase.execute({
      userId: params.userId,
      accounts: params.accounts,
    });
    return bill;
  }
}
