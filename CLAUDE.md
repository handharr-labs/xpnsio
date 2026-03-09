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
Feature-based modules with vertical slicing. Each feature is self-contained with domain, data, and presentation layers.

```
src/
├── features/                    # Feature modules (vertical slices)
│   ├── auth/                    # Authentication feature
│   │   ├── domain/              # Entities, repositories, use-cases
│   │   ├── data/                # Data-sources, repositories impl, mappers
│   │   └── presentation/        # Views, viewmodels, actions
│   ├── transactions/            # Transactions feature
│   ├── categories/              # Categories feature
│   ├── budget-settings/         # Budget settings feature
│   └── dashboard/               # Dashboard feature
├── shared/                      # Cross-cutting shared code
│   ├── domain/                  # Shared domain entities/errors
│   ├── presentation/            # Navigation, common components, providers
│   ├── core/                    # Logger, utilities
│   └── di/                      # Dependency injection containers
├── lib/                         # Framework-specific (db, auth, schema)
└── app/                         # Next.js pages
```

Full architecture docs: `.claude/nextjs-arch/`

## Import Rules
- Feature domain → nothing (no imports from other features or layers)
- Feature data → own domain + shared domain
- Feature presentation → own domain + shared/presentation
- Shared modules can be imported by any feature
- `container.server.ts` never imports React. `container.client.ts` never imports `server-only`.
- Services: pure (no I/O, no async, no DOM). Hooks: readonly state, never expose setters.

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
- **Dependency Inversion** — depend on abstractions, not concretions (wire via `src/shared/di/`)
- **DRY** — extract shared logic; no copy-paste across layers
- **Clean** — clear naming, no dead code, each unit does one thing well
