# 031 · Fix: Budget "left" Label Shows Negative Amount When Overrun

**Phase:** Phase 2 — Improvements
**Status:** `done`
**GitHub:** [#29](https://github.com/handharr-labs/xpnsio/issues/29)

---

## Goal

When a budget category is exceeded, show a clear `Over by Rp X` label instead of the confusing `-Rp X left`.

---

## Problem

In the daily/weekly/monthly category cards on the Dashboard, when spending exceeds the budget the label renders as `-Rp 102.534,48 left`. This is confusing because:

1. A negative "left" amount is not intuitive
2. The `isOverrun` flag and `displayText` logic already exist in `BudgetProgressService` but are bypassed by the view

---

## Changes

- `src/features/dashboard/presentation/DashboardView.tsx` — check `isOverrun` on all 6 progress label render sites (daily/weekly/monthly across the daily, weekly, and monthly-only card branches)

---

## Acceptance Criteria

- [x] When spending > budget, label shows `Over by Rp X`
- [x] When spending ≤ budget, label still shows `Rp X left`
- [x] All three period types (daily, weekly, monthly) are covered
- [x] All three card branches (isDaily, isWeekly, default monthly) are covered
- [x] No regressions in existing tests

---

## Implementation

Updated `DashboardView.tsx` at all 6 `{formatIDR(xxx.remaining)} left` sites:

```tsx
{xxxProgress.isOverrun
  ? `Over by ${formatIDR(Math.abs(xxxProgress.remaining))}`
  : `${formatIDR(xxxProgress.remaining)} left`}
```

No service changes needed — `BudgetProgressService` already computes `isOverrun` correctly.
