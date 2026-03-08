# 008 · Budget Progress Detail

**Phase:** 2 — Core Features
**Status:** `planned`
**Route:** `/categories/:id/budget`
**Depends on:** 006

---

## Goal

Deep-dive view for a single category showing budget vs. actual spending with rollover breakdown and spend history.

---

## UI per Master Category Type

### Daily Category
```
┌─────────────────────────────────┐
│ ☕ Coffee                        │
│ Daily budget: Rp10,000/day       │
│                                  │
│ Today's remaining: Rp8,500       │
│ (Rolled over: Rp3,500)           │
│                                  │
│ Spend this month:                │
│ Mon Mar 3   Rp6,500             │
│ Tue Mar 4   Rp10,000            │
│ Wed Mar 5   —                   │
│ Thu Mar 6   Rp8,000             │
│ ...                              │
└─────────────────────────────────┘
```
- Timeline of each day: daily allowance, rolled over from prev day, spent, carry to next day
- Color coding: green = under, red = over (carry = 0)

### Weekly Category
- Same but at week level
- Shows week-by-week breakdown

### Monthly Category
- Simple: monthly budget, amount spent, remaining
- Bar chart of daily spending within the month (sparkline)

---

## Files

| File | Action |
|------|--------|
| `src/domain/services/BudgetComputationService.ts` | Extend with daily timeline method |
| `src/app/actions/budget-detail.ts` | New server action |
| `src/presentation/features/budget-detail/BudgetDetailView.tsx` | UI |
| `src/app/(main)/categories/[id]/budget/page.tsx` | Route |

---

## Acceptance Criteria

- [ ] Daily: shows per-day breakdown with rollover amounts
- [ ] Weekly: shows per-week breakdown with rollover amounts
- [ ] Monthly: shows total vs. budget with spend by day
- [ ] Tapping a day's spend shows transactions for that day/week
- [ ] Rollover calculation matches dashboard display
