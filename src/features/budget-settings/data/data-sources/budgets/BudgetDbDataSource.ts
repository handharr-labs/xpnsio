export interface BudgetRecord {
  readonly id: string;
  readonly userId: string;
  readonly categoryId: string;
  readonly amount: string;
  readonly month: number;
  readonly year: number;
  readonly createdAt: Date;
}

export interface MonthlyBudgetApplicationRecord {
  readonly id: string;
  readonly userId: string;
  readonly budgetSettingId: string;
  readonly month: number;
  readonly year: number;
}

export interface BudgetDbDataSource {
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
