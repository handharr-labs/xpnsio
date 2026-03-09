import type { BudgetSetting } from '@/features/budget-settings/domain/entities/BudgetSetting';
import type { BudgetSettingRepository } from '@/features/budget-settings/domain/repositories/BudgetSettingRepository';

export interface GetBudgetSettingsUseCase {
  execute(userId: string): Promise<BudgetSetting[]>;
}

export class GetBudgetSettingsUseCaseImpl implements GetBudgetSettingsUseCase {
  constructor(private readonly repository: BudgetSettingRepository) {}

  async execute(userId: string): Promise<BudgetSetting[]> {
    return this.repository.getByUser(userId);
  }
}
