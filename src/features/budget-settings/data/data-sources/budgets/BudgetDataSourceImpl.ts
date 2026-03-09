import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { budgets, monthlyBudgetApplications } from '@/lib/schema';
import type {
  BudgetDataSource,
  BudgetRecord,
  MonthlyBudgetApplicationRecord,
} from './BudgetDataSource';
import type { NewBudget, NewMonthlyBudgetApplication } from '@/lib/schema';

export class BudgetDataSourceImpl implements BudgetDataSource {
  async getByMonth(userId: string, year: number, month: number): Promise<BudgetRecord[]> {
    return db
      .select()
      .from(budgets)
      .where(
        and(
          eq(budgets.userId, userId),
          eq(budgets.year, year),
          eq(budgets.month, month)
        )
      );
  }

  async upsertMany(items: Omit<NewBudget, 'id' | 'createdAt'>[]): Promise<void> {
    if (items.length === 0) return;

    await db
      .insert(budgets)
      .values(items)
      .onConflictDoUpdate({
        target: [budgets.userId, budgets.categoryId, budgets.year, budgets.month],
        set: { amount: sql`excluded.amount` },
      });
  }

  async getApplication(
    userId: string,
    year: number,
    month: number
  ): Promise<MonthlyBudgetApplicationRecord | null> {
    const rows = await db
      .select()
      .from(monthlyBudgetApplications)
      .where(
        and(
          eq(monthlyBudgetApplications.userId, userId),
          eq(monthlyBudgetApplications.year, year),
          eq(monthlyBudgetApplications.month, month)
        )
      )
      .limit(1);
    return rows[0] ?? null;
  }

  async getLastApplication(userId: string): Promise<MonthlyBudgetApplicationRecord | null> {
    const rows = await db
      .select()
      .from(monthlyBudgetApplications)
      .where(eq(monthlyBudgetApplications.userId, userId))
      .orderBy(
        desc(monthlyBudgetApplications.year),
        desc(monthlyBudgetApplications.month)
      )
      .limit(1);
    return rows[0] ?? null;
  }

  async upsertApplication(
    data: Omit<NewMonthlyBudgetApplication, 'id'>
  ): Promise<MonthlyBudgetApplicationRecord> {
    const rows = await db
      .insert(monthlyBudgetApplications)
      .values(data)
      .onConflictDoUpdate({
        target: [
          monthlyBudgetApplications.userId,
          monthlyBudgetApplications.month,
          monthlyBudgetApplications.year,
        ],
        set: { budgetSettingId: data.budgetSettingId },
      })
      .returning();
    return rows[0];
  }
}
