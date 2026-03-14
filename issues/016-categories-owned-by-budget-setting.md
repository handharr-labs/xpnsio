# 016 · Categories Owned by Budget Setting

**Phase:** 2
**Status:** `done`
**GitHub:** [#16](https://github.com/handharr-labs/xpnsio/issues/16)
**Affects:** `/categories` page, Budget Setting create/edit, schema relationship, navigation

---

## Problem

Categories currently exist as a standalone user-level resource, managed at `/categories` independently of budget settings. But categories only make sense in the context of a budget setting — a category without a budget allocation is meaningless.

The correct mental model: **a Budget Setting owns its categories**.

---

## Desired UX

### Budget Setting Edit (`/budget-settings/:id/edit`)
- Shows the setting's name, currency, total budget
- **Category section**: list of categories currently in this setting
  - Each category row: color, name, master type (daily/weekly/monthly), monthly amount
  - Inline "Edit" — edit category name, color, icon, master type inline
  - Inline "Delete" — removes category from setting (with warning if it has transactions)
  - "Add Category" button — opens inline form to create a new category and add it to the setting at once

### Budget Setting New (`/budget-settings/new`)
- Same as edit but starting empty
- "Add Category" creates category + adds allocation in one step

### Setup wizard (`/setup`)
- Step 1 already creates categories — keep as-is, just align with this model

### Remove `/categories` standalone page
- Remove from navigation
- Route can still exist for deep links but is no longer a primary nav item

---

## Key Design Decision

Categories remain a **user-level entity** in the DB (not foreign-keyed to a single budget setting) — they can technically be reused across settings. But the **UI entry point** for creating/editing categories is always through a budget setting. The standalone `/categories` page is removed.

This means:
- Schema: **no change** needed
- Domain/data: **no change** needed
- Change is purely in the **presentation layer**

---

## Changes

### Remove
- `/categories` from main navigation / bottom nav bar
- Standalone `CategoriesView.tsx` and its route (or leave route but remove nav link)

### Update `BudgetSettingNewView.tsx`
- "Add Category" opens an inline form (name, master type, color, icon) → creates category + adds allocation in one step
- Category rows show: color dot, name, master type badge, amount input, edit/delete

### Update `BudgetSettingEditView.tsx`
- Same as New — full category management inline
- When editing a category: name, color, icon, master type editable inline
- When deleting a category: warn if it has transactions; remove from allocation list

### Update `useBudgetSettingsViewModel.ts`
- May need to pass category create/update/delete actions through

### Update `SetupView.tsx`
- Step 1 category creation is already inline — keep as-is, just remove the `type` field references that were already cleaned up

---

## Files to Change

| File | Change |
|------|--------|
| `src/presentation/features/budget-settings/BudgetSettingNewView.tsx` | Inline category create + allocation |
| `src/presentation/features/budget-settings/BudgetSettingEditView.tsx` | Inline category manage + allocation |
| `src/presentation/features/dashboard/DashboardView.tsx` | Remove categories nav link if present |
| Navigation / bottom nav | Remove categories entry |
| `src/presentation/features/categories/CategoriesView.tsx` | Can be deleted or kept as orphan |

---

## Acceptance Criteria

- [ ] No standalone `/categories` page in navigation
- [ ] Creating a budget setting also creates categories inline
- [ ] Editing a budget setting allows editing categories inline (name, color, icon, master type)
- [ ] Deleting a category from a budget setting warns if it has transactions
- [ ] Adding a new category from the budget setting edit page immediately appears in the allocation list
- [ ] Category changes persist (still writes to `categories` table via `createCategoryAction` / `updateCategoryAction`)
