# 032 · Add pull-to-refresh behavior on dashboard

**Phase:** Phase 2 — Improvements
**Status:** `pending`
**GitHub:** [#30](https://github.com/handharr-labs/xpnsio/issues/30)

---

## Goal
Allow users to manually refresh dashboard data (transactions, budget progress, spending summary) by triggering a pull-to-refresh gesture or action, ensuring they always see up-to-date information.

---

## Changes
- Add a refresh trigger (button or pull gesture) on the dashboard
- Re-fetch transactions, budget summaries, and category spending on refresh
- Show loading state while data is being re-fetched
- Wire through the existing use cases / server actions

---

## Acceptance Criteria
- [ ] Dashboard has a visible refresh affordance (e.g. refresh button or pull gesture support)
- [ ] Triggering refresh re-fetches all dashboard data
- [ ] Loading state is shown during refresh
- [ ] Data updates correctly after refresh completes
