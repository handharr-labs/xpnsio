export type MasterCategory = 'daily' | 'weekly' | 'monthly';

export interface Category {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly masterCategory: MasterCategory;
  readonly color: string;
  readonly icon: string;
  readonly createdAt: Date;
}
