# CLAUDE.md

**Xpnsio** — Personal finance app (spending awareness + budget tracking).
Stack: Next.js 15 App Router + React 19 · PostgreSQL/Supabase · Drizzle ORM · Supabase Auth (Google OAuth) · Tailwind + shadcn/ui · Vitest

## Dev Commands

```bash
npm run dev && npm run build && npm run lint && npm test
npx drizzle-kit push    # Push schema to Supabase
npx drizzle-kit studio  # DB browser
```

## Structure
`src/domain/` · `src/data/` · `src/presentation/` · `src/di/` · `src/core/`
Features in `src/presentation/features/[kebab-case]/`. Full arch: `.claude/nextjs-arch/`.

## Import Rules
Domain → nothing. Data → Domain. Presentation → React/Next.js/Domain. Core → nothing.
`container.server.ts` never imports React. `container.client.ts` never imports `server-only`.
Services: pure (no I/O, no async, no DOM). Hooks: readonly state, never expose setters.

## Workflow
Before any work (feature / fix / chore / refactor):
1. `/create-issue [title]` — create issue file + branch, then wait for instruction
2. When instructed to work: invoke the right agent

| Work type | Agent |
|-----------|-------|
| New feature/screen | `feature-scaffolder` |
| New backend (Server Action + DB) | `backend-scaffolder` |
| Bug / error trace | `debug-agent` |
| Tests | `test-writer` |
| Arch review | `arch-reviewer` |
| Refactor | `/simplify` |
| Use case / entity / hook / repo | Matching skill in `.claude/skills/` |

## Code Principles
Follow **CLEAN**, **DRY**, and **SOLID** at all times:
- **Single Responsibility** — one reason to change per class/function/module
- **Open/Closed** — open for extension, closed for modification
- **Liskov Substitution** — subtypes must be substitutable for their base types
- **Interface Segregation** — prefer small, focused interfaces over large ones
- **Dependency Inversion** — depend on abstractions, not concretions (wire via `src/di/`)
- **DRY** — extract shared logic; no copy-paste across layers
- **Clean** — clear naming, no dead code, each unit does one thing well
