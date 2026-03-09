import { and, desc, eq } from 'drizzle-orm';
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

    // Since budgets table has no unique constraint on (userId, categoryId, year, month),
    // we delete existing rows for the affected (userId, year, month) combos then insert fresh.
    // Group by userId/year/month to avoid repeated deletes.
    const seen = new Set<string>();
    for (const item of items) {
      const key = `${item.userId}:${item.year}:${item.month}`;
      if (!seen.has(key)) {
        seen.add(key);
        await db
          .delete(budgets)
          .where(
            and(
              eq(budgets.userId, item.userId),
              eq(budgets.year, item.year),
              eq(budgets.month, item.month)
            )
          );
      }
    }

    await db.insert(budgets).values(items);
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
