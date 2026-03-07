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
