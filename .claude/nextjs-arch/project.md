## 12. Project Structure

### 12.1 Feature-Based Layout

```
src/
├── app/                                    # Next.js App Router
│   ├── layout.tsx                          # Root layout (providers, fonts)
│   ├── page.tsx                            # Home page
│   ├── error.tsx                           # Root error boundary
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── callback/
│   │       └── route.ts
│   └── (main)/
│       ├── layout.tsx                      # Main layout with bottom nav
│       ├── dashboard/
│       │   └── page.tsx
│       ├── transactions/
│       │   ├── page.tsx
│       │   ├── [id]/
│       │   │   └── page.tsx
│       │   └── new/
│       │       └── page.tsx
│       ├── categories/
│       │   └── page.tsx
│       ├── budget-settings/
│       │   ├── page.tsx
│       │   ├── new/
│       │   │   └── page.tsx
│       │   └── [id]/
│       │       └── edit/
│       │           └── page.tsx
│       ├── settings/
│       │   └── page.tsx
│       └── setup/
│           └── page.tsx
│
├── features/                               # Feature-based organization
│   ├── auth/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── User.ts
│   │   │   ├── repositories/
│   │   │   │   └── AuthRepository.ts
│   │   │   └── use-cases/
│   │   │       ├── SignInWithGoogleUseCase.ts
│   │   │       ├── SignOutUseCase.ts
│   │   │       └── GetCurrentUserUseCase.ts
│   │   ├── data/
│   │   │   ├── data-sources/
│   │   │   │   └── AuthDataSource.ts
│   │   │   └── repositories/
│   │   │       └── AuthRepositoryImpl.ts
│   │   └── presentation/
│   │       ├── LoginView.tsx
│   │       └── useLoginViewModel.ts
│   │
│   ├── transactions/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── Transaction.ts
│   │   │   ├── repositories/
│   │   │   │   └── TransactionRepository.ts
│   │   │   └── use-cases/
│   │   │       ├── GetTransactionsUseCase.ts
│   │   │       ├── CreateTransactionUseCase.ts
│   │   │       ├── UpdateTransactionUseCase.ts
│   │   │       └── DeleteTransactionUseCase.ts
│   │   ├── data/
│   │   │   ├── data-sources/
│   │   │   │   └── TransactionDataSource.ts
│   │   │   └── repositories/
│   │   │       └── TransactionRepositoryImpl.ts
│   │   └── presentation/
│   │       ├── actions/
│   │       │   └── transactions.ts       # Server actions
│   │       ├── TransactionsView.tsx
│   │       ├── TransactionDetailView.tsx
│   │       ├── TransactionNewView.tsx
│   │       ├── useTransactionsViewModel.ts
│   │       ├── useTransactionDetailViewModel.ts
│   │       └── useTransactionNewViewModel.ts
│   │
│   ├── categories/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── Category.ts
│   │   │   ├── repositories/
│   │   │   │   └── CategoryRepository.ts
│   │   │   └── use-cases/
│   │   │       ├── GetCategoriesUseCase.ts
│   │   │       ├── CreateCategoryUseCase.ts
│   │   │       ├── UpdateCategoryUseCase.ts
│   │   │       └── DeleteCategoryUseCase.ts
│   │   ├── data/
│   │   │   ├── data-sources/
│   │   │   │   └── CategoryDataSource.ts
│   │   │   └── repositories/
│   │   │       └── CategoryRepositoryImpl.ts
│   │   └── presentation/
│   │       ├── actions/
│   │       │   └── categories.ts
│   │       ├── CategoriesView.tsx
│   │       └── useCategoriesViewModel.ts
│   │
│   ├── budget-settings/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── Budget.ts
│   │   │   │   └── BudgetSetting.ts
│   │   │   ├── repositories/
│   │   │   │   ├── BudgetRepository.ts
│   │   │   │   └── BudgetSettingRepository.ts
│   │   │   ├── services/
│   │   │   │   └── BudgetComputationService.ts
│   │   │   └── use-cases/
│   │   │       ├── GetBudgetSettingsUseCase.ts
│   │   │       ├── CreateBudgetSettingUseCase.ts
│   │   │       ├── UpdateBudgetSettingUseCase.ts
│   │   │       ├── ApplyBudgetSettingUseCase.ts
│   │   │       └── DeleteBudgetSettingUseCase.ts
│   │   ├── data/
│   │   │   ├── data-sources/
│   │   │   │   ├── BudgetDataSource.ts
│   │   │   │   └── BudgetSettingDataSource.ts
│   │   │   └── repositories/
│   │   │       ├── BudgetRepositoryImpl.ts
│   │   │       └── BudgetSettingRepositoryImpl.ts
│   │   └── presentation/
│   │       ├── actions/
│   │       │   └── budget-settings.ts
│   │       ├── BudgetSettingsView.tsx
│   │       ├── BudgetSettingNewView.tsx
│   │       ├── BudgetSettingEditView.tsx
│   │       ├── useBudgetSettingsViewModel.ts
│   │       ├── useBudgetSettingNewViewModel.ts
│   │       └── useBudgetSettingEditViewModel.ts
│   │
│   └── dashboard/
│       ├── domain/
│       │   ├── services/
│       │   │   └── BudgetProgressService.ts   # dashboard-specific domain service
│       │   └── use-cases/
│       │       └── GetDashboardDataUseCase.ts
│       └── presentation/
│           ├── actions/
│           │   └── dashboard.ts
│           ├── DashboardView.tsx
│           └── useDashboardViewModel.ts
│
├── shared/                                # Cross-cutting concerns
│   ├── domain/
│   │   ├── entities/
│   │   │   └── PaginatedResult.ts         # Shared across features
│   │   └── errors/
│   │       ├── DomainError.ts
│   │       └── errorMessages.ts
│   ├── presentation/
│   │   ├── navigation/
│   │   │   ├── routes.ts                   # Route constants
│   │   │   └── useAppRouter.ts
│   │   └── common/
│   │       ├── QueryState.ts
│   │       ├── LoadingView.tsx
│   │       ├── ErrorView.tsx
│   │       ├── EmptyStateView.tsx
│   │       └── CurrencyInput.tsx
│   └── core/                              # Infrastructure (no framework deps)
│       ├── logger/
│       │   └── Logger.ts
│       └── utils/
│           └── nullSafety.ts
│
├── di/                                   # Dependency Injection
│   ├── container.server.ts                # Server-side singletons
│   ├── container.client.ts                # Client-side factory
│   └── DIContext.tsx                      # React Context provider
│
├── lib/                                  # Framework-specific (Next.js, Supabase)
│   ├── db.ts                              # Drizzle instance
│   ├── auth.ts                            # Supabase server client
│   ├── schema.ts                          # Drizzle schema
│   └── safe-action.ts                     # Action client
│
└── __tests__/                             # Tests (mirrors feature structure)
    └── features/
        ├── auth/
        │   ├── domain/
        │   └── data/
        └── transactions/
            └── ...
```

### 12.2 Feature Module Structure

Every feature module is self-contained with its own layers:

```
features/[feature-name]/
├── domain/                              # Business logic (no framework deps)
│   ├── entities/                         # Domain models
│   │   └── [Entity].ts
│   ├── repositories/                     # Repository interfaces
│   │   └── [Feature]Repository.ts
│   ├── services/                          # (optional) Pure business logic
│   │   └── [Feature][Service].ts
│   └── use-cases/                         # Application logic
│       └── [Verb][Feature]UseCase.ts
├── data/                                # Data access (impl + external APIs)
│   ├── data-sources/
│   │   └── [Feature]DataSource.ts        # Interface + Impl
│   └── repositories/
│       └── [Feature]RepositoryImpl.ts   # Implements interface
└── presentation/                         # UI layer (React/Next.js)
    ├── actions/
    │   └── [feature].ts                # Server actions
    ├── [Feature]View.tsx                # Main view component
    ├── use[Feature]ViewModel.ts         # Orchestration hook
    └── components/                       # (optional) Feature-specific UI
        └── [Component].tsx
```

**Key principles:**
- Features are independent and co-located
- Each feature contains its complete vertical slice
- Shared domain logic goes in `shared/domain/`
- Shared UI components go in `shared/presentation/`
- No circular dependencies between features
- Import rule: `feature/domain` → `feature/data` → `feature/presentation`
- Services belong to the feature that owns the concept; move to `shared/` when consumed by ≥2 features

---

## 13. Conventions & Naming

### 13.1 File & Type Naming

| Component | Pattern | Example |
|-----------|---------|---------|
| Entity | `[Name].ts` | `Employee.ts`, `Department.ts` |
| DTO | `[Name]DTO.ts` | `EmployeeDTO.ts` |
| Repository Interface | `[Feature]Repository.ts` | `EmployeeRepository.ts` |
| Repository Impl | `[Feature]RepositoryImpl.ts` | `EmployeeRepositoryImpl.ts` |
| DataSource Interface | `[Feature][Source]DataSource.ts` | `EmployeeRemoteDataSource.ts` |
| DataSource Impl | `[Feature][Source]DataSourceImpl.ts` | `EmployeeRemoteDataSourceImpl.ts` |
| UseCase Interface | `[Verb][Feature]UseCase.ts` | `GetEmployeeUseCase.ts` |
| UseCase Params | `[Verb][Feature]UseCaseParams` | `GetEmployeesUseCaseParams` |
| UseCase Payload | `[Verb][Feature]UseCasePayload` | `UpdateEmployeeUseCasePayload` |
| Service Interface | `[Feature][Noun].ts` | `LeaveBalanceCalculator.ts` |
| Service Impl class | `[Feature][Noun]Service` | `LeaveBalanceCalculatorService` |
| ViewModel Hook | `use[Feature]ViewModel.ts` | `useEmployeeListViewModel.ts` |
| View Component | `[Feature]View.tsx` | `EmployeeListView.tsx` |
| Mapper Interface | `[Name]Mapper.ts` | `EmployeeMapper.ts` |
| Mapper Impl class | `[Name]MapperImpl` | `EmployeeMapperImpl` |
| Route constant | `ROUTES.[feature]` | `ROUTES.employeeDetail(id)` |
| Feature folder | `kebab-case/` | `employee-list/`, `leave-request/` |

### 13.2 Code Conventions

| Convention | Rule |
|------------|------|
| Exported state from hooks | Always readonly — hooks expose state, not setters |
| Async methods | Always return `Promise<T>`, never use callbacks |
| Interfaces | Use for all layer boundaries (repositories, use cases, mappers, services) |
| Error handling | `try/catch` in Repository; TanStack Query catches in hooks; error boundaries for UI |
| Naming | `camelCase` for functions/variables, `PascalCase` for types/classes/interfaces |
| Barrel exports | Use `index.ts` per folder only for public-facing packages — avoid in `src/` |
| React Server Components | Default for pages; add `'use client'` only when hooks/interactivity are needed |
| Services | Always pure — no DOM APIs, no async, no I/O |

### 13.3 Feature Module Structure

Every feature follows this pattern:

```
features/[feature-name]/
├── [FeatureName]View.tsx            # React component (dumb renderer)
├── use[FeatureName]ViewModel.ts     # Custom hook (orchestration)
└── components/                      # Feature-specific sub-components (optional)
    └── [ComponentName].tsx
```

---

## 14. Design Decisions & Rationale

### 14.1 TanStack Query Over Custom Fetch Logic

| TanStack Query | Custom async state |
|----------------|-------------------|
| Automatic caching, background refetch, deduplication | Must implement manually |
| Built-in `isLoading`, `isError`, `data` states | Custom `QueryState` enum required everywhere |
| `invalidateQueries` for cache invalidation | Manual state updates after mutations |
| Stale-while-revalidate out of the box | Manual refresh timing |
| Optimistic updates built-in | Complex manual implementation |

**Trade-off:** Adds a dependency. For purely server-rendered apps (RSC), prefer `fetch` directly in Server Components. TanStack Query shines for client-side interactive data.

### 14.2 Custom Hooks as ViewModels Over Class-Based VMs

| Custom Hook | Class-based ViewModel |
|-------------|----------------------|
| React-idiomatic — no framework fighting | Unfamiliar in React ecosystem |
| Automatically re-renders on state change | Requires MobX / RxJS for reactivity |
| Composable — hooks call other hooks | Inheritance-based, coupling risk |
| Easy to test with `renderHook` | Requires React wrapper to test reactivity |
| No memory leak concerns — React manages lifecycle | Must manually unsubscribe observables |

**Trade-off:** Business logic is tied to React's hook rules (`use*` prefix, can't call outside components). For shared, framework-agnostic logic, keep it in Domain Services instead.

### 14.3 Next.js App Router Over Pages Router

| App Router (Next.js 13+) | Pages Router |
|--------------------------|--------------|
| React Server Components — smaller client bundles | Everything client-rendered by default |
| Nested layouts — persistent UI elements | `_app.tsx` workarounds for persistence |
| Streaming + Suspense native support | Limited streaming |
| `loading.tsx`, `error.tsx`, `not-found.tsx` conventions | Manual loading/error states |
| Server Actions for form mutations | API routes + `fetch` for mutations |

**Trade-off:** App Router has a steeper learning curve. Server Components cannot use hooks or browser APIs. Plan your `'use client'` boundary carefully.

### 14.4 No Base Hook / No Shared State Logic Inheritance

React hooks cannot be subclassed or inherited. This kit avoids the temptation to create a `useBaseViewModel` hook with shared logic because:

- Composition is more flexible than inheritance — use smaller hooks inside larger ones
- `useQuery` / `useMutation` already handle loading/error/data lifecycle
- Shared UI state patterns (loading overlay, error toast) belong in Context or Zustand, not a base hook
- Base abstractions create coupling — each feature evolves independently

**Instead:** Share common behavior through dedicated utility hooks (`useNetworkStatus`, `useFormField`, `useAppRouter`) and compose them per feature.

### 14.5 Services in Domain (Not a Separate Layer)

Services live inside the Domain layer alongside UseCases. They are **not** a separate architectural layer.

| Service | UseCase |
|---------|---------|
| Pure synchronous decisions | May perform async I/O |
| No dependencies on repositories | Depends on repositories |
| Stateless class | Class with injected dependencies |
| Multiple methods | Single `execute()` method |
| Called by UseCases or ViewModel hooks | Called by ViewModel hooks |

**When to extract a Service:**
- **Service:** "Is this request valid?" / "What balance remains?" / "Should we show this UI?"
- **UseCase:** "Fetch from API" / "Persist to database" / "Submit this form"
- **Inline:** Simple 1-3 line conditions — keep them in the UseCase

### 14.6 Server/Client Split DI Over a Single Container

| Split (this kit) | Single React Context container |
|-----------------|-------------------------------|
| Server deps never reach the browser bundle | All deps bundled client-side |
| RSC pages fetch data at server render — no client waterfall | Client must fetch after hydration |
| `server-only` / `client-only` enforce the boundary at compile time | Accidental import silently works but ships to client |
| Singletons on the server come free from Node.js module cache | Must manage singleton lifetime manually |
| Two small containers, each easy to read | One large container holding everything |

**Why not DI frameworks (InversifyJS, tsyringe)?**

| Manual split DI | DI frameworks |
|-----------------|---------------|
| No decorators, no `reflect-metadata` | Requires `reflect-metadata` + decorators |
| Fully compatible with RSC and Edge runtime | Decorators incompatible with RSC / Edge |
| Compile-time safety — missing dep = type error | Runtime errors for missing registrations |
| Just TypeScript modules and functions | Framework abstractions to learn |

**Trade-off:** Two container files instead of one. For large-scale apps, split further into per-feature containers (see Section 11.5).

### 14.7 Interface-Based Mappers Over Utility Functions

| Interface-based (this kit) | Plain functions |
|---------------------------|----------------|
| Mockable in repository tests — true isolation | Repository tests implicitly test mapper too |
| Injectable — swap strategies at runtime | Fixed at import time |
| Composable via DI (parent injects child mapper) | Import composition is tightly coupled |
| Consistent injectable pattern across codebase | Simpler, less boilerplate |

**Trade-off:** More boilerplate per mapper (interface + class + mock). Worth it for large-scale apps where test isolation matters.

---

## Appendix A: Quick Reference Card

### Adding a New Feature

1. **Define entities** in `domain/entities/`
2. **Define repository interface** in `domain/repositories/`
3. **Create use case** in `domain/use-cases/[feature]/`
4. **Create DTO** in `data/dtos/`
5. **Create mapper** in `data/mappers/`
6. **Implement data source** in `data/data-sources/`
7. **Implement repository** in `data/repositories/`
8. **(If needed) Create Service** in `domain/services/`
9. **Create ViewModel hook** in `presentation/features/[feature]/`
10. **Create View component** in `presentation/features/[feature]/`
11. **Add route constant** to `presentation/navigation/routes.ts`
12. **Add page file** in `app/[route]/page.tsx`
13. **Wire in container** — add to `container.server.ts` (RSC) and/or `container.client.ts` (interactive)
14. **Write tests** — Service tests first, then ViewModel hook, then Repository

### Layer Import Rules

| Layer | Can Import |
|-------|-----------|
| Domain | Nothing (no framework imports) |
| Data | Domain, Node.js built-ins |
| Presentation | React, Next.js, Domain |
| Core | No framework imports (pure TypeScript) |
| `container.server.ts` | Data, Domain, Core — never React |
| `container.client.ts` | Data, Domain, Core — never `server-only` modules |
| `DIContext.tsx` | `container.client.ts` only |
| App — Server page | `container.server.ts`, Presentation |
| App — Client page | `useDI()` hook via `DIContext` |

### Data Flow (Complete)

**Server path (initial page load — RSC):**
```
Browser requests page
  → Server Component page imports UseCase from container.server.ts
  → UseCase.execute() runs on the server
  → UseCase calls Repository → DataSource → API
  → DataSource returns DTO → Repository maps to Entity
  → UseCase returns Entity to page
  → Page passes initialData prop to Client Component
  → TanStack Query cache seeded — no client waterfall
  → HTML streamed to browser
```

**Client path (user interaction):**
```
User clicks button
  → Client Component calls hook action (e.g., handleSubmit)
  → ViewModel hook builds UseCase params (with payload if write operation)
  → ViewModel hook calls UseCase.execute(params) from useDI() container
  → UseCase validates via Domain Service if needed (sync, pure)
  → UseCase calls Repository (async)
  → Repository calls DataSource → Axios → API
  → DataSource returns DTO → Repository maps to Entity via Mapper
  → Repository handles errors via ErrorMapper → DomainError
  → UseCase returns Entity
  → TanStack Query updates state
  → React re-renders component
```

---

