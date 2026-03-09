import type { BudgetSetting } from '@/features/budget-settings/domain/entities/BudgetSetting';
import type { BudgetSettingRepository } from '@/features/budget-settings/domain/repositories/BudgetSettingRepository';

export interface UpdateBudgetSettingInput {
  name?: string;
  totalMonthlyBudget?: number;
  items?: Array<{ categoryId: string; monthlyAmount: number }>;
}

export interface UpdateBudgetSettingUseCase {
  execute(id: string, data: UpdateBudgetSettingInput): Promise<BudgetSetting>;
}

export class UpdateBudgetSettingUseCaseImpl implements UpdateBudgetSettingUseCase {
  constructor(private readonly repository: BudgetSettingRepository) {}

  async execute(id: string, data: UpdateBudgetSettingInput): Promise<BudgetSetting> {
    return this.repository.update(id, data);
  }
}
