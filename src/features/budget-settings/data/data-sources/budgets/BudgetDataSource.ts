export interface BudgetRecord {
  id: string;
  userId: string;
  categoryId: string;
  amount: string;
  month: number;
  year: number;
  createdAt: Date;
}

export interface MonthlyBudgetApplicationRecord {
  id: string;
  userId: string;
  budgetSettingId: string;
  month: number;
  year: number;
}

export interface BudgetDataSource {
  getByMonth(userId: string, year: number, month: number): Promise<BudgetRecord[]>;
  upsertMany(budgets: Array<{
    userId: string;
    categoryId: string;
    amount: string;
    month: number;
    year: number;
  }>): Promise<void>;
  getApplication(
    userId: string,
    year: number,
    month: number
  ): Promise<MonthlyBudgetApplicationRecord | null>;
  getLastApplication(userId: string): Promise<MonthlyBudgetApplicationRecord | null>;
  upsertApplication(
    data: { userId: string; budgetSettingId: string; month: number; year: number }
  ): Promise<MonthlyBudgetApplicationRecord>;
}
