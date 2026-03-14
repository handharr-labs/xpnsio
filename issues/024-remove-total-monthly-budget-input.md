# 024 · Remove Total Monthly Budget Input from Budget Settings

**Phase:** Phase 2 — Improvements
**Status:** `done`
**GitHub:** [#24](https://github.com/handharr-labs/xpnsio/issues/24)

---

## Goal

The "Total Monthly Budget" field in the budget settings (create and edit forms) should be removed. The total is derived automatically by summing all category budgets, so manual input is redundant and error-prone.

---

## Changes

- Remove the "Total Monthly Budget" input field from the budget setting create form
- Remove the "Total Monthly Budget" input field from the budget setting edit form
- Display the computed total (sum of all category budget amounts) as a read-only/derived value where needed
- Update domain/data layer to not require `totalMonthlyBudget` as a user-supplied field — compute it from categories instead
- Update any validation schemas that require the field

---

## Acceptance Criteria

- [x] "Total Monthly Budget" input is no longer shown on the create budget setting form
- [x] "Total Monthly Budget" input is no longer shown on the edit budget setting form
- [x] The total is computed as the sum of all category `amount` values
- [x] The computed total is displayed as a read-only summary (e.g. "Total: Rp1.500.000")
- [x] Saving a budget setting works correctly without requiring the user to input a total
- [x] Existing budget settings with a stored total are not broken
