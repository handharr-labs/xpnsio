# Hints — How to Use This Starter Kit

## What's Inside

| | Count |
|--|-------|
| Architecture docs (`nextjs-arch/`) | 16 |
| Agents (`.claude/agents/`) | 5 |
| Skills (`.claude/skills/`) | 13 |
| Entry point | `STARTER-KIT-README.md` |

---

## Starting a New Project

**Step 1 — Copy agents and skills into the project**

```bash
mkdir -p .claude/agents .claude/skills
cp path/to/starter-kit/agents/*.md .claude/agents/
cp path/to/starter-kit/skills/*.md .claude/skills/
```

**Step 2 — Tell Claude to set up the project**

Open Claude Code in the new project and say:

> "Set up my project using this starter kit"

Point it at `STARTER-KIT-README.md`. Claude will read it and follow the AI Project Setup flow automatically.

**Step 3 — Answer the setup questions**

Claude will ask about:
- Project mode: frontend-only, full-stack, or both
- Styling / UI library
- Database / ORM (full-stack only)
- Authentication
- Testing framework (Vitest or Jest)

Say "you decide" for anything you're unsure about — Claude will use the recommended default and note it.

**Step 4 — Claude generates the seed files and base structure**

All the foundation files get created before any feature code is written. See `STARTER-KIT-README.md` → Seed Files Manifest for the full list.

**Step 5 — Scaffold your first feature**

```
/new-feature          ← frontend-only or full-stack UI layer
@backend-scaffolder   ← full-stack backend feature (DB + Server Action)
```

---

## Daily Commands

| What you want to do | Command |
|---------------------|---------|
| New full feature (all layers) | `/new-feature` |
| New domain entity | `/new-entity` |
| New use case | `/new-usecase` |
| New ViewModel hook + View | `/new-viewmodel` |
| Wire a use case into DI | `/wire-di` |
| Write tests for any file | `/write-tests` |
| Scaffold integration tests | `/integration-test` |
| Create a mock for an interface | `/create-mock` |
| New domain service (pure logic) | `/scaffold-service` |
| New repository implementation | `/scaffold-repository` |
| Check Server vs Client Component | `/ssr-check` |
| New Server Action (full-stack) | `/new-server-action` |
| New DB repository (full-stack) | `/new-db-repository` |

---

## When to Use Agents

| Situation | Agent |
|-----------|-------|
| Building a complete new feature end-to-end | `@feature-scaffolder` |
| Building a full-stack backend feature | `@backend-scaffolder` |
| Auditing code for architecture violations | `@arch-reviewer` |
| Writing tests for a file or module | `@test-writer` |
| Debugging a runtime error or unexpected behavior | `@debug-agent` |

---

## Project-Specific Things Still to Define

These are intentionally left open — decide them per project:

| Decision | Where to configure |
|----------|--------------------|
| Styling / UI library | Install + configure in `app/layout.tsx` |
| Database / ORM | `src/lib/db.ts` + fill in `*DbDataSourceImpl` stubs |
| Authentication | `src/lib/auth.ts` + update `src/lib/safe-action.ts` |
| Environment variables | `.env.local` — template in `nextjs-arch/project-setup.md` |
| Error monitoring | Wrap `app/layout.tsx` with provider |
| Deployment target | `next.config.ts` output setting |

Full details: `nextjs-arch/project-setup.md`



for prevention, let's adjust the workflow. The goals is:
1. Make agent correctly invoked when working on related topic
2. No bloated context in CLAUDE.md

Let's achieve this by:
1. Adjust workflow. Never automatically fix. If I want to add new feature or bug fixing or any working do these workflow: Create issue under issues folder -> then wait for instructions to working that issue -> Correctly invoke agent related to the work related
2. let's update CLAUDE.md to do these. Low context. but prevent working with violations 
