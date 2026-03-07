# Xpnsio — Project Kickoff Notes

## App Overview

**Name:** Xpnsio
**Purpose:** Personal finance app focused on spending awareness and budget tracking
**Target:** Personal use first, with room to grow and scale
**Tagline concept:** Know how much budget you have left, stay aware of your spending

---

## Final Tech Stack

| Layer | Choice |
|-------|--------|
| **Framework** | Next.js (App Router) |
| **Database** | PostgreSQL via Supabase |
| **Auth** | Supabase Auth (Google OAuth) |
| **ORM** | Drizzle ORM |
| **Styling** | Tailwind CSS |
| **Hosting** | Vercel |

---

## Accounts Created

- [x] **Supabase** — project `xpnsio`, org `handharr-labs` — Active
- [ ] **Vercel** — sign up with GitHub
- [x] **Google Cloud Console** — OAuth 2.0 credentials created

---

## Supabase Setup

- Project name: `xpnsio`
- RLS (Row Level Security): **enabled**
- Status: **Active**

### Keys collected

- [x] `NEXT_PUBLIC_SUPABASE_URL`
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [x] `SUPABASE_SERVICE_ROLE_KEY`
- [x] `DATABASE_URL` (with password)

All saved to `.env.local`.

---

## Local Project Setup

- [x] Folder created: `/Users/mekari/Workspace/xpnsio/`
- [x] Starter kit agents & skills copied to `.claude/agents/` and `.claude/skills/`
- [x] `.env.local` created with all Supabase credentials
- [x] `CLAUDE.md` trimmed and optimized

### Setup Checklist (before scaffolding Next.js)

- [x] **Google Cloud Console** — created OAuth 2.0 credentials, `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` in `.env.local`
- [x] **Supabase Auth** — Google provider enabled, credentials set, callback URL configured
- [ ] **GitHub** — create repo, push workspace
- [ ] **Vercel** — import GitHub repo, add env vars
- [ ] **Scaffold Next.js app** — `npx create-next-app@latest` + install deps
- [ ] **`src/lib/db.ts`** — Drizzle client
- [ ] **`src/lib/auth.ts`** — Supabase Auth client
- [ ] **Define DB schema** + `npx drizzle-kit push`
