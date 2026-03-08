# 015 · Bug: Transaction Amount Rejects Valid Values (step validation)

**Phase:** 2
**Status:** `ready`
**Severity:** High — blocks users from logging transactions
**Root Cause:** Known, fix is 1 line

---

## Bug

When entering an amount like `306500` on the New Transaction form, the browser rejects it with:

> "The two nearest valid values are 306000 and 307000"

**Root cause:** `TransactionNewView.tsx:118` has `step="1000"` on the amount input. The browser's native number input validation only accepts multiples of 1000.

---

## Fix

**File:** `src/presentation/features/transactions/TransactionNewView.tsx`

```tsx
// Before
<input type="number" step="1000" ... />

// After
<input type="number" step="any" ... />
```

`step="any"` disables the step validation entirely — any numeric value is accepted. Amount validation (> 0) is still enforced by the use case.

---

## Related

This issue is superseded by **013 · Currency Input Formatting** which replaces `<input type="number">` with a formatted text input entirely, making `step` irrelevant. Fix 015 first as a quick patch; 013 is the proper long-term solution.

---

## Acceptance Criteria

- [ ] `306500`, `12750`, `99999` all accepted without browser error
- [ ] Amount still must be > 0 (server-side validation)
