export type MasterCategory = 'daily' | 'weekly' | 'monthly';

export interface Category {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly type: 'income' | 'expense';
  readonly masterCategory: MasterCategory | null; // null = income category
  readonly color: string;
  readonly icon: string;
  readonly createdAt: Date;
}
