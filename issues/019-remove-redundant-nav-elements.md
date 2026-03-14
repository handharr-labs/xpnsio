# 019 · Remove Redundant Navigation Elements

**Phase:** 1 (cleanup)
**Status:** `done`
**GitHub:** [#19](https://github.com/handharr-labs/xpnsio/issues/19)
**Affects:** `DashboardView.tsx`, `SettingsView.tsx`

---

## Problem

With the shared `BottomNav` now present on all pages (issue 018), two UI elements became redundant:

1. **Dashboard** — has a Settings button and Sign Out button in the header area. Users can reach Settings via the bottom nav; sign out lives in Settings.
2. **Settings page** — has a "Navigation" card with buttons to Dashboard, Budget Settings, and Transactions. These are all reachable via the bottom nav.

---

## Changes

### `DashboardView.tsx`
- Remove the Settings icon button / sign-out shortcut from the header

### `SettingsView.tsx`
- Remove the Navigation card entirely

---

## Acceptance Criteria

- [ ] Dashboard header has no Settings/Sign Out button
- [ ] Settings page has no Navigation card
- [ ] All navigation still reachable via bottom nav
