# Xpnsio — Feature Backlog

> Master list of all planned features. Each feature gets its own issue file when ready to be worked on.

## Status Legend
- `planned` — identified, not yet scoped
- `ready` — issue file written, ready to scaffold
- `in-progress` — actively being built
- `done` — shipped

---

## Phase 0 — Foundation

| # | Feature | Status | Issue |
|---|---------|--------|-------|
| 001 | Schema Migration | `in-progress` | [001-schema-migration.md](./001-schema-migration.md) |

## Phase 1 — MVP (First User Flow)

| # | Feature | Status | Issue |
|---|---------|--------|-------|
| 002 | Onboarding: Budget Setting Setup | `in-progress` | [002-onboarding-budget-setup.md](./002-onboarding-budget-setup.md) |
| 003 | Category Management | `in-progress` | [003-category-management.md](./003-category-management.md) |
| 004 | Budget Settings | `in-progress` | [004-budget-settings.md](./004-budget-settings.md) |
| 005 | Add Transaction | `in-progress` | [005-add-transaction.md](./005-add-transaction.md) |
| 006 | Dashboard | `in-progress` | [006-dashboard.md](./006-dashboard.md) |

## Phase 2 — Core Features

| # | Feature | Status | Issue |
|---|---------|--------|-------|
| 007 | Transaction List & History | `planned` | [007-transaction-list.md](./007-transaction-list.md) |
| 008 | Budget Progress Detail | `planned` | [008-budget-progress-detail.md](./008-budget-progress-detail.md) |

## Phase 3 — Extended Features

| # | Feature | Status | Issue |
|---|---------|--------|-------|
| 009 | Monthly Summary | `planned` | [009-monthly-summary.md](./009-monthly-summary.md) |
| 010 | Export to CSV | `planned` | [010-export-csv.md](./010-export-csv.md) |
| 011 | Profile & Settings | `planned` | [011-profile-settings.md](./011-profile-settings.md) |

---

## Build Order

```
001 Schema
  → 002 Onboarding
  → 003 Category Management
  → 004 Budget Settings
  → 005 Add Transaction
  → 006 Dashboard
  → 007 Transaction List
  → 008 Budget Progress Detail
  → 009 Monthly Summary
  → 010 Export CSV
  → 011 Settings
```

---

## Ideas / Future
- Recurring transactions
- Multi-currency support
- Spending insights / trends
- Notifications (push via PWA)
- Public user support
