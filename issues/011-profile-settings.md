# 011 · Profile & Settings

**Phase:** 3 — Extended Features
**Status:** `planned`
**GitHub:** [#11](https://github.com/handharr-labs/xpnsio/issues/11)
**Route:** `/settings`
**Depends on:** 001

---

## Goal

User profile display and app preferences. Simple screen accessible from dashboard header.

---

## Sections

### Profile
- Avatar (from Google OAuth)
- Display name
- Email (read-only)

### Preferences
- **Currency display**: IDR (default), USD, SGD, etc.
  - Stored in `profiles.currency`
  - Affects formatting across the entire app
  - Save button per preference

### Danger Zone
- **Sign out** button

---

## Files

| File | Action |
|------|--------|
| `src/app/actions/profile.ts` | `updateCurrencyAction` |
| `src/presentation/features/settings/SettingsView.tsx` | UI |
| `src/app/(main)/settings/page.tsx` | Route |

---

## Notes

- Currency change only affects display formatting — amounts stored in DB are raw numbers
- For MVP: IDR only, but field exists for future expansion
- Avatar loaded from `user.avatarUrl` (Google profile photo)

---

## Acceptance Criteria

- [ ] Shows user avatar, name, email
- [ ] Can change currency preference (saves to profiles table)
- [ ] Sign out works and redirects to /login
- [ ] Currency change reflected in dashboard and transaction list
