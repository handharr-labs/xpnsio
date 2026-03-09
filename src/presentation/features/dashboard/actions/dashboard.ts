'use server';

import { z } from 'zod';
import { authActionClient } from '@/lib/safe-action';
import { createServerContainer } from '@/di/container.server';

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
    const container = createServerContainer();
    const data = await container.getDashboardDataUseCase.execute({ userId: user.id, year, month });
    return { ...data, year, month };
  });
