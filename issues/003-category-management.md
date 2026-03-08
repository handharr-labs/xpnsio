# 003 · Category Management

**Phase:** 1 — MVP
**Status:** `in-progress`
**Route:** `/categories`
**Depends on:** 001

---

## Goal

Allow users to create, edit, and delete spending categories. Categories are the building blocks of the budget system.

---

## Data Model

```ts
Category {
  id: string
  userId: string
  name: string
  type: 'income' | 'expense'
  masterCategory: 'daily' | 'weekly' | 'monthly' | null  // null if type = income
  color: string   // hex
  icon: string    // lucide icon name or emoji
  createdAt: Date
}
```

---

## UI

### List View (`/categories`)
- Categories grouped into sections:
  - **Daily Spend** — expense categories with masterCategory = 'daily'
  - **Weekly Spend** — expense categories with masterCategory = 'weekly'
  - **Monthly Spend** — expense categories with masterCategory = 'monthly'
  - **Income** — categories with type = 'income'
- Each item: color dot, icon, name, edit/delete buttons
- "Add Category" button (opens dialog or navigates to form)

### Create/Edit Form (dialog or inline)
Fields:
- Name (required)
- Type: Expense / Income (toggle)
- Master Category: Daily / Weekly / Monthly (only shown when type = Expense, required)
- Icon: text input (lucide icon name) or emoji
- Color: preset swatches or hex input

### Delete
- If category has transactions: show warning dialog
  - "This category has X transactions. Delete anyway?" (transactions will have null category)
  - Or "Reassign transactions" (future)
- If no transactions: delete immediately with confirm

---

## Files

| File | Action |
|------|--------|
| `src/domain/entities/Category.ts` | New entity |
| `src/domain/repositories/CategoryRepository.ts` | New interface |
| `src/domain/use-cases/categories/*.ts` | Get, Create, Update, Delete |
| `src/data/data-sources/categories/CategoryDataSourceImpl.ts` | Drizzle queries |
| `src/data/mappers/CategoryMapper.ts` | DB → domain |
| `src/data/repositories/CategoryRepositoryImpl.ts` | Impl |
| `src/app/actions/categories.ts` | Server actions |
| `src/presentation/features/categories/useCategoriesViewModel.ts` | Hook |
| `src/presentation/features/categories/CategoriesView.tsx` | UI |
| `src/app/(main)/categories/page.tsx` | Route |

---

## Acceptance Criteria

- [ ] Can create expense category with master type
- [ ] Can create income category (no master type)
- [ ] Categories listed grouped by master type
- [ ] Edit updates name/color/icon (master type editable but shows warning if budget depends on it)
- [ ] Delete with transaction warning
- [ ] Validation: expense requires masterCategory
