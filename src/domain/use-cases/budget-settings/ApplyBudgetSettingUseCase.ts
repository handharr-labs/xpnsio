import type { BudgetSettingRepository } from '@/domain/repositories/BudgetSettingRepository';
import type { BudgetRepository } from '@/domain/repositories/BudgetRepository';
import { DomainError } from '@/domain/errors/DomainError';

export interface ApplyBudgetSettingParams {
  userId: string;
  budgetSettingId: string;
  year: number;
  month: number;
}

export interface ApplyBudgetSettingUseCase {
  execute(params: ApplyBudgetSettingParams): Promise<void>;
}

export class ApplyBudgetSettingUseCaseImpl implements ApplyBudgetSettingUseCase {
  constructor(
    private readonly budgetSettingRepository: BudgetSettingRepository,
    private readonly budgetRepository: BudgetRepository
  ) {}

  async execute(params: ApplyBudgetSettingParams): Promise<void> {
    const { userId, budgetSettingId, year, month } = params;

    const setting = await this.budgetSettingRepository.getById(budgetSettingId);
    if (!setting) {
      throw DomainError.notFound('BudgetSetting', budgetSettingId);
    }

    await this.budgetRepository.applyBudgetSetting(userId, budgetSettingId, year, month);
  }
}
