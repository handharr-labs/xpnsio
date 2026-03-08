'use server';

import { z } from 'zod';
import { authActionClient } from '@/lib/safe-action';
import { db } from '@/lib/db';
import { transactions } from '@/lib/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';

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
    const conditions = [eq(transactions.userId, user.id)];

    if (parsedInput.startDate) {
      conditions.push(gte(transactions.date, parsedInput.startDate));
    }
    if (parsedInput.endDate) {
      conditions.push(lte(transactions.date, parsedInput.endDate));
    }
    if (parsedInput.categoryId) {
      conditions.push(eq(transactions.categoryId, parsedInput.categoryId));
    }
    if (parsedInput.type) {
      conditions.push(eq(transactions.type, parsedInput.type));
    }

    const query = db
      .select()
      .from(transactions)
      .where(and(...conditions))
      .orderBy(desc(transactions.date), desc(transactions.createdAt))
      .limit(parsedInput.limit ?? 50)
      .offset(parsedInput.offset ?? 0);

    return query;
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
    const [created] = await db
      .insert(transactions)
      .values({
        userId: user.id,
        categoryId: parsedInput.categoryId ?? null,
        amount: parsedInput.amount.toString(),
        type: parsedInput.type,
        description: parsedInput.description ?? null,
        date: parsedInput.date,
      })
      .returning();
    return created;
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
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { id, amount, ...fields } = parsedInput;

    const updateFields: Record<string, unknown> = { ...fields };
    if (amount !== undefined) {
      updateFields.amount = amount.toString();
    }
    updateFields.updatedAt = new Date();

    const [updated] = await db
      .update(transactions)
      .set(updateFields)
      .where(and(eq(transactions.id, id), eq(transactions.userId, user.id)))
      .returning();
    return updated;
  });

export const deleteTransactionAction = authActionClient
  .schema(z.object({ id: z.string().uuid() }))
  .action(async ({ parsedInput, ctx: { user } }) => {
    await db
      .delete(transactions)
      .where(
        and(eq(transactions.id, parsedInput.id), eq(transactions.userId, user.id))
      );
    return { success: true };
  });
