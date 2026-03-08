import type {
  Budget as DbBudget,
  MonthlyBudgetApplication as DbMonthlyBudgetApplication,
  NewBudget,
  NewMonthlyBudgetApplication,
} from '@/lib/schema';

export type BudgetRecord = DbBudget;
export type MonthlyBudgetApplicationRecord = DbMonthlyBudgetApplication;

export interface BudgetDataSource {
  getByMonth(userId: string, year: number, month: number): Promise<BudgetRecord[]>;
  upsertMany(budgets: Omit<NewBudget, 'id' | 'createdAt'>[]): Promise<void>;
  getApplication(
    userId: string,
    year: number,
    month: number
  ): Promise<MonthlyBudgetApplicationRecord | null>;
  getLastApplication(userId: string): Promise<MonthlyBudgetApplicationRecord | null>;
  upsertApplication(
    data: Omit<NewMonthlyBudgetApplication, 'id'>
  ): Promise<MonthlyBudgetApplicationRecord>;
}
