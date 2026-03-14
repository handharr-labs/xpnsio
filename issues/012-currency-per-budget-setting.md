# 012 · Currency per Budget Setting

**Phase:** 2
**Status:** `done`
**GitHub:** [#12](https://github.com/handharr-labs/xpnsio/issues/12)
**Affects:** `budget_settings` table, Budget Setting form, Dashboard, all amount displays

---

## Problem

Currency is currently a global profile setting. It should instead be set per Budget Setting, so users can have different budgets in different currencies (e.g. IDR for daily life, USD for a work trip).

---

## Changes

### Schema
- Remove `currency` from `profiles` table (or keep as fallback — TBD)
- Add `currency: text` (default `'IDR'`) to `budget_settings` table

### Budget Setting Form (create + edit)
- Add currency selector field: dropdown with common currencies
  - IDR — Indonesian Rupiah (default)
  - USD — US Dollar
  - SGD — Singapore Dollar
  - MYR — Malaysian Ringgit
  - EUR — Euro
- Displayed as: `IDR — Indonesian Rupiah`

### Display
- All amount formatting across the app derives currency from the active Budget Setting for the current month
- `getDashboardDataAction` should return `currency` in `DashboardData`
- ViewModels / Views consume `currency` from dashboard context and pass it down

### Formatting helper
```ts
// src/core/utils/formatCurrency.ts
export function formatCurrency(amount: number, currency: string = 'IDR'): string {
  const locale = currency === 'IDR' ? 'id-ID' : 'en-US';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}
```

---

## Files to Change

| File | Change |
|------|--------|
| `src/lib/schema.ts` | Add `currency` to `budget_settings` |
| `src/domain/entities/BudgetSetting.ts` | Add `currency: string` |
| `src/domain/entities/Dashboard.ts` (new or inline) | Add `currency` to `DashboardData` |
| `src/data/mappers/BudgetSettingMapper.ts` | Map currency field |
| `src/core/utils/formatCurrency.ts` | New shared formatter |
| `src/presentation/features/budget-settings/BudgetSettingNewView.tsx` | Add currency selector |
| `src/presentation/features/budget-settings/BudgetSettingEditView.tsx` | Add currency selector |
| `src/presentation/features/dashboard/DashboardView.tsx` | Use currency from data |
| All views with amount display | Replace hardcoded IDR formatter |

---

## Acceptance Criteria

- [ ] Budget Setting form has a currency selector (default IDR)
- [ ] Currency stored in `budget_settings.currency`
- [ ] Dashboard uses the active setting's currency for all formatting
- [ ] Changing currency on a Budget Setting updates display immediately
- [ ] formatCurrency utility used consistently across all views
