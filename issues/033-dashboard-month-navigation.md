# 033 · Dashboard Month Navigation

**Phase:** Phase 2 — Improvements
**Status:** `in-progress`
**GitHub:** [#31](https://github.com/handharr-labs/xpnsio/issues/31)

---

## Goal
Allow users to navigate between months on the dashboard so they can view past budget and spending data, not just the current month.

---

## Changes
- Add `selectedPeriod` state (year + month) to `DashboardView`
- Replace hardcoded `new Date()` passed to `useDashboardViewModel` with `selectedPeriod`
- Add prev/next month navigation buttons in the dashboard header
- Disable the next button when viewing the current month
- Update empty state to show context-appropriate message for past months (no CTA to set up budget retroactively)

---

## Acceptance Criteria
- [ ] Clicking `‹` navigates to the previous month and reloads data
- [ ] Clicking `›` navigates to the next month and is disabled on the current month
- [ ] Month label in header reflects the selected period
- [ ] Past months with no budget show "No budget was applied for this month" (no CTA)
- [ ] Current month with no budget shows "Set Up Budget" CTA
- [ ] Pull-to-refresh still works and refreshes the selected period
- [ ] `npm run build` passes with no errors
