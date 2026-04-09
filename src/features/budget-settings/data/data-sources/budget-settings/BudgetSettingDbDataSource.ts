export interface BudgetSettingItemRecord {
  readonly id: string;
  readonly budgetSettingId: string;
  readonly categoryId: string;
  readonly monthlyAmount: string;
  readonly categoryName: string;
  readonly masterCategory: 'daily' | 'weekly' | 'monthly' | null;
}

export interface BudgetSettingRecord {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly totalMonthlyBudget: string;
  readonly currency: string;
  readonly starterDay: number;
  readonly createdAt: Date;
  readonly items: ReadonlyArray<BudgetSettingItemRecord>;
}

export interface BudgetSettingDbDataSource {
  getByUser(userId: string): Promise<BudgetSettingRecord[]>;
  getById(id: string): Promise<BudgetSettingRecord | null>;
  create(
    data: {
      userId: string;
      name: string;
      totalMonthlyBudget: string;
      currency?: string;
      starterDay?: number;
    },
    items: Array<{ categoryId: string; monthlyAmount: string }>
  ): Promise<BudgetSettingRecord>;
  update(
    id: string,
    data: { name?: string; totalMonthlyBudget?: string; starterDay?: number },
    items?: Array<{ categoryId: string; monthlyAmount: string }>
  ): Promise<BudgetSettingRecord>;
  delete(id: string): Promise<void>;
}
