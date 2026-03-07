export const ROUTES = {
  // Auth
  login: '/login',
  authCallback: '/auth/callback',

  // Main
  home: '/',
  dashboard: '/dashboard',
  settings: '/settings',

  // Transactions (add more as features are scaffolded)
  transactions: '/transactions',
  transactionDetail: (id: string) => `/transactions/${id}`,
} as const;
