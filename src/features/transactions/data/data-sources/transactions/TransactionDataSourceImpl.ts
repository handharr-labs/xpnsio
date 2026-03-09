import { and, eq, gte, lte, sql, sum } from 'drizzle-orm';
import { db } from '@/lib/db';
import { transactions, categories } from '@/lib/schema';
import type { TransactionDataSource, TransactionRecord, TransactionFilterParams } from './TransactionDataSource';
import type { NewTransaction } from '@/lib/schema';

export class TransactionDataSourceImpl implements TransactionDataSource {
  async getFiltered(params: TransactionFilterParams): Promise<TransactionRecord[]> {
    const conditions = [eq(transactions.userId, params.userId)];

    if (params.startDate) {
      conditions.push(gte(transactions.date, params.startDate));
    }
    if (params.endDate) {
      conditions.push(lte(transactions.date, params.endDate));
    }
    if (params.categoryId) {
      conditions.push(eq(transactions.categoryId, params.categoryId));
    }
    if (params.type) {
      conditions.push(eq(transactions.type, params.type));
    }

    const query = db
      .select({
        id: transactions.id,
        userId: transactions.userId,
        categoryId: transactions.categoryId,
        amount: transactions.amount,
        type: transactions.type,
        description: transactions.description,
        date: transactions.date,
        createdAt: transactions.createdAt,
        updatedAt: transactions.updatedAt,
        categoryName: categories.name,
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(and(...conditions))
      .orderBy(sql`${transactions.date} DESC, ${transactions.createdAt} DESC`);

    if (params.limit !== undefined) {
      const rows = await query.limit(params.limit).offset(params.offset ?? 0);
      return rows.map((r) => ({ ...r, categoryName: r.categoryName ?? null }));
    }

    const rows = await query;
    return rows.map((r) => ({ ...r, categoryName: r.categoryName ?? null }));
  }

  async getById(id: string): Promise<TransactionRecord | null> {
    const rows = await db
      .select({
        id: transactions.id,
        userId: transactions.userId,
        categoryId: transactions.categoryId,
        amount: transactions.amount,
        type: transactions.type,
        description: transactions.description,
        date: transactions.date,
        createdAt: transactions.createdAt,
        updatedAt: transactions.updatedAt,
        categoryName: categories.name,
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(eq(transactions.id, id))
      .limit(1);

    if (!rows[0]) return null;
    return { ...rows[0], categoryName: rows[0].categoryName ?? null };
  }

  async create(
    data: Omit<NewTransaction, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<TransactionRecord> {
    const inserted = await db.insert(transactions).values(data).returning();
    const row = inserted[0];
    // Fetch with join to get categoryName
    if (row.categoryId) {
      const full = await this.getById(row.id);
      if (full) return full;
    }
    return { ...row, categoryName: null };
  }

  async update(
    id: string,
    data: Partial<Pick<NewTransaction, 'amount' | 'categoryId' | 'description' | 'date' | 'type'>>
  ): Promise<TransactionRecord> {
    await db
      .update(transactions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(transactions.id, id));

    const full = await this.getById(id);
    if (!full) throw new Error(`Transaction ${id} not found after update`);
    return full;
  }

  async delete(id: string): Promise<void> {
    await db.delete(transactions).where(eq(transactions.id, id));
  }

  async sumByMonth(
    userId: string,
    year: number,
    month: number,
    type: 'income' | 'expense'
  ): Promise<string> {
    const monthStr = String(month).padStart(2, '0');
    const startDate = `${year}-${monthStr}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${monthStr}-${String(lastDay).padStart(2, '0')}`;

    const rows = await db
      .select({ total: sum(transactions.amount) })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.type, type),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      );

    return rows[0]?.total ?? '0';
  }

  async getByMonthAndCategory(
    userId: string,
    year: number,
    month: number,
    categoryId: string
  ): Promise<TransactionRecord[]> {
    const monthStr = String(month).padStart(2, '0');
    const startDate = `${year}-${monthStr}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${monthStr}-${String(lastDay).padStart(2, '0')}`;

    const rows = await db
      .select({
        id: transactions.id,
        userId: transactions.userId,
        categoryId: transactions.categoryId,
        amount: transactions.amount,
        type: transactions.type,
        description: transactions.description,
        date: transactions.date,
        createdAt: transactions.createdAt,
        updatedAt: transactions.updatedAt,
        categoryName: categories.name,
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.categoryId, categoryId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )
      .orderBy(sql`${transactions.date} ASC`);

    return rows.map((r) => ({ ...r, categoryName: r.categoryName ?? null }));
  }
}
