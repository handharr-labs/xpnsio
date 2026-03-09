# 022 · Refactor to Feature-Based Structure

**Phase:** TBD  
**Status:** `pending`

---

## Goal

Refactor the project structure from layer-based (`src/domain/`, `src/data/`, `src/presentation/`) to feature-based organization (`src/features/auth/domain/`, `src/features/transactions/data/`, etc.) for better code organization and maintainability.

---

## Changes

- Reorganize all features (auth, transactions, categories, budget-settings, dashboard) into feature-based modules
- Each feature module contains its own domain/, data/, and presentation/ subdirectories
- Move shared/cross-cutting code to `src/shared/` (shared entities, errors, common UI, navigation)
- Keep DI containers in `src/di/` and framework-specific code in `src/lib/`
- Update all import paths to reflect new structure
- Update CLAUDE.md and HINTS.md to document new structure
- Ensure build, lint, and tests still pass after refactoring

---

## Acceptance Criteria

- [ ] All features organized under `src/features/[feature]/`
- [ ] Each feature contains: `domain/`, `data/`, `presentation/` with appropriate subdirectories
- [ ] Shared code moved to `src/shared/`
- [ ] All imports updated and working
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] Dev server runs successfully
- [ ] CLAUDE.md updated with new structure
- [ ] No circular dependencies between features
