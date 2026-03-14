# DI Containers

Three files, strict rules. Read both containers before editing either.

## Files

| File | Purpose | Guard |
|------|---------|-------|
| `container.server.ts` | Server-side use case factories + repo singletons | `import 'server-only'` |
| `container.client.ts` | Client-side use case getters + repo singletons | `import 'client-only'` |
| `DIContext.tsx` | React context wrapping the client container | — |

## Server container (`container.server.ts`)

- First line: `import 'server-only'` — never remove this
- Use cases are **factory functions** (new instance per call): `export const doThingUseCase = () => new DoThingUseCaseImpl(repo)`
- Repositories are **module-level singletons**: `const repo = new RepoImpl(dataSource, mapper, errorMapper)`
- Never import React, hooks, or `client-only`

## Client container (`container.client.ts`)

- First line: `import 'client-only'` — never remove this
- Use cases are **getter properties** inside `createClientContainer()`: `get doThingUseCase() { return new DoThingUseCaseImpl(repo); }`
- Repositories are `const` singletons **inside** `createClientContainer()`, not at module level
- Never import `server-only` or any server-only module

## DIContext.tsx

- Wraps the client container only
- `ClientContainer` type = `ReturnType<typeof createClientContainer>` — no manual type needed
- New use case getter in `container.client.ts` → automatically available via `useDI()`

## Adding a new use case

Run `/wire-di` — it reads both containers, matches the existing pattern, and adds the correct lines.

## Common mistakes

- Adding a use case as a `const` singleton in `container.server.ts` instead of a factory → **stale state across requests**
- Importing a server container factory in a Client Component → **build error** (`server-only` guard)
- Editing only one container when both need the use case → **missing in SSR or client**
