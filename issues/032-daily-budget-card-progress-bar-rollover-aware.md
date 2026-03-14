# 032 · Daily budget card: add Today's progress bar with rollover-aware available budget

**Phase:** TBD
**Status:** `pending`
**GitHub:** [#32](https://github.com/handharr-labs/xpnsio/issues/32)

---

## Goal
Add a visual progress bar to the Daily Budget card that shows today's spending progress. The available budget should be rollover-aware, meaning it accounts for any unspent budget carried over from previous days, giving users an accurate picture of what they can still spend today.

---

## Changes
- Add a progress bar component to the Daily Budget card
- Implement rollover-aware available budget calculation (carry over unspent budget from previous days)
- Display today's spending vs available (rolled-over) budget
- Update card UI to include the progress indicator with budget amounts

---

## Acceptance Criteria
- [ ] Daily budget card displays a progress bar showing today's spending progress
- [ ] Available budget is calculated with rollover from previous days factored in
- [ ] Progress bar visually indicates percentage of budget used today
- [ ] Remaining/available budget amount is shown accurately
- [ ] Rollover logic handles edge cases (e.g., overspent days, no previous data)
