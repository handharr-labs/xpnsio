'use server';

import { z } from 'zod';
import { authActionClient, actionClient } from '@/lib/safe-action';
import { createServerContainer } from '@/shared/di/container.server';

const accountSchema = z.object({
  bankName: z.string().min(1),
  accountNumber: z.string().min(1),
});

const participantSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  finalAmount: z.number().int().positive(),
});

const itemSchema = z.object({
  name: z.string().min(1),
  price: z.number().int().positive(),
  orderIndex: z.number().int().min(0),
  assignedParticipantLocalIds: z.array(z.string()),
});

const adjustmentSchema = z.object({
  label: z.string().min(1),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().int().positive(),
  distribution: z.enum(['proportional', 'equal']),
  orderIndex: z.number().int().min(0),
});

export const getSplitBillsAction = authActionClient
  .schema(z.object({}))
  .action(async ({ ctx: { user } }) => {
    const container = createServerContainer();
    return container.getSplitBillsUseCase.execute(user.id);
  });

export const getSplitBillAction = authActionClient
  .schema(z.object({ id: z.string().uuid() }))
  .action(async ({ parsedInput }) => {
    const container = createServerContainer();
    return container.getSplitBillUseCase.execute(parsedInput.id);
  });

// Public — no auth required (participant views bill)
export const getSplitBillPublicAction = actionClient
  .schema(z.object({ id: z.string().uuid() }))
  .action(async ({ parsedInput }) => {
    const container = createServerContainer();
    return container.getSplitBillUseCase.execute(parsedInput.id);
  });

export const createSplitBillAction = authActionClient
  .schema(
    z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      date: z.string(),
      splitMode: z.enum(['equal', 'custom', 'itemized']),
      accounts: z.array(accountSchema).min(1),
      participants: z.array(participantSchema).min(1),
      items: z.array(itemSchema).default([]),
      adjustments: z.array(adjustmentSchema).default([]),
      participantLocalIds: z.array(z.string()),
    })
  )
  .action(async ({ parsedInput, ctx: { user } }) => {
    const container = createServerContainer();
    return container.createSplitBillUseCase.execute({
      userId: user.id,
      title: parsedInput.title,
      description: parsedInput.description ?? null,
      date: parsedInput.date,
      splitMode: parsedInput.splitMode,
      accounts: parsedInput.accounts,
      participants: parsedInput.participants,
      items: parsedInput.items,
      adjustments: parsedInput.adjustments,
      participantLocalIds: parsedInput.participantLocalIds,
    });
  });

export const updateSplitBillAction = authActionClient
  .schema(
    z.object({
      billId: z.string().uuid(),
      title: z.string().min(1),
      description: z.string().optional(),
      date: z.string(),
      splitMode: z.enum(['equal', 'custom', 'itemized']),
      accounts: z.array(accountSchema).min(1),
      participants: z.array(
        z.object({
          dbId: z.string().uuid().optional(),
          formId: z.string(),
          name: z.string().min(1),
          email: z.string().email().optional(),
          finalAmount: z.number().int().positive(),
        })
      ).min(1),
      items: z.array(
        z.object({
          name: z.string().min(1),
          price: z.number().int().positive(),
          orderIndex: z.number().int().min(0),
          assignedParticipantFormIds: z.array(z.string()),
        })
      ).default([]),
      adjustments: z.array(adjustmentSchema).default([]),
    })
  )
  .action(async ({ parsedInput }) => {
    const container = createServerContainer();
    await container.updateSplitBillUseCase.execute({
      billId: parsedInput.billId,
      title: parsedInput.title,
      description: parsedInput.description ?? null,
      date: parsedInput.date,
      splitMode: parsedInput.splitMode,
      accounts: parsedInput.accounts,
      participants: parsedInput.participants,
      items: parsedInput.items,
      adjustments: parsedInput.adjustments,
    });
    return { billId: parsedInput.billId };
  });

// Public — participant uploads proof (no auth required)
export const uploadPaymentProofAction = actionClient
  .schema(
    z.object({
      participantId: z.string().uuid(),
      imageUrl: z.string().url(),
    })
  )
  .action(async ({ parsedInput }) => {
    const container = createServerContainer();
    return container.uploadPaymentProofUseCase.execute({
      participantId: parsedInput.participantId,
      imageUrl: parsedInput.imageUrl,
    });
  });

export const deleteSplitBillAction = authActionClient
  .schema(z.object({ billId: z.string().uuid() }))
  .action(async ({ parsedInput, ctx: { user } }) => {
    const container = createServerContainer();
    await container.deleteSplitBillUseCase.execute(parsedInput.billId, user.id);
  });

export const updateParticipantStatusAction = authActionClient
  .schema(
    z.object({
      participantId: z.string().uuid(),
      status: z.enum(['approved', 'rejected']),
    })
  )
  .action(async ({ parsedInput }) => {
    const container = createServerContainer();
    return container.updateParticipantStatusUseCase.execute({
      participantId: parsedInput.participantId,
      status: parsedInput.status,
    });
  });
