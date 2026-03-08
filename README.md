# Xpnsio

Personal finance app focused on spending awareness and budget tracking. Built as a PWA with Google OAuth sign-in.

## Stack

- **Framework:** Next.js 15 App Router + React 19
- **Database:** PostgreSQL via Supabase + Drizzle ORM
- **Auth:** Supabase Auth (Google OAuth)
- **UI:** Tailwind CSS v4 + shadcn/ui
- **Testing:** Vitest + Testing Library

## Getting Started

```bash
npm install
npm run dev
```

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials.

## Dev Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest tests |
| `npx drizzle-kit push` | Push schema to Supabase |
| `npx drizzle-kit studio` | Open DB browser |

## Release

Versioned with [release-it](https://github.com/release-it/release-it) using [Conventional Commits](https://www.conventionalcommits.org/).

```bash
npm run release          # auto-bump (patch/minor from commits)
npm run release:minor    # force minor bump
npm run release:major    # force major bump
npm run release -- --dry-run  # preview without changes
```

## Project Structure

```
src/
  app/          # Next.js App Router pages & layouts
  domain/       # Entities, repository interfaces, use cases (no dependencies)
  data/         # Repository implementations, DB queries
  presentation/ # React components, hooks, view models
    features/   # auth · budget-settings · categories · dashboard · settings · setup · transactions
  di/           # Dependency injection container (server + client)
  core/         # Shared utilities (no dependencies)
```

## Architecture

Clean Architecture with strict layer boundaries:
- `domain/` → imports nothing internal
- `data/` → imports `domain/`
- `presentation/` → imports React/Next.js and `domain/`
- `core/` → imports nothing internal
