# 007 · Transaction List & History

**Phase:** 2 — Core Features
**Status:** `planned`
**GitHub:** [#7](https://github.com/handharr-labs/xpnsio/issues/7)
**Routes:** `/transactions`, `/transactions/:id`
**Depends on:** 005

---

## Goal

Full paginated view of all transactions with filtering and search. Tap any transaction to view/edit/delete.

---

## UI

### List View (`/transactions`)
- Newest first, paginated (20 per page)
- Group by date (sticky date headers)
- Each row:
  - Left: category color dot + icon + name (or "Uncategorized")
  - Center: description (if any), date
  - Right: amount (red for expense, green for income)
- Filters bar (collapsible):
  - Date range picker
  - Category selector (multi-select)
  - Type: All / Expense / Income
- Search input: filters by description (debounced)
- "Add Transaction" button → `/transactions/new`

### Detail View (`/transactions/:id`)
- Shows all fields
- Edit button → inline edit or separate edit form
- Delete button → confirm dialog → delete → back to list

---

## Files

| File | Action |
|------|--------|
| `src/domain/use-cases/transactions/GetTransactionsUseCase.ts` | Already created in 005 |
| `src/domain/use-cases/transactions/UpdateTransactionUseCase.ts` | New |
| `src/domain/use-cases/transactions/DeleteTransactionUseCase.ts` | New |
| `src/app/actions/transactions.ts` | Add update/delete actions |
| `src/presentation/features/transactions/useTransactionsViewModel.ts` | Hook |
| `src/presentation/features/transactions/TransactionsView.tsx` | List UI |
| `src/presentation/features/transactions/TransactionDetailView.tsx` | Detail/Edit UI |
| `src/app/(main)/transactions/page.tsx` | Route |
| `src/app/(main)/transactions/[id]/page.tsx` | Route |

---

## Acceptance Criteria

- [ ] Transactions listed newest first, grouped by date
- [ ] Pagination works (load more or pages)
- [ ] Filter by date range
- [ ] Filter by category
- [ ] Filter by type (income/expense)
- [ ] Search by description
- [ ] Tap transaction → detail view
- [ ] Can edit amount, category, date, description from detail view
- [ ] Can delete with confirmation
