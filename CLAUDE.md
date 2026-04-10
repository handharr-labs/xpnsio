# CLAUDE.md

**Xpnsio** — Personal finance app.
Stack: Next.js 15 App Router + React 19 · PostgreSQL/Supabase · Drizzle ORM · Supabase Auth (Google OAuth) · Tailwind + shadcn/ui · Vitest

## Dev Commands
`npm run dev|build|lint|test` · `npx drizzle-kit push` (schema→DB) · `npx drizzle-kit studio` (DB browser)

## Features
`src/features/{auth,transactions,categories,budget-settings,dashboard}` · `src/shared/{domain,presentation,core,di}` · `src/lib` · `src/app`

## Project-specific agent rules
`.claude/agents.local/` — additive rules on top of the shared starter-kit agents.

<!-- BEGIN web-agentic -->
## Workflow
Before any work, invoke the **issue-worker** agent with a title (new) or number (existing).

```
issue-worker "add X"   → create GH issue + branch + backlog row
issue-worker 42        → pick up existing GH issue + branch + backlog row
```

Agents: `feature-orchestrator` · `backend-orchestrator` · `debug-worker` · `test-worker` · `arch-review-worker` · `/simplify` · `.claude/skills/`

Issue rule: On `fix/`|`feat/` branch → add feedback to current issue. On `main` → create new issue.

## Code Principles
CLEAN · DRY · SOLID (SRP, OCP, LSP, ISP, DIP). Wire deps via `src/shared/di/`.
<!-- END web-agentic -->
