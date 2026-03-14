# 025 · Add Weekly Progress Bar to Daily Budget Category Cards

**Phase:** Phase 2 — Improvements
**Status:** `done`
**GitHub:** [#25](https://github.com/handharr-labs/xpnsio/issues/25)

---

## Goal

Daily budget category cards should display three progress bars: **Daily**, **Weekly**, and **Monthly**. Previously, only "Daily" and "Overall" (now renamed to "Monthly") were shown.

---

## Changes

- Renamed "Overall" → "Monthly" for clarity
- Added new **"Weekly"** progress bar between Daily and Monthly
- Weekly progress uses the same accumulated budget value as Daily (since weekly allocation is the same as daily allocation × days elapsed)
- No backend changes required — this is a UI-only change

---

## Acceptance Criteria

- [x] Daily budget category cards show three progress bars: Daily, Weekly, Monthly
- [x] Daily and Weekly show the same percentage (expected — they use the same accumulated budget)
- [x] Monthly shows a different percentage (based on full monthly budget vs accumulated)
- [x] All three bars show red color when overrun
- [x] TypeScript type checking passes
