---
name: pickup-issue
description: Pick up a GitHub Issue created by the PM. Fetches issue data, creates the local issue file, and checks out a matching branch.
context: fork
allowed-tools: Bash, Write, Edit, Read
---

Pick up GitHub Issue #$ARGUMENTS for local development.

Steps:

1. **Fetch GitHub Issue data**
   Run: `gh issue view $ARGUMENTS --json number,title,body,url`
   Extract: `number`, `title`, `body`, `url`.

2. **Determine type** from the title:
   - Bug/fix → `fix`, branch prefix `fix/`
   - Feature/new → `feat`, branch prefix `feat/`
   - Chore/cleanup → `chore`, branch prefix `chore/`
   - Docs → `docs`, branch prefix `docs/`

3. **Derive local identifiers**
   - Zero-pad the issue number to 3 digits → `NNN` (e.g. `35` → `035`)
   - Build a kebab-case slug from the title (lowercase, spaces→dashes, strip special chars)

4. **Create issue file** at `issues/NNN-slug.md`
   Populate it from the GitHub issue content. Template:

   ```
   # NNN · Title

   **Phase:** TBD
   **Status:** `pending`
   **GitHub:** [#NNN](url)

   ---

   ## Goal
   [Copy or summarise from the GitHub issue body]

   ---

   ## Changes
   [Key changes needed — infer from the issue body or leave as TBD]

   ---

   ## Acceptance Criteria
   - [ ] [Derive from issue body if present, otherwise leave placeholder]
   ```

5. **Create git branch**
   Run: `git checkout -b [type]/issue-NNN-slug`
   Example: `feat/issue-035-add-export-button`

6. **Update backlog**
   Add a row under the "## Inbox" section at the bottom of `issues/000-backlog.md`
   (create the section if it doesn't exist):
   `| NNN | Title | \`pending\` | [NNN-slug.md](./NNN-slug.md) · [#NNN](url) |`

7. **Confirm** — show the user:
   - GitHub Issue fetched: title + URL
   - Issue file created: `issues/NNN-slug.md`
   - Branch created: `[type]/issue-NNN-slug`
   - Backlog updated
   - Suggested next step: invoke `feature-scaffolder` or `debug-agent` depending on issue type
