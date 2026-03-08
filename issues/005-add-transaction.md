# 005 · Add Transaction

**Phase:** 1 — MVP
**Status:** `done`
**Route:** `/transactions/new`
**Depends on:** 001, 003

---

## Goal

Quick, frictionless form to log a spending or income event.

---

## Data Model

```ts
Transaction {
  id: string
  userId: string
  categoryId: string | null
  categoryName: string | null  // joined
  amount: number               // always positive
  type: 'income' | 'expense'
  description: string | null
  date: string                 // YYYY-MM-DD
  createdAt: Date
}
```

---

## UI

### Form Fields
| Field | Type | Notes |
|-------|------|-------|
| Type | Toggle | Expense (default) / Income |
| Amount | Number input | IDR, required, > 0 |
| Category | Select | Expense categories only (if type = expense) |
| Date | Date picker | Default: today |
| Description | Text input | Optional |

### Behavior
- Type toggle switches category selector visibility (hidden for income)
- Amount formatted with thousand separators as user types
- Submit calls `createTransactionAction`
- On success: navigate to `/dashboard`
- On error: show inline error message

### Entry Points
- Floating action button (FAB) on dashboard
- Link from `/transactions` page header
- Direct URL `/transactions/new`

---

## Files

| File | Action |
|------|--------|
| `src/domain/entities/Transaction.ts` | New entity |
| `src/domain/repositories/TransactionRepository.ts` | New interface |
| `src/domain/use-cases/transactions/CreateTransactionUseCase.ts` | Use case |
| `src/data/data-sources/transactions/TransactionDataSourceImpl.ts` | Drizzle |
| `src/data/mappers/TransactionMapper.ts` | DB → domain |
| `src/data/repositories/TransactionRepositoryImpl.ts` | Impl |
| `src/app/actions/transactions.ts` | Server actions |
| `src/presentation/features/transactions/TransactionNewView.tsx` | Form UI |
| `src/app/(main)/transactions/new/page.tsx` | Route |

---

## Validation Rules

- Amount > 0 (required)
- Type is required (expense/income)
- Category required if type = expense? → **No**, optional (uncategorized expense allowed)
- Date required (default today)
- Description optional, max 255 chars

---

## Acceptance Criteria

- [ ] Can log an expense with category, amount, date, description
- [ ] Can log an income without category
- [ ] Amount must be > 0
- [ ] Date defaults to today, can be changed
- [ ] After submit, dashboard updates to reflect new transaction
- [ ] Error shown if server action fails
