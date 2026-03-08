import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { budgetSettings, budgetSettingItems, categories } from '@/lib/schema';
import type {
  BudgetSettingDataSource,
  BudgetSettingRecord,
  BudgetSettingItemRecord,
} from './BudgetSettingDataSource';
import type { NewBudgetSetting, NewBudgetSettingItem } from '@/lib/schema';

export class BudgetSettingDataSourceImpl implements BudgetSettingDataSource {
  async getByUser(userId: string): Promise<BudgetSettingRecord[]> {
    const settings = await db
      .select()
      .from(budgetSettings)
      .where(eq(budgetSettings.userId, userId));

    return Promise.all(settings.map((s) => this.attachItems(s)));
  }

  async getById(id: string): Promise<BudgetSettingRecord | null> {
    const rows = await db
      .select()
      .from(budgetSettings)
      .where(eq(budgetSettings.id, id))
      .limit(1);
    if (!rows[0]) return null;
    return this.attachItems(rows[0]);
  }

  async create(
    data: Omit<NewBudgetSetting, 'id' | 'createdAt'>,
    items: Array<Omit<NewBudgetSettingItem, 'id' | 'budgetSettingId'>>
  ): Promise<BudgetSettingRecord> {
    const [setting] = await db.insert(budgetSettings).values(data).returning();

    if (items.length > 0) {
      await db.insert(budgetSettingItems).values(
        items.map((item) => ({ ...item, budgetSettingId: setting.id }))
      );
    }

    return this.attachItems(setting);
  }

  async update(
    id: string,
    data: Partial<Pick<NewBudgetSetting, 'name' | 'totalMonthlyBudget'>>,
    items?: Array<Omit<NewBudgetSettingItem, 'id' | 'budgetSettingId'>>
  ): Promise<BudgetSettingRecord> {
    if (Object.keys(data).length > 0) {
      await db.update(budgetSettings).set(data).where(eq(budgetSettings.id, id));
    }

    if (items !== undefined) {
      // Replace all items
      await db.delete(budgetSettingItems).where(eq(budgetSettingItems.budgetSettingId, id));
      if (items.length > 0) {
        await db.insert(budgetSettingItems).values(
          items.map((item) => ({ ...item, budgetSettingId: id }))
        );
      }
    }

    const setting = await db
      .select()
      .from(budgetSettings)
      .where(eq(budgetSettings.id, id))
      .limit(1)
      .then((r) => r[0]);

    return this.attachItems(setting);
  }

  async delete(id: string): Promise<void> {
    await db.delete(budgetSettings).where(eq(budgetSettings.id, id));
  }

  private async attachItems(
    setting: typeof budgetSettings.$inferSelect
  ): Promise<BudgetSettingRecord> {
    const itemRows = await db
      .select({
        id: budgetSettingItems.id,
        budgetSettingId: budgetSettingItems.budgetSettingId,
        categoryId: budgetSettingItems.categoryId,
        monthlyAmount: budgetSettingItems.monthlyAmount,
        categoryName: categories.name,
        masterCategory: categories.masterCategory,
      })
      .from(budgetSettingItems)
      .leftJoin(categories, eq(budgetSettingItems.categoryId, categories.id))
      .where(eq(budgetSettingItems.budgetSettingId, setting.id));

    const mappedItems: BudgetSettingItemRecord[] = itemRows.map((row) => ({
      id: row.id,
      budgetSettingId: row.budgetSettingId,
      categoryId: row.categoryId,
      monthlyAmount: row.monthlyAmount,
      categoryName: row.categoryName ?? '',
      masterCategory: row.masterCategory ?? null,
    }));

    return { ...setting, items: mappedItems };
  }
}
