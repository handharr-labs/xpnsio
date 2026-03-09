'use server';

import { z } from 'zod';
import { authActionClient } from '@/lib/safe-action';
import { createServerContainer } from '@/di/container.server';

export const getCategoriesAction = authActionClient
  .schema(z.object({}))
  .action(async ({ ctx: { user } }) => {
    const container = createServerContainer();
    return container.getCategoriesUseCase.execute(user.id);
  });

export const createCategoryAction = authActionClient
  .schema(
    z.object({
      name: z.string().min(1),
      masterCategory: z.enum(['daily', 'weekly', 'monthly']),
      color: z.string().min(1),
      icon: z.string().min(1),
    })
  )
  .action(async ({ parsedInput, ctx: { user } }) => {
    const container = createServerContainer();
    return container.createCategoryUseCase.execute({ userId: user.id, ...parsedInput });
  });

export const updateCategoryAction = authActionClient
  .schema(
    z.object({
      id: z.string().uuid(),
      name: z.string().min(1).optional(),
      masterCategory: z.enum(['daily', 'weekly', 'monthly']).optional(),
      color: z.string().optional(),
      icon: z.string().optional(),
    })
  )
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    const container = createServerContainer();
    return container.updateCategoryUseCase.execute(id, data);
  });

export const deleteCategoryAction = authActionClient
  .schema(z.object({ id: z.string().uuid() }))
  .action(async ({ parsedInput }) => {
    const container = createServerContainer();
    return container.deleteCategoryUseCase.execute(parsedInput.id);
  });
