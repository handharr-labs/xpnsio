# 009 · Monthly Summary

**Phase:** 3 — Extended Features
**Status:** `planned`
**GitHub:** [#9](https://github.com/handharr-labs/xpnsio/issues/9)
**Route:** `/summary?month=YYYY-MM`
**Depends on:** 006, 007

---

## Goal

Historical recap for any past month. Shows total income, expenses, net balance, and per-category performance vs. budget.

---

## UI

### Header
- Month selector (navigate to any past month)
- Current month shows live data; past months are finalized

### Summary Cards
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Expenses   │  │   Income     │  │     Net      │
│  Rp1,850,000 │  │  Rp5,000,000 │  │ +Rp3,150,000 │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Category Breakdown
Table/list per expense category:
| Category | Budgeted | Spent | Remaining | Status |
|----------|----------|-------|-----------|--------|
| Coffee   | Rp300,000 | Rp245,000 | Rp55,000 | ✅ Under |
| Groceries | Rp1,500,000 | Rp1,620,000 | -Rp120,000 | ⚠️ Over |

- Under/over indicator
- % used bar

---

## Files

| File | Action |
|------|--------|
| `src/app/actions/summary.ts` | New server action |
| `src/presentation/features/summary/MonthlySummaryView.tsx` | UI |
| `src/app/(main)/summary/page.tsx` | Route |

---

## Acceptance Criteria

- [ ] Can view any past month
- [ ] Totals match transaction history
- [ ] Per-category: budgeted vs. actual
- [ ] Over-budget categories highlighted
- [ ] Net balance shown (income - expenses)
