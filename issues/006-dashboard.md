# 006 · Dashboard

**Phase:** 1 — MVP
**Status:** `done`
**GitHub:** [#6](https://github.com/handharr-labs/xpnsio/issues/6)
**Route:** `/dashboard`
**Depends on:** 001, 003, 004, 005

---

## Goal

The home screen. Shows the user's spending status for the current month — total remaining budget, per-category remaining with rollover context, and recent transactions.

---

## Key Domain Logic

### Daily Budget (accumulated rollover)
```
carry = 0
for each day from month-start to today:
  allowance = carry + (monthlyBudget / daysInMonth)
  spent = sum(transactions where date == day)
  carry = max(0, allowance - spent)  // no negative carry
return carry  // = remaining budget for today including accumulated unspent
```

### Weekly Budget
Same logic but at week boundaries (Monday as week start).

### Monthly Budget
```
remaining = monthlyBudget - sum(transactions in month)
```

---

## UI Sections

### 1. Header Bar
- Month/year label (e.g. "March 2026")
- Navigation: previous/next month arrows
- Avatar + settings link

### 2. Total Remaining Card
```
┌─────────────────────────────────┐
│  Remaining This Month           │
│  Rp 1,245,000                   │
│  of Rp 2,000,000 total budget   │
│  ████████░░░░░░░░ 62%           │
└─────────────────────────────────┘
```
- Progress bar showing % spent
- Allocation indicator: if totalAllocated < totalMonthlyBudget → show "Rp X unallocated"

### 3. Category Budget Cards
One card per expense category with active budget.

**Daily category:**
```
┌─────────────────────────────────┐
│  ☕ Coffee             [Daily]   │
│  Rp 8,500 remaining today       │
│  (Rp 3,500 rolled over)         │
│  ████████████░░░░ 75%           │
└─────────────────────────────────┘
```

**Weekly category:**
```
┌─────────────────────────────────┐
│  🚌 Transport         [Weekly]  │
│  Rp 45,000 remaining this week  │
│  (Rp 15,000 rolled over)        │
└─────────────────────────────────┘
```

**Monthly category:**
```
┌─────────────────────────────────┐
│  🛒 Groceries        [Monthly]  │
│  Rp 750,000 remaining           │
│  Rp 750,000 / Rp 1,500,000      │
└─────────────────────────────────┘
```

### 4. Recent Transactions
- Last 5 transactions
- Each row: date, category icon+name, description, amount (negative for expense)
- "View all" link → `/transactions`

### 5. No Budget State
If user has no budget applied for current month:
- CTA card: "Set up your budget for [Month]" → `/budget-settings`

### 6. FAB (Floating Action Button)
- "+" button → `/transactions/new`
- Fixed bottom-right corner

---

## Auto-Carry Logic
Triggered on first dashboard load of a new month:
```
if budgets for currentMonth is empty:
  lastApp = getLastApplication(userId)
  if lastApp exists:
    applyBudgetSetting(userId, lastApp.budgetSettingId, currentYear, currentMonth)
```
This runs server-side (in `GetDashboardDataUseCase`).

---

## Files

| File | Action |
|------|--------|
| `src/domain/services/BudgetComputationService.ts` | Pure service |
| `src/domain/use-cases/dashboard/GetDashboardDataUseCase.ts` | Aggregates data + auto-carry |
| `src/app/actions/dashboard.ts` | Server action |
| `src/presentation/features/dashboard/useDashboardViewModel.ts` | Hook |
| `src/presentation/features/dashboard/DashboardView.tsx` | Main UI (replace stub) |

---

## Acceptance Criteria

- [ ] Total remaining = totalMonthlyBudget - totalSpent
- [ ] Daily categories show accumulated rollover correctly
- [ ] Weekly categories show weekly rollover correctly
- [ ] Monthly categories show simple remaining
- [ ] Auto-carry applies last month's setting on first visit of new month
- [ ] FAB navigates to add transaction
- [ ] Recent transactions show last 5
- [ ] No budget state shows CTA
