import type { Budget, MonthlyBudgetApplication } from '@/domain/entities/Budget';

export interface BudgetRepository {
  getByMonth(userId: string, year: number, month: number): Promise<Budget[]>;
  upsertMany(budgets: Omit<Budget, 'id'>[]): Promise<void>;
  getApplication(userId: string, year: number, month: number): Promise<MonthlyBudgetApplication | null>;
  getLastApplication(userId: string): Promise<MonthlyBudgetApplication | null>;
  applyBudgetSetting(
    userId: string,
    budgetSettingId: string,
    year: number,
    month: number
  ): Promise<void>;
}
