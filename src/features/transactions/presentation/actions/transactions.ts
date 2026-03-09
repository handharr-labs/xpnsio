'use server';

import { z } from 'zod';
import { authActionClient } from '@/lib/safe-action';
import { createServerContainer } from '@/shared/di/container.server';

export const getTransactionsAction = authActionClient
  .schema(
    z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      categoryId: z.string().uuid().optional(),
      type: z.enum(['income', 'expense']).optional(),
      limit: z.number().int().positive().optional(),
      offset: z.number().int().min(0).optional(),
    })
  )
  .action(async ({ parsedInput, ctx: { user } }) => {
    const container = createServerContainer();
    return container.getTransactionsUseCase.execute({ userId: user.id, ...parsedInput });
  });

export const createTransactionAction = authActionClient
  .schema(
    z.object({
      categoryId: z.string().uuid().optional(),
      amount: z.number().positive(),
      type: z.enum(['income', 'expense']),
      description: z.string().optional(),
      date: z.string(),
    })
  )
  .action(async ({ parsedInput, ctx: { user } }) => {
    const container = createServerContainer();
    return container.createTransactionUseCase.execute({ userId: user.id, ...parsedInput });
  });

export const updateTransactionAction = authActionClient
  .schema(
    z.object({
      id: z.string().uuid(),
      categoryId: z.string().uuid().optional(),
      amount: z.number().positive().optional(),
      type: z.enum(['income', 'expense']).optional(),
      description: z.string().optional(),
      date: z.string().optional(),
    })
  )
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    const container = createServerContainer();
    return container.updateTransactionUseCase.execute(id, data);
  });

export const deleteTransactionAction = authActionClient
  .schema(z.object({ id: z.string().uuid() }))
  .action(async ({ parsedInput }) => {
    const container = createServerContainer();
    await container.deleteTransactionUseCase.execute(parsedInput.id);
    return { success: true };
  });
