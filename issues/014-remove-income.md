# 014 · Remove Income from Budget & Categories

**Phase:** 2
**Status:** `done`
**Affects:** Categories, Budget Settings, Dashboard, Transactions, Schema

---

## Problem

Income tracking adds complexity that isn't needed for the core value prop (spending awareness). Income categories clutter the category list and budget setup. The app should be expense-focused.

---

## Decision

- **Remove** income categories entirely from the category system
- **Keep** the ability to log income transactions (no category required)
- **Remove** `type` field from categories (all categories are expense categories)
- **Remove** `transactionTypeEnum` usage from `categories` table (or keep enum for transactions only)

---

## Changes

### Schema
- `categories.type` — remove the column (categories are always expense)
- `masterCategory` becomes required (not nullable) — all categories must have one
- `transactions.type` — keep as-is (income/expense still valid for transactions)
- `transaction_type` enum — keep for transactions, remove from categories

### Domain
- `Category.type` field — remove
- `Category.masterCategory` — change from `MasterCategory | null` to `MasterCategory` (required)
- `CreateCategoryUseCase` — remove `type` param, remove income validation
- `UpdateCategoryUseCase` — remove `type` from updatable fields

### Server Actions
- `createCategoryAction` — remove `type` field from schema
- `updateCategoryAction` — remove `type` field

### Views
- `CategoriesView` — remove "Income" section; show only Daily / Weekly / Monthly groups
- `SetupView` — remove income category defaults; only show expense categories
- `BudgetSettingNewView` / `EditView` — category selector already filters to expense; no change needed
- `TransactionNewView` — income transactions: no category selector (already the case); keep type toggle (expense/income)
- `TransactionsView` — filter by type (expense/income) still works since `transactions.type` is unchanged

### Data
- `CategoryMapper` — remove `type` mapping
- `CategoryDataSourceImpl` — remove `type` from insert/update queries

---

## What Stays the Same

- `transactions.type` = 'income' | 'expense' — unchanged
- Income transactions can still be created (no category)
- Transaction list still shows/filters income vs expense

---

## Migration Note

Existing `categories` rows with `type = 'income'` should be deleted (or the column dropped with a migration). Run `drizzle-kit push` after schema change.

---

## Files to Change

| File | Change |
|------|--------|
| `src/lib/schema.ts` | Remove `type` from categories, make `masterCategory` non-nullable |
| `src/domain/entities/Category.ts` | Remove `type`, make `masterCategory` required |
| `src/domain/use-cases/categories/CreateCategoryUseCase.ts` | Remove type param |
| `src/domain/use-cases/categories/UpdateCategoryUseCase.ts` | Remove type param |
| `src/data/mappers/CategoryMapper.ts` | Remove type mapping |
| `src/data/data-sources/categories/CategoryDataSourceImpl.ts` | Remove type from queries |
| `src/app/actions/categories.ts` | Remove type from schemas |
| `src/presentation/features/categories/CategoriesView.tsx` | Remove income group |
| `src/presentation/features/setup/SetupView.tsx` | Remove income defaults |

---

## Acceptance Criteria

- [ ] No income categories in the category list or setup
- [ ] Creating a category no longer has a type selector
- [ ] All categories require a master type (Daily/Weekly/Monthly)
- [ ] Income transactions can still be logged (no category)
- [ ] Transaction list still shows income entries
- [ ] Existing income transactions unaffected
