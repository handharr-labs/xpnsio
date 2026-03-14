# 028 · Remove Total Monthly Budget Input from Onboarding

**Phase:** Phase 2 — Improvements
**Status:** `done`
**GitHub:** [#28](https://github.com/handharr-labs/xpnsio/issues/28)

---

## Goal

Onboarding step 2 still asks users to input their "Total Monthly Budget". This is redundant because the total budget is automatically calculated as the sum of all category budgets.

---

## Problem

Current behavior:
- Step 1: User sets up categories with individual budgets
- Step 2: User is asked to enter "Total Monthly Budget" again

This is confusing because:
1. The total is already calculated from category budgets
2. Users might enter a different number than the sum, causing inconsistency
3. It's an unnecessary step in the onboarding flow

---

## Changes

- Remove the "Total Monthly Budget" input field from onboarding step 2
- Update step 2 to show a summary/read-only view of the calculated total budget
- Update any related validation logic
- Ensure the dashboard still correctly calculates and displays total budget

---

## Acceptance Criteria

- [x] Onboarding step 2 no longer shows editable "Total Monthly Budget" input
- [x] Step 2 shows the calculated total from category budgets (read-only)
- [x] User can proceed to next step without entering total budget
- [x] Dashboard still correctly shows total budget as sum of categories
- [x] TypeScript type checking passes

---

## Implementation

Updated `SetupView.tsx`:

1. **Removed** editable "Total Monthly Budget" input field from step 2
2. **Removed** `totalBudget` state variable (no longer needed)
3. **Added** read-only "Total Monthly Budget" display showing calculated `totalAllocated`
4. **Removed** "Remaining" calculation (no longer relevant without manual total input)
5. **Updated** step 4 review to use `totalAllocated` instead of `totalBudget`
6. **Updated** `handleComplete` to pass `totalAllocated` as `totalBudget` to backend

The ViewModel already had fallback logic to use `totalAllocated` when `totalBudget` is 0, so backend changes were not required.

---

## Additional Fixes (Same Branch)

### Budget Start Day Selector (#029)
- Added "Budget Start Day" dropdown to step 3 (days 1-28)
- Default to day 1, allows users to select their budget period start date
- Shows selected start day in review step

### Currency Input Tab Bug Fix (#030)
- Fixed CurrencyInput component losing currency symbol when tabbing between fields
- Root cause: `overflow-hidden` on wrapper combined with fixed `w-44` width caused currency span to crop when input expanded
- Solution: Removed `overflow-hidden`, added `min-w-0` to input for proper flex shrinking
- Added focus tracking to prevent external value updates from overwriting user input
- Changed category list keys from `index` to stable keys (`cat.name + cat.color`)
