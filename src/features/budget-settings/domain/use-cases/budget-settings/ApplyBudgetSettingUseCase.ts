import type { BudgetSettingRepository } from '@/features/budget-settings/domain/repositories/BudgetSettingRepository';
import type { BudgetRepository } from '@/features/budget-settings/domain/repositories/BudgetRepository';
import { DomainError } from '@/shared/domain/errors/DomainError';

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

    const items = setting.items.map((item) => ({
      categoryId: item.categoryId,
      monthlyAmount: String(item.monthlyAmount),
    }));

    await this.budgetRepository.applyBudgetSetting(userId, budgetSettingId, items, year, month);
  }
}
