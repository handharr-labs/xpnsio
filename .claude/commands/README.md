# Skills

User-invocable prompt expansions triggered with `/skill-name`.

Copy to `.claude/skills/` in the actual project.

| Skill | Trigger | What it does |
|-------|---------|-------------|
| `new-feature` | `/new-feature` | Full feature scaffold — all layers + DI wiring |
| `new-entity` | `/new-entity` | Domain entity + DTO + Mapper |
| `new-usecase` | `/new-usecase` | UseCase interface + implementation |
| `new-viewmodel` | `/new-viewmodel` | ViewModel hook + View component |
| `write-tests` | `/write-tests` | Tests for any file — auto-selects test type by layer |
| `ssr-check` | `/ssr-check` | Server vs Client Component decision + code structure |
| `wire-di` | `/wire-di` | Wire a use case into `container.server.ts` and/or `container.client.ts` |
| `create-mock` | `/create-mock` | Scaffold a `Mock[Name]` class with `vi.fn()` for every interface method |
| `scaffold-service` | `/scaffold-service` | Create a pure domain service (no async, no I/O, no framework imports) |
| `scaffold-repository` | `/scaffold-repository` | Create a repository implementation with mapper + `ErrorMapper` on every method |
| `integration-test` | `/integration-test` | Scaffold integration tests covering happy path + all HTTP error codes + network failure |
| `new-server-action` | `/new-server-action` | Scaffold a validated Server Action with next-safe-action, Zod schema, auth guard, and use case call |
| `new-db-repository` | `/new-db-repository` | Scaffold a DB-backed DataSource + Repository impl (ORM-agnostic stub) with DB mapper and error mapper |
