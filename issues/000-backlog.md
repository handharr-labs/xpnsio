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
| 001 | Schema Migration | `in-progress` | [001-schema-migration.md](./001-schema-migration.md) · [#1](https://github.com/handharr-labs/xpnsio/issues/1) |

## Phase 1 — MVP (First User Flow)

| # | Feature | Status | Issue |
|---|---------|--------|-------|
| 002 | Onboarding: Budget Setting Setup | `in-progress` | [002-onboarding-budget-setup.md](./002-onboarding-budget-setup.md) · [#2](https://github.com/handharr-labs/xpnsio/issues/2) |
| 003 | Category Management | `in-progress` | [003-category-management.md](./003-category-management.md) · [#3](https://github.com/handharr-labs/xpnsio/issues/3) |
| 004 | Budget Settings | `in-progress` | [004-budget-settings.md](./004-budget-settings.md) · [#4](https://github.com/handharr-labs/xpnsio/issues/4) |
| 005 | Add Transaction | `in-progress` | [005-add-transaction.md](./005-add-transaction.md) · [#5](https://github.com/handharr-labs/xpnsio/issues/5) |
| 006 | Dashboard | `in-progress` | [006-dashboard.md](./006-dashboard.md) · [#6](https://github.com/handharr-labs/xpnsio/issues/6) |

## Phase 2 — Core Features

| # | Feature | Status | Issue |
|---|---------|--------|-------|
| 007 | Transaction List & History | `planned` | [007-transaction-list.md](./007-transaction-list.md) · [#7](https://github.com/handharr-labs/xpnsio/issues/7) |
| 008 | Budget Progress Detail | `planned` | [008-budget-progress-detail.md](./008-budget-progress-detail.md) · [#8](https://github.com/handharr-labs/xpnsio/issues/8) |

## Phase 3 — Extended Features

| # | Feature | Status | Issue |
|---|---------|--------|-------|
| 009 | Monthly Summary | `planned` | [009-monthly-summary.md](./009-monthly-summary.md) · [#9](https://github.com/handharr-labs/xpnsio/issues/9) |
| 010 | Export to CSV | `planned` | [010-export-csv.md](./010-export-csv.md) · [#10](https://github.com/handharr-labs/xpnsio/issues/10) |
| 011 | Profile & Settings | `planned` | [011-profile-settings.md](./011-profile-settings.md) · [#11](https://github.com/handharr-labs/xpnsio/issues/11) |

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

## Phase 2 — Improvements (from user feedback)

| # | Feature | Status | Issue |
|---|---------|--------|-------|
| 012 | Currency per Budget Setting | `ready` | [012-currency-per-budget-setting.md](./012-currency-per-budget-setting.md) · [#12](https://github.com/handharr-labs/xpnsio/issues/12) |
| 013 | Currency formatting on amount inputs | `ready` | [013-currency-input-formatting.md](./013-currency-input-formatting.md) · [#13](https://github.com/handharr-labs/xpnsio/issues/13) |
| 014 | Remove income from budget & categories | `ready` | [014-remove-income.md](./014-remove-income.md) · [#14](https://github.com/handharr-labs/xpnsio/issues/14) |
| 015 | Bug: amount input rejects valid values (step) | `ready` | [015-amount-input-step-bug.md](./015-amount-input-step-bug.md) · [#15](https://github.com/handharr-labs/xpnsio/issues/15) |
| 016 | Categories owned by Budget Setting (inline management) | `ready` | [016-categories-owned-by-budget-setting.md](./016-categories-owned-by-budget-setting.md) · [#16](https://github.com/handharr-labs/xpnsio/issues/16) |
| 017 | Remove currency preference from Settings page | `ready` | [017-remove-currency-from-settings.md](./017-remove-currency-from-settings.md) · [#17](https://github.com/handharr-labs/xpnsio/issues/17) |

---

| 023 | Daily Budget Display for Daily-Type Categories | `pending` | [023-daily-budget-display.md](./023-daily-budget-display.md) · [#23](https://github.com/handharr-labs/xpnsio/issues/23) |
| 024 | Remove Total Monthly Budget Input from Budget Settings | `pending` | [024-remove-total-monthly-budget-input.md](./024-remove-total-monthly-budget-input.md) · [#24](https://github.com/handharr-labs/xpnsio/issues/24) |

---

| 032 | Dashboard pull-to-refresh | `pending` | [032-dashboard-pull-to-refresh.md](./032-dashboard-pull-to-refresh.md) · [#30](https://github.com/handharr-labs/xpnsio/issues/30) |
| 033 | Dashboard month navigation | `in-progress` | [033-dashboard-month-navigation.md](./033-dashboard-month-navigation.md) · [#31](https://github.com/handharr-labs/xpnsio/issues/31) |

## Ideas / Future
- Recurring transactions
- Multi-currency support
- Spending insights / trends
- Notifications (push via PWA)
- Public user support
| 022 | Refactor to Feature-Based Structure | `pending` | [022-feature-based-structure.md](./022-feature-based-structure.md) · [#22](https://github.com/handharr-labs/xpnsio/issues/22) |
