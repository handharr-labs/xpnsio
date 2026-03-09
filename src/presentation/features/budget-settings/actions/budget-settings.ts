'use server';

import { z } from 'zod';
import { authActionClient } from '@/lib/safe-action';
import { createServerContainer } from '@/di/container.server';

export const getBudgetSettingsAction = authActionClient
  .schema(z.object({}))
  .action(async ({ ctx: { user } }) => {
    const container = createServerContainer();
    return container.getBudgetSettingsUseCase.execute(user.id);
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
    const container = createServerContainer();
    return container.createBudgetSettingUseCase.execute({
      userId: user.id,
      name: parsedInput.name,
      totalMonthlyBudget: parsedInput.totalMonthlyBudget,
      items: parsedInput.items,
    });
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
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    const container = createServerContainer();
    return container.updateBudgetSettingUseCase.execute(id, data);
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
    const container = createServerContainer();
    await container.applyBudgetSettingUseCase.execute({
      userId: user.id,
      ...parsedInput,
    });
    return { success: true };
  });

export const deleteBudgetSettingAction = authActionClient
  .schema(z.object({ id: z.string().uuid() }))
  .action(async ({ parsedInput }) => {
    const container = createServerContainer();
    await container.deleteBudgetSettingUseCase.execute(parsedInput.id);
    return { success: true };
  });
