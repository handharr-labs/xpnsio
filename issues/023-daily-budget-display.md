# 023 · Daily Budget Display for Daily-Type Categories

**Phase:** Phase 2 — Improvements
**Status:** `done`

---

## Goal

For categories with `masterCategory = 'daily'`, show the user how much of their **accumulated daily budget** has been spent up to today, and how much is left — with a red indicator when they've exceeded it.

---

## Business Logic

```
daily budget    = monthlyBudget / daysInMonth
accumulated     = dailyBudget × currentDayOfMonth
daily left      = accumulated - totalSpent   (can be negative → overrun)
progress %      = totalSpent / accumulated
```

### Example (Budget: Rp500.000, 10-day month, today = day 4)

| Scenario | Spent | Accumulated | Daily Left | State |
|----------|-------|-------------|------------|-------|
| Case 1 | Rp150.000 | Rp200.000 | Rp50.000 | Green |
| Case 2 | Rp100.000 | Rp200.000 | Rp100.000 | Green |
| Case 3 | Rp250.000 | Rp200.000 | −Rp50.000 | Red (overrun) |

---

## Changes

### Domain — `CategoryBudgetInfo` (GetDashboardDataUseCase.ts)
- Add `dailyBudget?: number` — `monthlyBudget / daysInMonth`, only set for daily categories
- Add `accumulatedBudgetToDate?: number` — `dailyBudget × currentDayOfMonth`, only set for daily categories

### Use Case — `GetDashboardDataUseCaseImpl`
- When `masterCategory === 'daily'`, compute and attach `dailyBudget` and `accumulatedBudgetToDate` to `CategoryBudgetInfo`

### UI — `DashboardView.tsx`
- For `daily` categories, replace the standard budget card display with:
  - Show **daily budget amount** (e.g. "Rp50.000/day")
  - Show **spent vs accumulated** (e.g. "Rp150.000 / Rp200.000 (4 days)")
  - Show **daily left** = `accumulated - totalSpent`, red if negative
  - **Progress bar** = `totalSpent / accumulated` (capped at 100%, red fill when overrun)

---

## Acceptance Criteria

- [ ] Daily budget per day is displayed (monthlyBudget ÷ daysInMonth)
- [ ] Accumulated budget to date = dailyBudget × current day of month
- [ ] "Daily left" = accumulated − totalSpent
- [ ] "Daily left" is green when positive, red when zero or negative
- [ ] Progress bar reflects spending vs accumulated (not vs full monthly budget)
- [ ] Progress bar shows red fill when spending ≥ accumulated
- [ ] Non-daily categories are unaffected
- [ ] Handles edge cases: day 1, last day of month, leap year February
