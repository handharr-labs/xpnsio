# 004 · Budget Settings

**Phase:** 1 — MVP
**Status:** `done`
**Routes:** `/budget-settings`, `/budget-settings/new`, `/budget-settings/:id/edit`
**Depends on:** 001, 003

---

## Goal

Budget Settings are reusable named templates that define how much to allocate per category per month. Users apply a setting to a month to activate it.

---

## Concepts

- **Budget Setting** = named template (e.g. "Normal Month", "Vacation Budget")
- **Budget Setting Items** = per-category monthly allocations within a setting
- **Applying** a setting to a month:
  1. Records in `monthly_budget_applications`
  2. Snapshots amounts into `budgets` table (source of truth for computation)
- **Edit behavior**: editing a setting affects future months; past months keep their snapshot in `budgets`
- **Auto-carry**: if a new month has no setting applied, the dashboard auto-applies the last used setting

---

## Data Model

```ts
BudgetSetting {
  id: string
  userId: string
  name: string
  totalMonthlyBudget: number
  items: BudgetSettingItem[]
  createdAt: Date
}

BudgetSettingItem {
  id: string
  budgetSettingId: string
  categoryId: string
  categoryName: string  // joined
  masterCategory: 'daily' | 'weekly' | 'monthly' | null
  monthlyAmount: number
}
```

---

## UI

### List View (`/budget-settings`)
- Table/card list of all settings
- Columns: Name, Total Budget, # Categories, Actions
- Actions per row: Edit | Apply to Month | Delete
- "New Budget Setting" button

### Apply to Month (modal)
- Select month + year from dropdown/picker
- Shows what's currently applied to that month (if anything)
- Confirm applies the setting and snapshots budgets

### Create/Edit Form
- Setting name (text input)
- Total Monthly Budget (number input, IDR)
- Category allocations section:
  - Select category from dropdown (expense categories only)
  - Enter monthly amount
  - Add/remove rows
  - Running total: "Allocated: Rp1,200,000 / Rp2,000,000"
  - Warning if allocated > total budget
- Submit: create or update

---

## Files

| File | Action |
|------|--------|
| `src/domain/entities/BudgetSetting.ts` | New entity |
| `src/domain/repositories/BudgetSettingRepository.ts` | New interface |
| `src/domain/use-cases/budget-settings/*.ts` | Get, Create, Update, Apply, Delete |
| `src/domain/repositories/BudgetRepository.ts` | New interface (snapshot logic) |
| `src/data/data-sources/budget-settings/BudgetSettingDataSourceImpl.ts` | Drizzle |
| `src/data/data-sources/budgets/BudgetDataSourceImpl.ts` | Drizzle |
| `src/data/mappers/BudgetSettingMapper.ts` | DB → domain |
| `src/data/repositories/BudgetSettingRepositoryImpl.ts` | Impl |
| `src/data/repositories/BudgetRepositoryImpl.ts` | Impl |
| `src/app/actions/budget-settings.ts` | Server actions |
| `src/presentation/features/budget-settings/useBudgetSettingsViewModel.ts` | Hook |
| `src/presentation/features/budget-settings/BudgetSettingsView.tsx` | List UI |
| `src/presentation/features/budget-settings/BudgetSettingNewView.tsx` | Create form |
| `src/presentation/features/budget-settings/BudgetSettingEditView.tsx` | Edit form |

---

## Acceptance Criteria

- [ ] Can create a budget setting with multiple category allocations
- [ ] Can edit a setting (past month snapshots unaffected)
- [ ] Can apply a setting to any month
- [ ] Applied month shows correct setting name in UI
- [ ] Validation: allocated total ≤ total monthly budget
- [ ] Auto-carry works: first dashboard visit in new month applies last setting
