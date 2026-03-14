# CLAUDE.md

**Xpnsio** — Personal finance app. Stack: Next.js 15 App Router + React 19 · PostgreSQL/Supabase · Drizzle ORM · Supabase Auth (Google OAuth) · Tailwind + shadcn/ui · Vitest

## Dev Commands
`npm run dev|build|lint|test` · `npx drizzle-kit push` (schema→DB) · `npx drizzle-kit studio` (DB browser)

## Structure
Feature slices: `src/features/{auth,transactions,categories,budget-settings,dashboard}` · `src/shared/{domain,presentation,core,di}` · `src/lib` · `src/app`
Arch docs: `.claude/nextjs-arch/` · DI/arch rules: `.claude/docs/`

## Workflow
Before any work: `/create-issue [title]` → wait for instruction → invoke agent

Agents: `feature-scaffolder` · `backend-scaffolder` · `debug-agent` · `test-writer` · `arch-reviewer` · `/simplify` · `.claude/skills/`

Issue rule: On `fix/`|`feature/` branch → add feedback to current issue. On `main` → create new issue.

## Code Principles
CLEAN · DRY · SOLID (SRP, OCP, LSP, ISP, DIP). Wire deps via `src/shared/di/`.
