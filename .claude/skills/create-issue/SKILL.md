---
name: create-issue
description: Create a new issue file in issues/ and a matching git branch. Use when asked to create, track, or log a new issue or task.
context: fork
allowed-tools: Bash, Write, Edit, Read
---

Create a new issue for this project from $ARGUMENTS.

Steps:

1. **Find next issue number**
   Run: `ls issues/ | grep -E '^[0-9]{3}-' | sort | tail -1`
   Extract the number and increment by 1. Zero-pad to 3 digits (e.g. 022).

2. **Determine type** from the description:
   - Bug/fix → `fix`, branch prefix `fix/`
   - Feature/new → `feat`, branch prefix `feat/`
   - Chore/cleanup → `chore`, branch prefix `chore/`
   - Docs → `docs`, branch prefix `docs/`

3. **Create issue file** at `issues/NNN-slug.md`
   Use kebab-case slug from the title. Template:

   ```
   # NNN · Title

   **Phase:** [infer from context, default: TBD]
   **Status:** `pending`

   ---

   ## Goal
   [What this accomplishes — infer from $ARGUMENTS]

   ---

   ## Changes
   [Key changes needed — infer or leave as TBD]

   ---

   ## Acceptance Criteria
   - [ ] ...
   ```

4. **Create git branch**
   Run: `git checkout -b [type]/issue-NNN-slug`
   Example: `feat/issue-022-receipt-scanning`

5. **Update backlog**
   Add a row to the appropriate phase table in `issues/000-backlog.md`:
   `| NNN | Title | \`pending\` | [NNN-slug.md](./NNN-slug.md) |`
   If unsure which phase, add under a "## Inbox" section at the bottom (create it if it doesn't exist).

6. **Confirm** — show the user:
   - Issue file created: `issues/NNN-slug.md`
   - Branch created: `[type]/issue-NNN-slug`
   - Backlog updated
