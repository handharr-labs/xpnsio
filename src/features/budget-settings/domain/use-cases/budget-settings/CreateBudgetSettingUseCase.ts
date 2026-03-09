import type { BudgetSetting } from '@/features/budget-settings/domain/entities/BudgetSetting';
import type { BudgetSettingRepository } from '@/features/budget-settings/domain/repositories/BudgetSettingRepository';

export interface CreateBudgetSettingInput {
  userId: string;
  name: string;
  totalMonthlyBudget: number;
  currency: string;
  starterDay?: number;
  items: Array<{ categoryId: string; monthlyAmount: number }>;
}

export interface CreateBudgetSettingUseCase {
  execute(data: CreateBudgetSettingInput): Promise<BudgetSetting>;
}

export class CreateBudgetSettingUseCaseImpl implements CreateBudgetSettingUseCase {
  constructor(private readonly repository: BudgetSettingRepository) {}

  async execute(data: CreateBudgetSettingInput): Promise<BudgetSetting> {
    return this.repository.create(data);
  }
}
