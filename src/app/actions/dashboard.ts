'use server';

import { z } from 'zod';
import { authActionClient } from '@/lib/safe-action';
import { db } from '@/lib/db';
import {
  categories,
  transactions,
  budgets,
  budgetSettings,
  budgetSettingItems,
  monthlyBudgetApplications,
} from '@/lib/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';

export const getDashboardDataAction = authActionClient
  .schema(
    z.object({
      year: z.number().int().optional(),
      month: z.number().int().min(1).max(12).optional(),
    })
  )
  .action(async ({ parsedInput, ctx: { user } }) => {
    const now = new Date();
    const year = parsedInput.year ?? now.getFullYear();
    const month = parsedInput.month ?? now.getMonth() + 1;

    // Date range for this month
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    // Get active budget application for this month
    const [application] = await db
      .select()
      .from(monthlyBudgetApplications)
      .where(
        and(
          eq(monthlyBudgetApplications.userId, user.id),
          eq(monthlyBudgetApplications.year, year),
          eq(monthlyBudgetApplications.month, month)
        )
      )
      .limit(1);

    // Get applied budget setting if any
    let activeBudgetSetting = null;
    let budgetSettingItemsList: Array<{
      categoryId: string;
      monthlyAmount: string;
    }> = [];

    if (application) {
      const [setting] = await db
        .select()
        .from(budgetSettings)
        .where(eq(budgetSettings.id, application.budgetSettingId))
        .limit(1);

      activeBudgetSetting = setting ?? null;

      budgetSettingItemsList = await db
        .select()
        .from(budgetSettingItems)
        .where(eq(budgetSettingItems.budgetSettingId, application.budgetSettingId));
    }

    // Get all user categories
    const userCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.userId, user.id));

    // Get budgets for this month
    const monthlyBudgets = await db
      .select()
      .from(budgets)
      .where(
        and(
          eq(budgets.userId, user.id),
          eq(budgets.year, year),
          eq(budgets.month, month)
        )
      );

    // Get transactions for this month
    const monthlyTransactions = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, user.id),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )
      .orderBy(desc(transactions.date), desc(transactions.createdAt));

    // Compute totals
    const totalIncome = monthlyTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpense = monthlyTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalBudget = activeBudgetSetting
      ? parseFloat(activeBudgetSetting.totalMonthlyBudget)
      : 0;

    const remaining = totalBudget - totalExpense;

    // Per-category spending
    const categorySpending = userCategories.map((cat) => {
      const budget = monthlyBudgets.find((b) => b.categoryId === cat.id);
      const spent = monthlyTransactions
        .filter((t) => t.categoryId === cat.id && t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const budgetAmount = budget ? parseFloat(budget.amount) : 0;
      return {
        category: cat,
        budgetAmount,
        spent,
        remaining: budgetAmount - spent,
      };
    });

    // Recent transactions (last 5)
    const recentTransactions = monthlyTransactions.slice(0, 5).map((t) => {
      const category = userCategories.find((c) => c.id === t.categoryId) ?? null;
      return { ...t, category };
    });

    return {
      year,
      month,
      activeBudgetSetting,
      budgetSettingItems: budgetSettingItemsList,
      totalIncome,
      totalExpense,
      totalBudget,
      remaining,
      categorySpending,
      recentTransactions,
    };
  });
