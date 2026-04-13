# CLAUDE.md

**Xpnsio** — Personal finance app.
Stack: Next.js 15 App Router + React 19 · PostgreSQL/Supabase · Drizzle ORM · Supabase Auth (Google OAuth) · Tailwind + shadcn/ui · Vitest

## Dev Commands
`npm run dev|build|lint|test` · `npx drizzle-kit push` (schema→DB) · `npx drizzle-kit studio` (DB browser)

## Features
`src/features/{auth,transactions,categories,budget-settings,dashboard}` · `src/shared/{domain,presentation,core,di}` · `src/lib` · `src/app`

## Project-specific agent rules
`.claude/agents.local/` — additive rules on top of the shared starter-kit agents.

<!-- BEGIN software-dev-agentic:web -->
Next.js 15 App Router · React 19 · Clean Architecture

## Architecture

Module structure and path conventions: `.claude/reference/`

## Principles

Clean Architecture · DRY · SOLID — apply to all new code.

## Workflow

Agents: `feature-orchestrator` · `backend-orchestrator` · `debug-worker` · `test-worker` · `arch-review-worker` · `.claude/skills/`

**Feature work (create or update, any scope) → always delegate to `feature-orchestrator`, never inline.**

**If the delegation guard hook blocks an edit → always stop and ask the user: inline or `feature-orchestrator`? Never resolve it autonomously.**

## Feature Directories

```
src
```
<!-- END software-dev-agentic:web -->
