# 020 · Drizzle-kit Push Fails Due to Pool Exhaustion

**Phase:** infra (bug)
**Status:** `done`
**GitHub:** [#20](https://github.com/handharr-labs/xpnsio/issues/20)
**Affects:** `drizzle.config.ts`, local development workflow

---

## Problem

`npx drizzle-kit push` fails with `MaxClientsInSessionMode: max clients reached` when the dev server is running. Both the app and drizzle-kit share the same `DATABASE_URL`, which points to Supabase's session-mode pooler (port 5432). The dev server consumes all available sessions, leaving none for drizzle-kit.

This also caused a runtime error on the dashboard: the `currency` column added to `budget_settings` was never pushed to the DB, so queries selecting it failed.

---

## Fix

Update `drizzle.config.ts` to prefer `DIRECT_DATABASE_URL` (Supabase direct connection, bypasses the pooler) when available, falling back to `DATABASE_URL`.

Add to `.env.local`:
```
DIRECT_DATABASE_URL=postgresql://postgres.[project-ref]:[password]@db.[project-ref].supabase.co:5432/postgres
```

Get this URL from: Supabase Dashboard → Project Settings → Database → Connection string → **Direct connection**.

The runtime app continues using `DATABASE_URL` (pooler) — no production impact.

---

## Files

| File | Change |
|------|--------|
| `drizzle.config.ts` | Use `DIRECT_DATABASE_URL ?? DATABASE_URL` |

---

## Acceptance Criteria

- [ ] `npx drizzle-kit push` succeeds while dev server is running
- [ ] `DIRECT_DATABASE_URL` added to `.env.local` (not committed)
