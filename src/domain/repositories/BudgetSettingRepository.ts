import type { BudgetSetting } from '@/domain/entities/BudgetSetting';

export interface BudgetSettingRepository {
  getByUser(userId: string): Promise<BudgetSetting[]>;
  getById(id: string): Promise<BudgetSetting | null>;
  create(data: {
    userId: string;
    name: string;
    totalMonthlyBudget: number;
    items: Array<{ categoryId: string; monthlyAmount: number }>;
  }): Promise<BudgetSetting>;
  update(
    id: string,
    data: {
      name?: string;
      totalMonthlyBudget?: number;
      items?: Array<{ categoryId: string; monthlyAmount: number }>;
    }
  ): Promise<BudgetSetting>;
  delete(id: string): Promise<void>;
}
