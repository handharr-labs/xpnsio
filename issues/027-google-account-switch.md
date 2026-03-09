# 027 · Allow Switching Google Accounts on Login

**Phase:** Phase 2 — Improvements
**Status:** `done`

---

## Goal

After logging out, clicking "Continue with Google" automatically re-authenticates the previous account without giving the option to switch to a different Google account. Users should be able to choose which Google account to use when logging in.

---

## Problem

Current behavior:
1. User logs out
2. User is redirected to login page
3. User clicks "Continue with Google"
4. Google immediately authenticates with the previously used account
5. No option to select a different Google account

Expected behavior:
- After logout, clicking "Continue with Google" should show the Google account chooser
- Users should be able to select a different Google account or add a new one

---

## Technical Context

This is typically caused by Google OAuth storing the session/cookies. The fix usually involves:
- Adding `prompt=select_account` parameter to the Google OAuth URL
- Or properly clearing Google session on logout

---

## Acceptance Criteria

- [x] After logout, clicking "Continue with Google" shows account chooser
- [x] User can select a different Google account
- [x] User can add a new Google account
- [x] First-time login flow still works smoothly
- [x] Existing login with saved account still works smoothly

---

## Implementation

Added `prompt: 'select_account'` query parameter to Google OAuth in `AuthDataSourceImpl.ts`:

```typescript
async signInWithGoogle(): Promise<void> {
  const { error } = await this.supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${this.redirectOrigin}/auth/callback`,
      queryParams: {
        prompt: 'select_account',  // Forces account chooser
      },
    },
  });
  if (error) throw new Error(error.message);
}
```

This tells Google to always show the account selection screen, allowing users to switch accounts.
