export interface BudgetSettingItem {
  readonly id: string;
  readonly budgetSettingId: string;
  readonly categoryId: string;
  readonly categoryName: string; // joined
  readonly masterCategory: 'daily' | 'weekly' | 'monthly' | null;
  readonly monthlyAmount: number;
}

export interface BudgetSetting {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly totalMonthlyBudget: number;
  readonly currency: string;
  readonly starterDay: number;
  readonly items: BudgetSettingItem[];
  readonly createdAt: Date;
}
