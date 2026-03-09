import { eq, count } from 'drizzle-orm';
import { db } from '@/lib/db';
import { categories, transactions } from '@/lib/schema';
import type { CategoryDataSource, CategoryRecord } from './CategoryDataSource';
import type { NewCategory } from '@/lib/schema';

export class CategoryDataSourceImpl implements CategoryDataSource {
  async getByUser(userId: string): Promise<CategoryRecord[]> {
    return db
      .select()
      .from(categories)
      .where(eq(categories.userId, userId));
  }

  async getById(id: string): Promise<CategoryRecord | null> {
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
    return rows[0] ?? null;
  }

  async create(data: Omit<NewCategory, 'id' | 'createdAt'>): Promise<CategoryRecord> {
    const rows = await db
      .insert(categories)
      .values(data)
      .returning();
    return rows[0];
  }

  async update(
    id: string,
    data: Partial<Pick<NewCategory, 'name' | 'color' | 'icon' | 'masterCategory'>>
  ): Promise<CategoryRecord> {
    const rows = await db
      .update(categories)
      .set(data)
      .where(eq(categories.id, id))
      .returning();
    return rows[0];
  }

  async delete(id: string): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  async countTransactions(id: string): Promise<number> {
    const rows = await db
      .select({ count: count() })
      .from(transactions)
      .where(eq(transactions.categoryId, id));
    return rows[0]?.count ?? 0;
  }
}
