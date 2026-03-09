# 026 · Add Dynamic Progress Color to Category Cards

**Phase:** Phase 2 — Improvements
**Status:** `done`

---

## Goal

Category cards currently only show green (safe) and red (overrun) colors for progress bars. We need to add a warning state (yellow) for when spending is approaching but hasn't exceeded the budget.

---

## Changes

Add dynamic color based on progress percentage:
- **Below 90%** → Green (safe)
- **90% to < 100%** → Yellow/Orange (warning - approaching limit)
- **100% and above** → Red (overrun)

This applies to all progress bars in category cards (Daily, Weekly, Monthly).

---

## Acceptance Criteria

- [x] Progress below 90% shows green color
- [x] Progress 90-99% shows yellow/orange warning color
- [x] Progress 100%+ shows red color
- [x] Colors apply to both progress bar fill and percentage text
- [x] Consistent behavior across Daily, Weekly, and Monthly progress bars
- [x] TypeScript type checking passes

---

## Implementation

Added helper functions `getProgressColor()` and `getProgressTextColor()` in `DashboardView.tsx`:

- `< 90%` → `bg-green-500` / `text-green-600`
- `>= 90%` and `< 100%` → `bg-yellow-500` / `text-yellow-600`
- `>= 100%` → `bg-red-500` / `text-red-600`

Applied to all progress bars:
- Overview monthly summary
- Daily category progress
- Weekly category progress
- Monthly category progress
- Non-daily category (weekly/monthly) progress
