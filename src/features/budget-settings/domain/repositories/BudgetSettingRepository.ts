import type { BudgetSetting } from '@/features/budget-settings/domain/entities/BudgetSetting';

export interface BudgetSettingRepository {
  getByUser(userId: string): Promise<BudgetSetting[]>;
  getById(id: string): Promise<BudgetSetting | null>;
  create(data: {
    userId: string;
    name: string;
    totalMonthlyBudget: number;
    currency: string;
    starterDay?: number;
    items: Array<{ categoryId: string; monthlyAmount: number }>;
  }): Promise<BudgetSetting>;
  update(
    id: string,
    data: {
      name?: string;
      totalMonthlyBudget?: number;
      starterDay?: number;
      items?: Array<{ categoryId: string; monthlyAmount: number }>;
    }
  ): Promise<BudgetSetting>;
  delete(id: string): Promise<void>;
}
