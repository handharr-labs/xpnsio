# Building a Next.js 15 Finance App with Clean Architecture + Supabase — What I Learned

*A technical retrospective on Xpnsio: server components, DI containers, Drizzle ORM, and Clean Architecture in a solo full-stack project.*

---

Xpnsio is a personal finance app I built in my spare time — budget tracking with a budget-first model (you can read the product story [here]). This article is for the engineers who want the technical breakdown: what I used, how it fits together, and the tradeoffs I made.

Stack summary:
- **Next.js 15** App Router + Server Components
- **React 19**
- **Supabase** (Postgres + Auth + RLS)
- **Drizzle ORM**
- **Clean Architecture** with explicit domain/data/presentation layers
- **Vitest** for testing
- **Claude** (Anthropic) for AI-assisted development, guided by a structured `CLAUDE.md`

---

## Why Clean Architecture in a Next.js App?

The short answer: because the alternative is a codebase you hate in 6 months.

Next.js makes it easy to colocate everything — fetch your data in a Server Component, render it, done. That's fine for a toy. But when the app grows, "data fetching and rendering in the same file" turns into "business logic scattered across components" and you lose the ability to test or change anything without touching everything.

Clean Architecture forces you to be explicit about boundaries:

```
domain/          ← pure TypeScript, zero dependencies
data/            ← data sources, repositories, mappers
presentation/    ← React components, hooks, server actions
di/              ← wires everything together
core/            ← shared utilities
```

**The key rule:** domain imports nothing. Data imports domain. Presentation imports domain (not data directly). This makes the domain layer fully testable without React, Supabase, or any other framework concern.

---

## Domain Layer: Where Business Logic Lives

The domain layer contains:
- **Entity types** — plain TypeScript interfaces (no ORM types)
- **Repository interfaces** — what the data layer must implement
- **Domain services** — pure functions, no I/O, no async, no DOM

Example entity:

```typescript
// src/domain/entities/budget.ts
export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  currency: string;
  period: 'daily' | 'weekly' | 'monthly';
  createdAt: Date;
}
```

Example repository interface:

```typescript
// src/domain/repositories/budget-repository.ts
export interface BudgetRepository {
  findByUserId(userId: string): Promise<Budget[]>;
  findById(id: string): Promise<Budget | null>;
  create(budget: CreateBudgetDTO): Promise<Budget>;
  update(id: string, updates: UpdateBudgetDTO): Promise<Budget>;
  delete(id: string): Promise<void>;
}
```

The domain layer doesn't know about Supabase, Drizzle, or Next.js. It's just types and interfaces. This is the most important architectural decision — everything else follows from it.

---

## Data Layer: Drizzle ORM + Supabase

The data layer implements the repository interfaces using Drizzle ORM against a Supabase Postgres database.

**Why Drizzle over Prisma?**

Drizzle is lighter, faster, and generates SQL you can read. Prisma's abstraction layer can obscure what queries are actually running. With Drizzle, the schema is TypeScript, the queries look like SQL, and there's no magic.

Schema example:

```typescript
// src/data/db/schema.ts
export const budgets = pgTable('budgets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  categoryId: uuid('category_id').notNull().references(() => categories.id),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  period: budgetPeriodEnum('period').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
```

**Connection pooling:** Supabase provides two connection strings. The transaction-mode pooler (port 6543) is used by the app at runtime — it handles connection pooling efficiently for serverless. The session-mode connection (direct) is used by `drizzle-kit` for migrations, since DDL operations need a persistent session.

```env
DATABASE_URL=postgresql://...@pooler.supabase.com:6543/postgres  # runtime
DIRECT_DATABASE_URL=postgresql://...@db.supabase.com:5432/postgres  # migrations
```

---

## Dependency Injection Container

Next.js doesn't have a DI framework — but you still need some way to wire your repositories to your use cases without coupling everything at the module level.

I use two DI containers:

**`container.server.ts`** — server-side only, creates real implementations. Never imports React.

```typescript
// src/di/container.server.ts
import 'server-only';
import { db } from '@/data/db/client';
import { DrizzleBudgetRepository } from '@/data/repositories/drizzle-budget-repository';
import { GetBudgetsUseCase } from '@/domain/use-cases/get-budgets';

export function createServerContainer() {
  const budgetRepository = new DrizzleBudgetRepository(db);
  const getBudgets = new GetBudgetsUseCase(budgetRepository);
  return { getBudgets };
}
```

**`container.client.ts`** — client-side only, for any client-specific wiring. Never imports `server-only`.

Server Components call `createServerContainer()` directly. Server Actions do the same. No client code ever touches the database.

---

## Auth: Supabase Auth + Row-Level Security

Auth is handled by Supabase's built-in Google OAuth. After sign-in, the session is stored in a cookie. Server Components access it via the Supabase SSR client.

The more interesting piece is **Row-Level Security (RLS)**. Every table has an RLS policy:

```sql
-- Users can only read/write their own budgets
CREATE POLICY "Users access own budgets"
ON budgets
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

This means even if there's a bug in application code, users cannot access each other's data — the database enforces it. This is the correct place for this constraint.

---

## Server Actions for Mutations

Next.js 15 Server Actions are a clean way to handle mutations without a separate API layer. No `fetch`, no `useEffect`, no API routes for simple CRUD.

```typescript
// src/presentation/features/transactions/actions/create-transaction.ts
'use server';
import { createServerContainer } from '@/di/container.server';
import { getUser } from '@/core/auth';
import { revalidatePath } from 'next/cache';

export async function createTransaction(formData: FormData) {
  const user = await getUser();
  const { addTransaction } = createServerContainer();

  await addTransaction.execute({
    userId: user.id,
    amount: Number(formData.get('amount')),
    categoryId: String(formData.get('categoryId')),
    date: new Date(String(formData.get('date'))),
    note: String(formData.get('note') ?? ''),
  });

  revalidatePath('/dashboard');
}
```

The Server Action goes through the DI container, which returns the real use case backed by Drizzle + Supabase. The presentation layer never imports from `data/` directly — it only uses the container.

---

## Testing with Vitest

The domain layer tests are trivial — pure TypeScript, no mocking needed. Use case tests mock the repository interface.

```typescript
// src/domain/use-cases/__tests__/get-remaining-budget.test.ts
import { describe, it, expect } from 'vitest';
import { getRemainingBudget } from '../get-remaining-budget';

describe('getRemainingBudget', () => {
  it('returns budget minus total transactions', () => {
    const budget = { amount: 100, period: 'weekly' };
    const transactions = [{ amount: 30 }, { amount: 25 }];
    expect(getRemainingBudget(budget, transactions)).toBe(45);
  });
});
```

Because the domain layer has zero framework dependencies, these tests are fast (< 1ms each) and never need database setup.

---

## What I'd Do Differently

**Skip the full DI container for v0.1.** For a solo project, the container adds ceremony before you need it. Start with direct imports in Server Components, refactor to the container once you have two+ use cases that share a repository.

**Use Drizzle's `schema.ts` as the source of truth sooner.** I had some drift between my TypeScript domain types and the Drizzle schema early on. Enforcing that the Drizzle schema is always the DB source of truth — and mapping to domain types via mapper functions — would have prevented some manual sync work.

**Add `drizzle-kit push` to the CI pipeline.** Running migrations manually is fine locally but easy to forget before deployment.

---

## AI-Assisted Development: Claude + CLAUDE.md

This project was built with AI assistance throughout — specifically Claude Code (Anthropic's CLI tool). I want to be transparent about that, and more importantly, explain how I used it in a way that actually worked.

The naive approach to AI-assisted development is to paste a vague request and accept whatever comes back. That produces inconsistent, often architecturally incoherent code. It's not a good workflow.

What I did instead: I wrote a `CLAUDE.md` file at the project root that defines the architecture constraints explicitly:

```
src/domain/ → imports nothing
src/data/   → imports domain only
src/presentation/ → imports domain only (never data directly)

container.server.ts → never imports React
container.client.ts → never imports server-only
Services → pure functions, no I/O, no async, no DOM
Hooks → readonly state, never expose setters
```

Claude Code reads this file at the start of every session. When I ask it to add a feature, it operates within these constraints automatically. It won't put database calls in a component. It won't expose setters from a hook. It won't import a repository directly into a Server Component. Because the rules are written down and loaded into context.

The result: AI-accelerated execution with architecture-consistent output. I could ask "add a use case to calculate remaining budget per category" and get back code that correctly sits in the domain layer, takes a repository interface as a dependency, and has no framework imports. Not because the AI guessed right — because the rules made it impossible to guess wrong.

**This is the right model for AI-assisted development:**
- You define the principles and boundaries
- You encode them in a machine-readable format (`CLAUDE.md`)
- The AI operates as an accelerator within those constraints

The architecture enforces correctness. The AI accelerates speed. Neither replaces the other.

---

## Final Thoughts

Clean Architecture in Next.js is worth it — but only if you commit to the boundaries. The moment you import a repository directly into a component "just this once," the architecture starts collapsing. The discipline pays off when features get complex.

And if you're using AI coding tools: invest in your `CLAUDE.md` (or equivalent). The quality of AI output is directly proportional to the quality of the constraints you give it. Vague prompts produce vague code. Explicit architectural rules produce architectural code.

Xpnsio is live and free: **[xpnsio.vercel.app](https://xpnsio.vercel.app?utm_source=medium&utm_medium=article)**

Happy to answer questions about any part of the stack — or the AI workflow — in the comments.
