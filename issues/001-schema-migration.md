# 001 · Schema Migration

**Phase:** 0 — Foundation
**Status:** `done`
**GitHub:** [#1](https://github.com/handharr-labs/xpnsio/issues/1)
**File:** `src/lib/schema.ts`

---

## Goal

Extend the database schema to support the full budget system: master categories, budget settings, monthly snapshots, and user currency preference.

---

## Changes

### New Enum
```ts
masterCategoryEnum = pgEnum('master_category', ['daily', 'weekly', 'monthly'])
```

### Updated: `profiles` table
- Add `currency: text` — default `'IDR'`

### Updated: `categories` table
- Add `masterCategory: masterCategoryEnum` — nullable (null = income category)

### New: `budget_settings` table
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| userId | uuid FK → profiles | cascade delete |
| name | text | e.g. "Normal Month" |
| totalMonthlyBudget | numeric(12,2) | spend cap for the month |
| createdAt | timestamp | |

### New: `budget_setting_items` table
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| budgetSettingId | uuid FK → budget_settings | cascade delete |
| categoryId | uuid FK → categories | cascade delete |
| monthlyAmount | numeric(12,2) | per-category monthly allocation |

### New: `monthly_budget_applications` table
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| userId | uuid FK → profiles | cascade delete |
| budgetSettingId | uuid FK → budget_settings | cascade delete |
| month | integer | 1–12 |
| year | integer | |
| UNIQUE | (userId, month, year) | one setting per month per user |

### Existing: `budgets` table (unchanged)
Used as monthly snapshot — populated when a Budget Setting is applied or auto-carried.

---

## Verification

```bash
npx drizzle-kit push    # should succeed with no errors
npx drizzle-kit studio  # verify all tables visible
```

---

## Domain Rules

- `masterCategory` is required when `categories.type = 'expense'`
- `masterCategory` is null when `categories.type = 'income'`
- Each `(userId, month, year)` can only have one active Budget Setting application
- `budgets` table is the source of truth for computation — never read from `budget_setting_items` directly for budget math
