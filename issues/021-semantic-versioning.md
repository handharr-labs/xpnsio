# Issue 021 — Semantic Versioning Setup

**Status:** done
**GitHub:** [#21](https://github.com/handharr-labs/xpnsio/issues/21)
**Branch:** `feat/issue-021-versioning`

## Problem

No versioning infrastructure beyond `"version": "0.1.0"` in `package.json`. No CHANGELOG, no release tags, no automated version bumping.

## Solution

Add `release-it` + `@release-it/conventional-changelog` for a one-command release workflow:
- Reads conventional commits → determines version bump (patch/minor/major)
- Generates/updates `CHANGELOG.md`
- Bumps `package.json` version
- Creates a git tag (`v0.2.0`, etc.)

## Changes

- `package.json` — added `release`, `release:minor`, `release:major` scripts; installed `release-it` and `@release-it/conventional-changelog` as devDependencies
- `.release-it.json` — new config file
- `CHANGELOG.md` — new file, seeded with header

## Usage

```bash
npm run release          # auto-detects patch/minor from commits
npm run release:minor    # force minor bump
npm run release:major    # force major bump
npm run release -- --dry-run  # preview without making changes
```
