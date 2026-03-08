import type { Category } from '@/domain/entities/Category';

export interface CategoryRepository {
  getByUser(userId: string): Promise<Category[]>;
  getById(id: string): Promise<Category | null>;
  create(data: Omit<Category, 'id' | 'createdAt'>): Promise<Category>;
  update(
    id: string,
    data: Partial<Pick<Category, 'name' | 'color' | 'icon' | 'masterCategory'>>
  ): Promise<Category>;
  delete(id: string): Promise<void>;
  hasTransactions(id: string): Promise<boolean>;
}
