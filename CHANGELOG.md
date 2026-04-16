# Changelog

## [2.9.0](https://github.com/handharr-labs/xpnsio/compare/v2.8.0...v2.9.0) (2026-04-16)

### Features

* **split-bill:** bills added to a trip now show a trip name badge on the bill list
* **split-bill:** visiting a trip-linked bill's public link now redirects to the trip's public page instead of showing the individual payment UI — prevents participants from accidentally paying only one bill out of a multi-bill trip
* **split-bill:** bill manage page now shows a trip info banner with a "Go to trip" button and swaps the share link to the trip's public URL when the bill belongs to a trip

## [2.8.0](https://github.com/handharr-labs/xpnsio/compare/v2.7.0...v2.8.0) (2026-04-16)

### Bug Fixes

* **split-bill:** share URL input now shrinks on mobile so Copy and Open buttons stay in-row without overflowing
* **split-bill:** "Bill Creator" / "Trip Creator" badge now matches the padding and pill shape of Pending/Approved status badges
* **split-bill:** proof submission no longer fails with an RLS error on iOS PWA — added Supabase Storage INSERT policy for unauthenticated participants on the `payment-proofs` bucket

## [2.7.0](https://github.com/handharr-labs/xpnsio/compare/v2.6.0...v2.7.0) (2026-04-15)

### Refactor

* **shared:** extract `PublicParticipantCard` organism for public bill/trip pages — handles all five participant states with correct green styling for creator rows

### Bug Fixes

* **trips:** trip creator no longer receives an "I'm [name]" button on the public trip settlement page

## [2.6.0](https://github.com/handharr-labs/xpnsio/compare/v2.5.0...v2.6.0) (2026-04-15)

### Features

* **shared:** extract reusable organisms — `ShareLinkRow`, `PaymentAccountItem`, `PaymentAccountList`, `ProofImageModal`, `DeleteConfirmDialog`, `ProofActionsRow`, `ManageParticipantCard` — shared across bill and trip detail manage views

### Bug Fixes

* **trips:** upload proof bottom sheet no longer fills the entire screen on iOS — cap modal height at 90 vh with scroll
* **trips:** show "Trip creator" badge on the creator's settlement row in the public trip settlement page
* **mobile:** skeleton items in trip/bill detail and split bill list now render at full width on iOS
* **ui:** participant names in `ManageParticipantCard` are capitalized — fixes lowercase trip settlement names stored in DB
* **ui:** "Me" badge renamed to "Bill creator" / "Trip creator" across manage views
* **ui:** trip detail now shows a grouped payment accounts section (deduped across all bills)
* **ui:** trip creator settlement is force-displayed as "Approved" (they pay upfront)
* **ui:** external link icon button no longer shrinks on narrow mobile viewports (`shrink-0`)

## [2.5.0](https://github.com/handharr-labs/xpnsio/compare/v2.4.0...v2.5.0) (2026-04-14)

### Features

* **trips:** show payment accounts on trip public settlement link
* **trips:** replace raw bill ID input with a bill picker dialog when adding bills to a trip
* **trips:** add loading spinner and success screen after proof upload on public trip settlement page

### Bug Fixes

* **trips:** settlement UX improvements — approve/reject button colors, creator auto-approve, display name fix
* **trips:** merge duplicate payment accounts, fix payment_accounts table references
* **split-bill:** sort standalone bill list by latest first
* **css:** add Tailwind v4 `@source` directive and Base UI position utilities for production build

## [2.4.0](https://github.com/handharr-labs/xpnsio/compare/v2.3.0...v2.4.0) (2026-04-07)

### Features

* **trips:** add full Trips feature — domain entities, use cases, data layer, DI wiring, presentation views, actions, and app routes
* **trips:** add `trips` and `trip_participant_settlements` tables to DB schema
* **split-bill:** integrate Trips section into the split bill list with section descriptions
* **split-bill:** add `is_creator` column and propagate `isCreator` through domain, data, and presentation layers; seed creator participant on bill creation

## [2.3.0](https://github.com/handharr-labs/xpnsio/compare/v2.2.0...v2.3.0) (2026-03-31)

### Features

* **split-bill:** full Split Bill MVP — domain, data, presentation, and app routes
* **split-bill:** add DB schema for split bill tables
* **split-bill:** add edit bill flow with shared form component
* **split-bill:** add delete bill with confirmation dialog
* **split-bill:** add custom split mode — total bill amount input, remaining balance indicator, rounding remainder distributed to last participant
* **split-bill:** replace raw number inputs with `CurrencyInput` in split bill form
* **split-bill:** replace native select with shadcn `Select` in adjustments step
* **split-bill:** swap `BottomNav` active tab to Split Bill

### Bug Fixes

* **split-bill:** fix tax/service dropdown and value input layout

## [2.2.0](https://github.com/handharr-labs/xpnsio/compare/v2.1.0...v2.2.0) (2026-03-28)

### Bug Fixes

* **architecture:** resolve cross-layer violations — move service implementations out of domain, enforce `readonly` / `ReadonlyArray` across all entities
* **presentation:** extract ViewModels from Views across all features; resolve cross-feature imports
* **presentation:** add missing `'use client'` directives; propagate currency; fix dashboard logic
* **auth:** rename DataSource interfaces to `Db` suffix convention; introduce `ProfileUpsertUseCase`
* **routing:** add root redirect and use-case-driven onboarding check
* **utils:** relocate presentation utilities; remove stale dead code

## [2.1.0](https://github.com/handharr-labs/xpnsio/compare/v2.0.2...v2.1.0) (2026-03-27)

### Bug Fixes

* **dashboard:** treat period-end date as exclusive — starter date (e.g. the 27th) now belongs to the next budget period, so the dashboard auto-advances to the correct period on first load instead of staying on the ending period
* **dashboard:** fix inflated "This Week" budget for past periods — replaced cumulative rollover formula with a standalone last-7-days window against a single weekly budget; also caps `accumulatedWeeklyBudget` at the total period budget for weekly categories
* **dashboard:** show "Last Week" and "Last Day" labels on past-period category cards — weekly card now receives `isCurrentPeriod` and toggles between "This Week" / "Last Week" (mirrors the existing "Today" / "Last Day" pattern on the daily card)
* **dashboard:** eliminate red-to-green flash when returning from new transaction — stale load responses are discarded via a monotonic load ID, fixing a React StrictMode double-invoke race that briefly rendered the previous period's data

## [2.0.2](https://github.com/handharr-labs/xpnsio/compare/v2.0.1...v2.0.2) (2026-03-23)

### Features

* **dashboard:** replace monthly grid with weekly grid in daily category card — shows "This Week" remaining budget instead of "Monthly" for a cleaner Today → Week → Month hierarchy

### Bug Fixes

* **transactions:** prevent date input from overflowing its container on mobile — add `overflow-hidden` to wrapper and `min-w-0` to input
* **ui:** prevent iOS Safari from zooming on input focus — set `font-size: 16px` on all inputs for screens up to 1024px (phones and iPads)

## [2.0.1](https://github.com/handharr-labs/xpnsio/compare/v2.0.0...v2.0.1) (2026-03-22)

### Bug Fixes

* **budget-settings:** prevent keyboard dismissal on Android when typing — replace `type="number"` with `type="text" inputMode="numeric"` on starter day inputs; use stable `crypto.randomUUID()` keys for category list items instead of array index

## [2.0.0](https://github.com/handharr-labs/xpnsio/compare/v1.4.0...v2.0.0) (2026-03-22)

### Features

* **theme:** add dark/light mode toggle in Settings using `next-themes`; preference persists across sessions
* **login:** update welcome copy to "Welcome to Xpnsio"; Google button styled dark for always-dark login screen
* **currency:** replace locale-specific compact notation with universal K/M/B suffixes (`formatCompactCurrency`)

### Bug Fixes

* **currency-input:** fix vertical alignment of currency badge; add `overflow-hidden` for smooth rounded corners
* **dashboard:** fix budget overview card text visibility — semantic tokens replace hardcoded zinc/white colors
* **dashboard:** fix category breakdown progress/status text contrast on light mode (`text-*-600 dark:text-*-300`)
* **dashboard:** align dot indicator color with amount text color in recent transactions section
* **transactions:** fix search bar and filter button colors on light mode
* **transactions/new:** fix all broken colors on light mode in new transaction screen
* **settings:** fix danger zone and sign out button contrast on dark background
* **transaction-detail:** fix delete button contrast

### Refactors

* **shared/utils:** extract `formatRelativeDate` and `formatFullDate` utils to `shared/core/utils/`
* **shared/utils:** extract `getOrdinalSuffix` util to `shared/core/utils/formatOrdinal`
* **categories/utils:** extract `getCategoryIcon` and `ICON_MAP` to `features/categories/presentation/utils/`
* **theme:** migrate all hardcoded `zinc-*`/`white/*` colors to semantic Tailwind tokens for light mode support
* **theme:** remove hardcoded `className="dark"` from root layout; `ThemeProvider` manages theme class on `<html>`
* **login:** retain always-dark via `bg-zinc-950 dark` on login container (independent of global theme)

## [1.4.0](https://github.com/handharr-labs/xpnsio/compare/v1.3.2...v1.4.0) (2026-03-21)

### Refactors

* **shared/atoms:** move `CurrencyInput` to `common/atoms/`, add `CategoryColorDot` atom ([32cf2c5](https://github.com/handharr-labs/xpnsio/commit/32cf2c5))
* **shared/molecules:** add `MonthNavigator` molecule ([b20a678](https://github.com/handharr-labs/xpnsio/commit/b20a678))
* **shared/organisms:** move `BottomNav` to `common/organisms/` ([96d41e6](https://github.com/handharr-labs/xpnsio/commit/96d41e6))
* **dashboard:** extract `BudgetOverviewCard`, `CategoryBreakdownSection`, `RecentTransactionsSection` organisms ([ad3b15b](https://github.com/handharr-labs/xpnsio/commit/ad3b15b))
* **transactions:** extract `TransactionFilterPanel`, `TransactionListSection` organisms ([acfebff](https://github.com/handharr-labs/xpnsio/commit/acfebff))
* **categories:** extract `CategoryFormDialog`, `CategoryGroupSection` organisms ([15bac0d](https://github.com/handharr-labs/xpnsio/commit/15bac0d))
* **budget-settings:** extract `BudgetSettingCard` organism ([f9d1c1b](https://github.com/handharr-labs/xpnsio/commit/f9d1c1b))

## [1.3.2](https://github.com/handharr-labs/xpnsio/compare/v0.3.1...v1.3.2) (2026-03-20)

### Features

* **dashboard:** show spent/available breakdown line on budget cards ([f4b29be](https://github.com/handharr-labs/xpnsio/commit/f4b29be))
* **dashboard:** add remaining amount left line below spent/available breakdown ([46364c2](https://github.com/handharr-labs/xpnsio/commit/46364c2))
* **dashboard:** apply color logic to remaining amount text ([c6293b9](https://github.com/handharr-labs/xpnsio/commit/c6293b9))

### Bug Fixes

* **dashboard:** treat zero remaining as "X left" not "Over by X" ([4c66568](https://github.com/handharr-labs/xpnsio/commit/4c66568))
* **dashboard:** restore accumulated budget line above pacing, remove redundant left text ([7cfb61c](https://github.com/handharr-labs/xpnsio/commit/7cfb61c))

## [0.3.1](https://github.com/handharr-labs/xpnsio/compare/v0.3.0...v0.3.1) (2026-03-10)

### Bug Fixes

* **dashboard:** show "Over by Rp X" instead of "-Rp X left" when budget is overrun ([9f29fe1](https://github.com/handharr-labs/xpnsio/commit/9f29fe1))

## [0.3.0](https://github.com/handharr-labs/xpnsio/compare/v0.2.0...v0.3.0) (2026-03-09)

### Features

* **auth:** add account deletion feature with confirmation dialog ([57a6423](https://github.com/handharr-labs/xpnsio/commit/57a64233a6c7d6e5a037cfaaa5e6c18c7d077c0d))
* **budget-settings:** add BudgetProgressService for centralized progress calculations ([93961e8](https://github.com/handharr-labs/xpnsio/commit/93961e8fe28c45e1f5838d24f01432577003c81a))

## [0.2.0](https://github.com/handharr-labs/xpnsio/compare/v0.1.0...v0.2.0) (2026-03-09)

### Features

* **budget-settings:** add getPeriodBounds for custom budget periods ([6cbc33f](https://github.com/handharr-labs/xpnsio/commit/6cbc33fdbc933158033b0875fd948e9b3b72f0e6))
* **dashboard:** add dual progress bars to daily budget category cards ([76f1340](https://github.com/handharr-labs/xpnsio/commit/76f1340d941a4be3654d8bd82bc4f5f3af5d0c17))
* **dashboard:** add dynamic progress colors (green/yellow/red) and use floor for percent calculation ([84744fc](https://github.com/handharr-labs/xpnsio/commit/84744fcbb9be79cc529cced9b18b01f9dc868ed2))
* **dashboard:** add weekly and monthly text summaries to daily cards ([ee9d91f](https://github.com/handharr-labs/xpnsio/commit/ee9d91f6a30756bf839a41aa6ecba713dceabcbd))
* **dashboard:** add weekly budget badge to daily category cards ([af861ea](https://github.com/handharr-labs/xpnsio/commit/af861eafb0a46dd36ea5cb7f318b7203f45a64d3))
* **dashboard:** add weekly progress bar to daily budget category cards ([a4f6439](https://github.com/handharr-labs/xpnsio/commit/a4f643985182e00b325c3624df22ade1d015a880))
* **dashboard:** use cumulative week budget for weekly progress bar ([9d7a717](https://github.com/handharr-labs/xpnsio/commit/9d7a7170906752de2bbfa1ae5e8478866778e441))
* **dashboard:** use cumulative week budget for weekly summary ([90213a7](https://github.com/handharr-labs/xpnsio/commit/90213a786dd0f6b69072fd4ca4e88f8109e96d65))

### Bug Fixes

* **budgets:** add unique constraint and proper upsert ([caba979](https://github.com/handharr-labs/xpnsio/commit/caba9792c15fd75cace5950610593085bb537a7c))
* **dashboard:** show actual days with week approximation ([629b7a4](https://github.com/handharr-labs/xpnsio/commit/629b7a4226813db4b37cf85720681ec445cf239d))
* resolve all 7 critical architecture violations ([9bccc14](https://github.com/handharr-labs/xpnsio/commit/9bccc147a85b66c2f94e242a86cff108e5e14c9d)), closes [#1](https://github.com/handharr-labs/xpnsio/issues/1) [#2](https://github.com/handharr-labs/xpnsio/issues/2) [#3](https://github.com/handharr-labs/xpnsio/issues/3) [#4](https://github.com/handharr-labs/xpnsio/issues/4) [#5](https://github.com/handharr-labs/xpnsio/issues/5) [#6](https://github.com/handharr-labs/xpnsio/issues/6) [#7](https://github.com/handharr-labs/xpnsio/issues/7)

## [0.1.0](https://github.com/handharr-labs/xpnsio/releases/tag/v0.1.0) (2026-03-09)

### Features

* **auth:** Google OAuth sign-in with Supabase ([fe260db](https://github.com/handharr-labs/xpnsio/commit/fe260db))
* **budgets:** budget CRUD with daily/weekly/monthly master categories ([c6dabd2](https://github.com/handharr-labs/xpnsio/commit/c6dabd2))
* **budget-settings:** budget setting templates with auto-apply ([c6dabd2](https://github.com/handharr-labs/xpnsio/commit/c6dabd2))
* **categories:** category management with master category types ([c6dabd2](https://github.com/handharr-labs/xpnsio/commit/c6dabd2))
* **dashboard:** budget overview with category breakdown and progress tracking ([07c14a6](https://github.com/handharr-labs/xpnsio/commit/07c14a6))
* **pwa:** Progressive Web App setup with manifest and service worker ([e701ddd](https://github.com/handharr-labs/xpnsio/commit/e701ddd))
* **transactions:** transaction CRUD with income/expense types ([c6dabd2](https://github.com/handharr-labs/xpnsio/commit/c6dabd2))
* **ui:** Currency input component with currency selector ([9dea1c8](https://github.com/handharr-labs/xpnsio/commit/9dea1c8))

### Bug Fixes

* use ESM export default in next.config.ts to fix Vercel 404 ([25f61be](https://github.com/handharr-labs/xpnsio/commit/25f61be))
* allow any amount value in transaction forms by setting step=any ([2d6d5c1](https://github.com/handharr-labs/xpnsio/commit/2d6d5c1))
* add turbopack config to resolve next-pwa webpack conflict ([996e229](https://github.com/handharr-labs/xpnsio/commit/996e229))

### Features

* **auth:** add account deletion feature with confirmation dialog ([57a6423](https://github.com/handharr-labs/xpnsio/commit/57a64233a6c7d6e5a037cfaaa5e6c18c7d077c0d))
* **budget-settings:** add BudgetProgressService for centralized progress calculations ([93961e8](https://github.com/handharr-labs/xpnsio/commit/93961e8fe28c45e1f5838d24f01432577003c81a))

## [0.2.0](https://github.com/handharr-labs/xpnsio/compare/v0.1.0...v0.2.0) (2026-03-09)

### Features

* **budget-settings:** add getPeriodBounds for custom budget periods ([6cbc33f](https://github.com/handharr-labs/xpnsio/commit/6cbc33fdbc933158033b0875fd948e9b3b72f0e6))
* **dashboard:** add dual progress bars to daily budget category cards ([76f1340](https://github.com/handharr-labs/xpnsio/commit/76f1340d941a4be3654d8bd82bc4f5f3af5d0c17))
* **dashboard:** add dynamic progress colors (green/yellow/red) and use floor for percent calculation ([84744fc](https://github.com/handharr-labs/xpnsio/commit/84744fcbb9be79cc529cced9b18b01f9dc868ed2))
* **dashboard:** add weekly and monthly text summaries to daily cards ([ee9d91f](https://github.com/handharr-labs/xpnsio/commit/ee9d91f6a30756bf839a41aa6ecba713dceabcbd))
* **dashboard:** add weekly budget badge to daily category cards ([af861ea](https://github.com/handharr-labs/xpnsio/commit/af861eafb0a46dd36ea5cb7f318b7203f45a64d3))
* **dashboard:** add weekly progress bar to daily budget category cards ([a4f6439](https://github.com/handharr-labs/xpnsio/commit/a4f643985182e00b325c3624df22ade1d015a880))
* **dashboard:** use cumulative week budget for weekly progress bar ([9d7a717](https://github.com/handharr-labs/xpnsio/commit/9d7a7170906752de2bbfa1ae5e8478866778e441))
* **dashboard:** use cumulative week budget for weekly summary ([90213a7](https://github.com/handharr-labs/xpnsio/commit/90213a786dd0f6b69072fd4ca4e88f8109e96d65))

### Bug Fixes

* **budgets:** add unique constraint and proper upsert ([caba979](https://github.com/handharr-labs/xpnsio/commit/caba9792c15fd75cace5950610593085bb537a7c))
* **dashboard:** show actual days with week approximation ([629b7a4](https://github.com/handharr-labs/xpnsio/commit/629b7a4226813db4b37cf85720681ec445cf239d))
* resolve all 7 critical architecture violations ([9bccc14](https://github.com/handharr-labs/xpnsio/commit/9bccc147a85b66c2f94e242a86cff108e5e14c9d)), closes [#1](https://github.com/handharr-labs/xpnsio/issues/1) [#2](https://github.com/handharr-labs/xpnsio/issues/2) [#3](https://github.com/handharr-labs/xpnsio/issues/3) [#4](https://github.com/handharr-labs/xpnsio/issues/4) [#5](https://github.com/handharr-labs/xpnsio/issues/5) [#6](https://github.com/handharr-labs/xpnsio/issues/6) [#7](https://github.com/handharr-labs/xpnsio/issues/7)

All notable changes to this project will be documented in this file.

This file is auto-generated by [release-it](https://github.com/release-it/release-it) using [conventional commits](https://www.conventionalcommits.org/).
