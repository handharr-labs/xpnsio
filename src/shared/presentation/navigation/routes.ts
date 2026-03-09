export const ROUTES = {
  // Auth
  login: '/login',
  authCallback: '/auth/callback',

  // Onboarding
  setup: '/setup',

  // Main
  home: '/',
  dashboard: '/dashboard',
  settings: '/settings',

  // Categories
  categories: '/categories',

  // Budget Settings
  budgetSettings: '/budget-settings',
  budgetSettingNew: '/budget-settings/new',
  budgetSettingEdit: (id: string) => `/budget-settings/${id}/edit`,

  // Transactions
  transactions: '/transactions',
  transactionNew: '/transactions/new',
  transactionDetail: (id: string) => `/transactions/${id}`,
} as const;
