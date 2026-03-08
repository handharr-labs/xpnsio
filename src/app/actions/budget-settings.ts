'use server';

import { z } from 'zod';
import { authActionClient } from '@/lib/safe-action';
import { db } from '@/lib/db';
import {
  budgetSettings,
  budgetSettingItems,
  budgets,
  monthlyBudgetApplications,
} from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

export const getBudgetSettingsAction = authActionClient
  .schema(z.object({}))
  .action(async ({ ctx: { user } }) => {
    const settings = await db
      .select()
      .from(budgetSettings)
      .where(eq(budgetSettings.userId, user.id))
      .orderBy(budgetSettings.createdAt);

    const settingsWithItems = await Promise.all(
      settings.map(async (setting) => {
        const items = await db
          .select()
          .from(budgetSettingItems)
          .where(eq(budgetSettingItems.budgetSettingId, setting.id));
        return { ...setting, items };
      })
    );

    return settingsWithItems;
  });

export const createBudgetSettingAction = authActionClient
  .schema(
    z.object({
      name: z.string().min(1),
      totalMonthlyBudget: z.number().positive(),
      currency: z.string().min(1).default('IDR'),
      items: z.array(
        z.object({
          categoryId: z.string().uuid(),
          monthlyAmount: z.number().positive(),
        })
      ),
    })
  )
  .action(async ({ parsedInput, ctx: { user } }) => {
    const [setting] = await db
      .insert(budgetSettings)
      .values({
        userId: user.id,
        name: parsedInput.name,
        totalMonthlyBudget: parsedInput.totalMonthlyBudget.toString(),
        currency: parsedInput.currency,
      })
      .returning();

    if (parsedInput.items.length > 0) {
      await db.insert(budgetSettingItems).values(
        parsedInput.items.map((item) => ({
          budgetSettingId: setting.id,
          categoryId: item.categoryId,
          monthlyAmount: item.monthlyAmount.toString(),
        }))
      );
    }

    return setting;
  });

export const updateBudgetSettingAction = authActionClient
  .schema(
    z.object({
      id: z.string().uuid(),
      name: z.string().min(1).optional(),
      totalMonthlyBudget: z.number().positive().optional(),
      currency: z.string().min(1).optional(),
      items: z
        .array(
          z.object({
            categoryId: z.string().uuid(),
            monthlyAmount: z.number().positive(),
          })
        )
        .optional(),
    })
  )
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { id, items, totalMonthlyBudget, currency, ...fields } = parsedInput;

    const updateFields: Record<string, unknown> = { ...fields };
    if (totalMonthlyBudget !== undefined) {
      updateFields.totalMonthlyBudget = totalMonthlyBudget.toString();
    }
    if (currency !== undefined) {
      updateFields.currency = currency;
    }

    const [updated] = await db
      .update(budgetSettings)
      .set(updateFields)
      .where(and(eq(budgetSettings.id, id), eq(budgetSettings.userId, user.id)))
      .returning();

    if (items !== undefined) {
      await db
        .delete(budgetSettingItems)
        .where(eq(budgetSettingItems.budgetSettingId, id));

      if (items.length > 0) {
        await db.insert(budgetSettingItems).values(
          items.map((item) => ({
            budgetSettingId: id,
            categoryId: item.categoryId,
            monthlyAmount: item.monthlyAmount.toString(),
          }))
        );
      }
    }

    return updated;
  });

export const applyBudgetSettingAction = authActionClient
  .schema(
    z.object({
      budgetSettingId: z.string().uuid(),
      year: z.number().int().min(2000).max(2100),
      month: z.number().int().min(1).max(12),
    })
  )
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { budgetSettingId, year, month } = parsedInput;

    // Upsert the monthly budget application record (delete existing then insert)
    await db
      .delete(monthlyBudgetApplications)
      .where(
        and(
          eq(monthlyBudgetApplications.userId, user.id),
          eq(monthlyBudgetApplications.year, year),
          eq(monthlyBudgetApplications.month, month)
        )
      );

    await db.insert(monthlyBudgetApplications).values({
      userId: user.id,
      budgetSettingId,
      year,
      month,
    });

    // Get budget setting items and upsert budget rows
    const items = await db
      .select()
      .from(budgetSettingItems)
      .where(eq(budgetSettingItems.budgetSettingId, budgetSettingId));

    for (const item of items) {
      await db
        .insert(budgets)
        .values({
          userId: user.id,
          categoryId: item.categoryId,
          amount: item.monthlyAmount,
          month,
          year,
        })
        .onConflictDoNothing();
    }

    return { success: true };
  });

export const deleteBudgetSettingAction = authActionClient
  .schema(z.object({ id: z.string().uuid() }))
  .action(async ({ parsedInput, ctx: { user } }) => {
    await db
      .delete(budgetSettings)
      .where(
        and(eq(budgetSettings.id, parsedInput.id), eq(budgetSettings.userId, user.id))
      );
    return { success: true };
  });
