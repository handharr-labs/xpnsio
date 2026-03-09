# Changelog

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
