export interface BudgetSettingItemRecord {
  id: string;
  budgetSettingId: string;
  categoryId: string;
  monthlyAmount: string;
  categoryName: string;
  masterCategory: 'daily' | 'weekly' | 'monthly' | null;
}

export interface BudgetSettingRecord {
  id: string;
  userId: string;
  name: string;
  totalMonthlyBudget: string;
  currency: string;
  createdAt: Date;
  items: BudgetSettingItemRecord[];
}

export interface BudgetSettingDataSource {
  getByUser(userId: string): Promise<BudgetSettingRecord[]>;
  getById(id: string): Promise<BudgetSettingRecord | null>;
  create(
    data: {
      userId: string;
      name: string;
      totalMonthlyBudget: string;
      currency?: string;
    },
    items: Array<{ categoryId: string; monthlyAmount: string }>
  ): Promise<BudgetSettingRecord>;
  update(
    id: string,
    data: { name?: string; totalMonthlyBudget?: string },
    items?: Array<{ categoryId: string; monthlyAmount: string }>
  ): Promise<BudgetSettingRecord>;
  delete(id: string): Promise<void>;
}
