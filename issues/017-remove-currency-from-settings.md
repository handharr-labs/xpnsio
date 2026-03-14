# 017 · Remove Currency Preference from Settings Page

**Phase:** 2
**Status:** `done`
**GitHub:** [#17](https://github.com/handharr-labs/xpnsio/issues/17)
**Affects:** `SettingsView.tsx`, `profiles` table (optional cleanup)

---

## Problem

The Settings page (`/settings`) shows a currency preference field. This is now redundant — currency is set per Budget Setting (issue 012), not globally. Having it in Settings creates confusion about which currency takes precedence.

---

## Changes

### `SettingsView.tsx`
- Remove the currency selector/display section entirely
- Keep: user profile info (avatar, name, email), sign out button
- Keep: any other preferences that genuinely belong at the user level

### `profiles` table (optional)
- The `currency` column on `profiles` was added in the original schema but is now superseded by `budget_settings.currency`
- Can be removed in a future schema migration, or left as unused for now
- **For this issue: just remove it from the UI, no schema change required**

---

## Files to Change

| File | Change |
|------|--------|
| `src/presentation/features/settings/SettingsView.tsx` | Remove currency section |

---

## Acceptance Criteria

- [ ] Settings page has no currency field
- [ ] Settings page still shows: avatar, name, email, sign out
- [ ] No broken references to currency in settings
