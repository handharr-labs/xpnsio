# CLAUDE.md

**Xpnsio** — Personal finance app.
Stack: Next.js 15 App Router + React 19 · PostgreSQL/Supabase · Drizzle ORM · Supabase Auth (Google OAuth) · Tailwind + shadcn/ui · Vitest

## Dev Commands
`npm run dev|build|lint|test` · `npx drizzle-kit push` (schema→DB) · `npx drizzle-kit studio` (DB browser)

## Features
`src/features/{auth,transactions,categories,budget-settings,dashboard}` · `src/shared/{domain,presentation,core,di}` · `src/lib` · `src/app`

## Workflow
Before any work: `/create-issue [title]` → wait for instruction → invoke agent

## Issue rule
On `fix/`|`feature/` branch → add feedback to current issue. On `main` → create new issue.

## Project-specific agent rules
`.claude/agents.local/` — additive rules on top of the shared starter-kit agents.

<!-- Shared arch docs, skills, workflow, and code principles → .claude/starter-kit/ -->
