'use server';

import { z } from 'zod';
import { authActionClient } from '@/lib/safe-action';
import { createServerContainer } from '@/shared/di/container.server';

export const completeSetupAction = authActionClient
  .schema(
    z.object({
      budgetName: z.string().min(1),
      currency: z.string().min(1).default('IDR'),
      startDay: z.number().int().min(1).max(28),
      totalBudget: z.number().nonnegative(),
      categories: z.array(
        z.object({
          name: z.string().min(1),
          masterCategory: z.enum(['daily', 'weekly', 'monthly']),
          color: z.string().min(1),
          icon: z.string().min(1),
          amount: z.number().nonnegative(),
        })
      ),
    })
  )
  .action(async ({ parsedInput, ctx: { user } }) => {
    const container = createServerContainer();

    const createdItems: Array<{ categoryId: string; monthlyAmount: number }> = [];
    for (const cat of parsedInput.categories) {
      const category = await container.createCategoryUseCase.execute({
        userId: user.id,
        name: cat.name.trim(),
        masterCategory: cat.masterCategory,
        color: cat.color,
        icon: cat.icon,
      });
      createdItems.push({ categoryId: category.id, monthlyAmount: cat.amount });
    }

    const filteredItems = createdItems.filter((c) => c.monthlyAmount > 0);
    const totalMonthlyBudget =
      parsedInput.totalBudget ||
      filteredItems.reduce((s, c) => s + c.monthlyAmount, 0);

    const budgetSetting = await container.createBudgetSettingUseCase.execute({
      userId: user.id,
      name: parsedInput.budgetName.trim() || 'My Budget',
      totalMonthlyBudget,
      currency: parsedInput.currency,
      starterDay: parsedInput.startDay,
      items: filteredItems,
    });

    const now = new Date();
    await container.applyBudgetSettingUseCase.execute({
      userId: user.id,
      budgetSettingId: budgetSetting.id,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    });

    return { success: true };
  });
