import type {
  BudgetSetting as DbBudgetSetting,
  BudgetSettingItem as DbBudgetSettingItem,
  NewBudgetSetting,
  NewBudgetSettingItem,
} from '@/lib/schema';

export interface BudgetSettingItemRecord extends DbBudgetSettingItem {
  categoryName: string;
  masterCategory: 'daily' | 'weekly' | 'monthly' | null;
}

export interface BudgetSettingRecord extends DbBudgetSetting {
  items: BudgetSettingItemRecord[];
}

export interface BudgetSettingDataSource {
  getByUser(userId: string): Promise<BudgetSettingRecord[]>;
  getById(id: string): Promise<BudgetSettingRecord | null>;
  create(
    data: Omit<NewBudgetSetting, 'id' | 'createdAt'>,
    items: Array<Omit<NewBudgetSettingItem, 'id' | 'budgetSettingId'>>
  ): Promise<BudgetSettingRecord>;
  update(
    id: string,
    data: Partial<Pick<NewBudgetSetting, 'name' | 'totalMonthlyBudget'>>,
    items?: Array<Omit<NewBudgetSettingItem, 'id' | 'budgetSettingId'>>
  ): Promise<BudgetSettingRecord>;
  delete(id: string): Promise<void>;
}
