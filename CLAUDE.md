# CLAUDE.md

**Xpnsio** — Personal finance app (spending awareness + budget tracking).
Stack: Next.js 15 App Router + React 19 · PostgreSQL/Supabase · Drizzle ORM · Supabase Auth (Google OAuth) · Tailwind + shadcn/ui · Vitest

## Dev Commands
```bash
npm run dev | build | lint | test
npx drizzle-kit push    # schema → Supabase
npx drizzle-kit studio  # DB browser
```

## Structure
Feature-based vertical slices: `src/features/{auth,transactions,categories,budget-settings,dashboard}` · `src/shared/{domain,presentation,core,di}` · `src/lib` · `src/app`
Full arch docs: `.claude/nextjs-arch/`

## Import Rules
- domain → nothing · data → own domain + shared domain · presentation → own domain + shared/presentation
- `container.server.ts` no React · `container.client.ts` no `server-only`
- Services: pure (no I/O, no async, no DOM) · Hooks: readonly state, no exposed setters

## Workflow
Before any work: `/create-issue [title]` → wait for instruction → invoke agent

| Work type | Agent |
|-----------|-------|
| New feature/screen | `feature-scaffolder` |
| New backend (Server Action + DB) | `backend-scaffolder` |
| Bug / error | `debug-agent` |
| Tests | `test-writer` |
| Arch review | `arch-reviewer` |
| Refactor | `/simplify` |
| Use case / entity / hook / repo | `.claude/commands/` |

**Issue Creation Rule:**
- When on a `fix/` or `feature/` branch: Add feedback to current issue, don't create new issues
- From `main` branch: Create new issues

## Code Principles
CLEAN · DRY · SOLID (SRP, OCP, LSP, ISP, DIP). Wire deps via `src/shared/di/`.
