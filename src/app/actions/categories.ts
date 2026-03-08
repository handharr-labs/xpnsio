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
      masterCategory: z.enum(['daily', 'weekly', 'monthly']),
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
        masterCategory: parsedInput.masterCategory,
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
      masterCategory: z.enum(['daily', 'weekly', 'monthly']).optional(),
      color: z.string().optional(),
      icon: z.string().optional(),
    })
  )
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { id, ...fields } = parsedInput;
    const [updated] = await db
      .update(categories)
      .set(fields)
      .where(and(eq(categories.id, id), eq(categories.userId, user.id)))
      .returning();
    return updated;
  });

export const deleteCategoryAction = authActionClient
  .schema(
    z.object({
      id: z.string().uuid(),
    })
  )
  .action(async ({ parsedInput, ctx: { user } }) => {
    await db
      .delete(categories)
      .where(and(eq(categories.id, parsedInput.id), eq(categories.userId, user.id)));
    return { success: true };
  });
