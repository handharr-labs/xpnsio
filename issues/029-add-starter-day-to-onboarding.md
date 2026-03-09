# 029 · Add Starter Day Input to Onboarding Step 3

**Phase:** Phase 2 — Improvements
**Status:** `done`

---

## Goal

On onboarding step 3 (Name + Currency), users should be able to select their "starter day" — the day of the month when their budget period starts.

---

## Problem

Currently, the budget setup assumes all budgets start on the 1st of the month. Users may have different budget cycles:
- Some get paid on the 15th and want budgets to start then
- Some want budgets to start on the 25th (before month-end)
- Some want custom start dates

---

## Changes

- Add a "Budget Start Day" input to step 3
- Allow users to select day 1-31
- Default to day 1
- Pass this value to the budget setting creation

---

## Acceptance Criteria

- [x] Step 3 shows "Budget Start Day" selector (1-28)
- [x] Default value is 1
- [x] User can select any day from 1-28
- [x] Selected day is passed to budget setting creation
- [x] Review step (4) shows the selected start day
- [x] TypeScript type checking passes

---

## Implementation

Updated `SetupView.tsx` and `useSetupViewModel.ts`:

1. Added `startDay` state (default: 1)
2. Added "Budget Start Day" dropdown in step 3 (days 1-28 with ordinal suffixes)
3. Added helper text explaining what the start day means
4. Passed `startDay` to `completeSetup` function
5. Updated ViewModel to pass `startDay` to `createBudgetSettingAction`
6. Updated step 4 review to display the selected start day

Note: Backend already supported `starterDay` (1-28), so only UI changes were needed.
