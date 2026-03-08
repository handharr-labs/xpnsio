'use server';

import { z } from 'zod';
import { authActionClient } from '@/lib/safe-action';
import { db } from '@/lib/db';
import { categories } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

export const getCategoriesAction = authActionClient
  .schema(z.object({}))
  .action(async ({ ctx: { user } }) => {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.userId, user.id))
      .orderBy(categories.createdAt);
    return result;
  });

export const createCategoryAction = authActionClient
  .schema(
    z.object({
      name: z.string().min(1),
      type: z.enum(['income', 'expense']),
      masterCategory: z.enum(['daily', 'weekly', 'monthly']).optional(),
      color: z.string().min(1),
      icon: z.string().min(1),
    })
  )
  .action(async ({ parsedInput, ctx: { user } }) => {
    const [created] = await db
      .insert(categories)
      .values({
        userId: user.id,
        name: parsedInput.name,
        type: parsedInput.type,
        masterCategory: parsedInput.masterCategory ?? null,
        color: parsedInput.color,
        icon: parsedInput.icon,
      })
      .returning();
    return created;
  });

export const updateCategoryAction = authActionClient
  .schema(
    z.object({
      id: z.string().uuid(),
      name: z.string().min(1).optional(),
      color: z.string().optional(),
      icon: z.string().optional(),
      masterCategory: z.enum(['daily', 'weekly', 'monthly']).optional(),
    })
  )
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { id, ...fields } = parsedInput;
    const setData: Partial<typeof fields> & { masterCategory?: 'daily' | 'weekly' | 'monthly' | null } = { ...fields };
    const [updated] = await db
      .update(categories)
      .set(setData)
      .where(and(eq(categories.id, id), eq(categories.userId, user.id)))
      .returning();
    return updated;
  });

export const deleteCategoryAction = authActionClient
  .schema(
    z.object({
      id: z.string().uuid(),
      force: z.boolean().optional(),
    })
  )
  .action(async ({ parsedInput, ctx: { user } }) => {
    await db
      .delete(categories)
      .where(and(eq(categories.id, parsedInput.id), eq(categories.userId, user.id)));
    return { success: true };
  });
