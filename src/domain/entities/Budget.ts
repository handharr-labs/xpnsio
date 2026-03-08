export interface Budget {
  readonly id: string;
  readonly userId: string;
  readonly categoryId: string;
  readonly amount: number;
  readonly month: number; // 1-12
  readonly year: number;
}

export interface MonthlyBudgetApplication {
  readonly id: string;
  readonly userId: string;
  readonly budgetSettingId: string;
  readonly month: number;
  readonly year: number;
}
