import type {
  Category as DbCategory,
  NewCategory,
} from '@/lib/schema';

export type CategoryRecord = DbCategory;

export interface CategoryDataSource {
  getByUser(userId: string): Promise<CategoryRecord[]>;
  getById(id: string): Promise<CategoryRecord | null>;
  create(data: Omit<NewCategory, 'id' | 'createdAt'>): Promise<CategoryRecord>;
  update(
    id: string,
    data: Partial<Pick<NewCategory, 'name' | 'color' | 'icon' | 'masterCategory'>>
  ): Promise<CategoryRecord>;
  delete(id: string): Promise<void>;
  countTransactions(id: string): Promise<number>;
}
