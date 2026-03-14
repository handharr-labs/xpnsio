---
name: create-issue
description: Create a new issue file in issues/ and a matching git branch. Use when asked to create, track, or log a new issue or task.
context: fork
allowed-tools: Bash, Write, Edit, Read
---

Create a new issue for this project from $ARGUMENTS.

Steps:

1. **Determine type** from the description:
   - Bug/fix → `fix`, branch prefix `fix/`
   - Feature/new → `feat`, branch prefix `feat/`
   - Chore/cleanup → `chore`, branch prefix `chore/`
   - Docs → `docs`, branch prefix `docs/`

2. **Create GitHub Issue first** to get the canonical issue number:
   Run: `gh issue create --title "[title]" --body "[inferred description]"`
   Capture the returned GitHub issue URL (e.g. `https://github.com/owner/repo/issues/34`).
   Extract the number from the URL → zero-pad to 3 digits (e.g. `034`).

3. **Create issue file** at `issues/NNN-slug.md`
   Use kebab-case slug from the title. Template:

   ```
   # NNN · Title

   **Phase:** [infer from context, default: TBD]
   **Status:** `pending`
   **GitHub:** [#NNN](https://github.com/owner/repo/issues/NNN)

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
   Example: `feat/issue-034-add-export-button`

5. **Update backlog**
   Add a row to the appropriate phase table in `issues/000-backlog.md`:
   `| NNN | Title | \`pending\` | [NNN-slug.md](./NNN-slug.md) · [#NNN](GitHub URL) |`
   If unsure which phase, add under a "## Inbox" section at the bottom (create it if it doesn't exist).

6. **Confirm** — show the user:
   - GitHub Issue created: URL
   - Issue file created: `issues/NNN-slug.md`
   - Branch created: `[type]/issue-NNN-slug`
   - Backlog updated
