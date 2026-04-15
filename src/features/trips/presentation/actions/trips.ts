'use server';

import { z } from 'zod';
import { and, eq, isNull, desc } from 'drizzle-orm';
import { authActionClient, actionClient } from '@/lib/safe-action';
import { createServerContainer } from '@/shared/di/container.server';
import { db } from '@/lib/db';
import { splitBills } from '@/lib/schema';

// ─── Create Trip ────────────────────────────────────────────────────────────

export const createTripAction = authActionClient
  .schema(
    z.object({
      name: z.string().min(1),
      startDate: z.string(), // ISO date string YYYY-MM-DD
      endDate: z.string().nullable(),
      description: z.string().nullable(),
    })
  )
  .action(async ({ parsedInput, ctx: { user } }) => {
    const container = createServerContainer();
    return container.createTripUseCase.execute({
      userId: user.id,
      name: parsedInput.name,
      startDate: new Date(parsedInput.startDate),
      endDate: parsedInput.endDate ? new Date(parsedInput.endDate) : null,
      description: parsedInput.description,
    });
  });

// ─── Get Trip Detail (auth) ──────────────────────────────────────────────────

export const getTripDetailAction = authActionClient
  .schema(z.object({ tripId: z.string().uuid() }))
  .action(async ({ parsedInput, ctx: { user } }) => {
    const container = createServerContainer();
    return container.getTripDetailUseCase.execute({
      tripId: parsedInput.tripId,
      userId: user.id,
    });
  });

// ─── Get Trip Detail (public — no auth) ─────────────────────────────────────

export const getTripDetailPublicAction = actionClient
  .schema(z.object({ tripId: z.string().uuid() }))
  .action(async ({ parsedInput }) => {
    const container = createServerContainer();
    return container.getPublicTripDetailUseCase.execute(parsedInput.tripId);
  });

// ─── List Trips ──────────────────────────────────────────────────────────────

export const listTripsAction = authActionClient
  .schema(z.object({}))
  .action(async ({ ctx: { user } }) => {
    const container = createServerContainer();
    return container.listTripsUseCase.execute({ userId: user.id });
  });

// ─── Delete Trip ─────────────────────────────────────────────────────────────

export const deleteTripAction = authActionClient
  .schema(z.object({ tripId: z.string().uuid() }))
  .action(async ({ parsedInput, ctx: { user } }) => {
    const container = createServerContainer();
    await container.deleteTripUseCase.execute({
      tripId: parsedInput.tripId,
      userId: user.id,
    });
  });

// ─── Add Bills To Trip ───────────────────────────────────────────────────────

export const addBillsToTripAction = authActionClient
  .schema(
    z.object({
      tripId: z.string().uuid(),
      billIds: z.array(z.string().uuid()).min(1),
    })
  )
  .action(async ({ parsedInput, ctx: { user } }) => {
    const container = createServerContainer();
    await container.addBillsToTripUseCase.execute({
      tripId: parsedInput.tripId,
      billIds: parsedInput.billIds,
      userId: user.id,
    });
  });

// ─── Upload Settlement Proof (public — no auth) ──────────────────────────────

export const uploadTripSettlementProofAction = actionClient
  .schema(
    z.object({
      settlementId: z.string().uuid(),
      proofImageUrl: z.string().url(),
    })
  )
  .action(async ({ parsedInput }) => {
    const container = createServerContainer();
    await container.uploadTripSettlementProofUseCase.execute({
      settlementId: parsedInput.settlementId,
      proofImageUrl: parsedInput.proofImageUrl,
    });
  });

// ─── Update Settlement Status (auth) ─────────────────────────────────────────

export const updateTripSettlementStatusAction = authActionClient
  .schema(
    z.object({
      settlementId: z.string().uuid(),
      status: z.enum(['proof_uploaded', 'approved', 'rejected']),
    })
  )
  .action(async ({ parsedInput, ctx: { user } }) => {
    const container = createServerContainer();
    await container.updateTripSettlementStatusUseCase.execute({
      settlementId: parsedInput.settlementId,
      status: parsedInput.status,
      userId: user.id,
    });
  });

// ─── Get Standalone Bills (auth) ─────────────────────────────────────────────

export const getStandaloneBillsAction = authActionClient
  .schema(z.object({}))
  .action(async ({ ctx: { user } }) => {
    const rows = await db
      .select({ id: splitBills.id, title: splitBills.title, date: splitBills.date })
      .from(splitBills)
      .where(and(eq(splitBills.userId, user.id), isNull(splitBills.tripId)))
      .orderBy(desc(splitBills.createdAt));
    return rows;
  });
