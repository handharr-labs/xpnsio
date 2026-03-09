# 024 · Remove Total Monthly Budget Input from Budget Settings

**Phase:** Phase 2 — Improvements
**Status:** `pending`

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

- [ ] "Total Monthly Budget" input is no longer shown on the create budget setting form
- [ ] "Total Monthly Budget" input is no longer shown on the edit budget setting form
- [ ] The total is computed as the sum of all category `amount` values
- [ ] The computed total is displayed as a read-only summary (e.g. "Total: Rp1.500.000")
- [ ] Saving a budget setting works correctly without requiring the user to input a total
- [ ] Existing budget settings with a stored total are not broken
