import type { BudgetSetting } from '@/features/budget-settings/domain/entities/BudgetSetting';
import type { BudgetSettingRepository } from '@/features/budget-settings/domain/repositories/BudgetSettingRepository';

export interface GetBudgetSettingByIdUseCase {
  execute(id: string): Promise<BudgetSetting | null>;
}

export class GetBudgetSettingByIdUseCaseImpl implements GetBudgetSettingByIdUseCase {
  constructor(private readonly repository: BudgetSettingRepository) {}

  async execute(id: string): Promise<BudgetSetting | null> {
    return this.repository.getById(id);
  }
}
