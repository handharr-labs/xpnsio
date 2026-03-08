# 002 · Onboarding: Budget Setting Setup

**Phase:** 1 — MVP
**Status:** `in-progress`
**Route:** `/setup`
**Depends on:** 001, 003, 004

---

## Goal

First-run gate shown before a user can access the dashboard. Guides them through creating their first Budget Setting and applying it to the current month.

---

## User Flow (4 steps)

### Step 1 — Create Categories
- User creates expense categories with:
  - Name (text)
  - Master type: Daily / Weekly / Monthly
  - Icon (emoji or lucide icon name)
  - Color (hex picker or preset swatches)
- Can add multiple categories
- Pre-populated suggestions: Coffee (Daily), Transport (Daily), Groceries (Monthly)

### Step 2 — Set Monthly Amounts
- For each category created in Step 1, user enters monthly budget amount
- Running total shown: "Allocated: Rp1,200,000"

### Step 3 — Total Budget & Name
- User sets total monthly budget (the overall spending cap)
- Validation: total allocated ≤ total monthly budget
- Name the Budget Setting (default: "My Budget")

### Step 4 — Review & Confirm
- Summary of: setting name, total budget, categories with allocations
- "Confirm" button:
  1. Calls `createBudgetSettingAction`
  2. Calls `applyBudgetSettingAction` for current month
  3. Redirects to `/dashboard`

---

## Skip Behavior
- Skip allowed **only if** user already has at least 1 Budget Setting
- If no Budget Setting exists, `/dashboard` redirects to `/setup`

---

## Files

| File | Action |
|------|--------|
| `src/app/setup/page.tsx` | New page |
| `src/presentation/features/setup/SetupView.tsx` | Multi-step wizard UI |
| `src/app/(main)/dashboard/page.tsx` | Add redirect guard |

---

## Acceptance Criteria

- [ ] First login always lands on `/setup`
- [ ] Cannot reach `/dashboard` without completing setup (or having existing Budget Setting)
- [ ] Setup creates categories, budget setting, and applies to current month
- [ ] On refresh mid-setup, state is not lost (store in component state is fine for MVP)
