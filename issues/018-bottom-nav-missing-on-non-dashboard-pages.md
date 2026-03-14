# 018 · Bottom Navigation Missing on Non-Dashboard Pages

**Phase:** 1 (bug)
**Status:** `done`
**GitHub:** [#18](https://github.com/handharr-labs/xpnsio/issues/18)
**Affects:** All main views except Dashboard

---

## Problem

The bottom navigation bar (Dashboard / Transactions / + / Budget / Settings) is only rendered inside `DashboardView.tsx`. Users navigating to `/transactions`, `/budget-settings`, `/settings`, etc. lose the bottom nav entirely, blocking navigation back to other sections without using the browser back button.

---

## Fix

Extract the bottom nav into a shared `BottomNav` component at `src/presentation/common/BottomNav.tsx` and include it in all main views:

- `DashboardView` (already has it — refactor to use shared component)
- `TransactionsView`
- `TransactionDetailView`
- `TransactionNewView`
- `BudgetSettingsView`
- `BudgetSettingNewView`
- `BudgetSettingEditView`
- `SettingsView`

Views excluded (no bottom nav):
- `LoginView` — auth page
- `SetupView` — onboarding flow
- `CategoriesView` — no longer primary nav target

---

## Files

| File | Change |
|------|--------|
| `src/presentation/common/BottomNav.tsx` | New shared component |
| `src/presentation/features/dashboard/DashboardView.tsx` | Use shared component |
| `src/presentation/features/transactions/TransactionsView.tsx` | Add BottomNav |
| `src/presentation/features/transactions/TransactionDetailView.tsx` | Add BottomNav |
| `src/presentation/features/transactions/TransactionNewView.tsx` | Add BottomNav |
| `src/presentation/features/budget-settings/BudgetSettingsView.tsx` | Add BottomNav |
| `src/presentation/features/budget-settings/BudgetSettingNewView.tsx` | Add BottomNav |
| `src/presentation/features/budget-settings/BudgetSettingEditView.tsx` | Add BottomNav |
| `src/presentation/features/settings/SettingsView.tsx` | Add BottomNav |

---

## Acceptance Criteria

- [ ] Bottom nav visible on all main pages
- [ ] Active tab highlighted based on current route
- [ ] `+` FAB always navigates to `/transactions/new`
