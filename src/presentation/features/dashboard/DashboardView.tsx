'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDI } from '@/di/DIContext';
import { useDashboardViewModel } from './useDashboardViewModel';
import { ROUTES } from '@/presentation/navigation/routes';

const formatIDR = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MASTER_LABELS: Record<string, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

export function DashboardView() {
  const { signOutUseCase } = useDI();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const now = new Date();
  const { dashboardData, isLoading, error, refresh } = useDashboardViewModel(
    now.getFullYear(),
    now.getMonth() + 1
  );

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOutUseCase.execute();
    router.push(ROUTES.login);
  };

  const monthLabel = dashboardData
    ? `${MONTH_NAMES[dashboardData.month - 1]} ${dashboardData.year}`
    : `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <main className="min-h-screen p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-sm">{monthLabel}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(ROUTES.settings)}
            >
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : !dashboardData?.activeBudgetSetting ? (
          /* No budget CTA */
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <p className="text-lg font-medium">No budget set for this month</p>
              <p className="text-muted-foreground text-sm">
                Set up a budget to track your spending.
              </p>
              <Button onClick={() => router.push(ROUTES.setup)}>
                Set Up Budget
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Summary card */}
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>{dashboardData.activeBudgetSetting.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="text-sm font-semibold">{formatIDR(dashboardData.totalBudget)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Spent</p>
                    <p className="text-sm font-semibold text-red-600">
                      {formatIDR(dashboardData.totalExpense)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Remaining</p>
                    <p
                      className={`text-sm font-semibold ${
                        dashboardData.remaining < 0 ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {formatIDR(dashboardData.remaining)}
                    </p>
                  </div>
                </div>

                {dashboardData.totalBudget > 0 && (
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        dashboardData.totalExpense / dashboardData.totalBudget > 0.9
                          ? 'bg-red-500'
                          : 'bg-primary'
                      }`}
                      style={{
                        width: `${Math.min(
                          (dashboardData.totalExpense / dashboardData.totalBudget) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                )}

                {dashboardData.totalIncome > 0 && (
                  <p className="text-xs text-muted-foreground text-right">
                    Income this month: {formatIDR(dashboardData.totalIncome)}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Category breakdown */}
            {dashboardData.categorySpending.filter((cs) => cs.budgetAmount > 0).length > 0 && (
              <div className="space-y-3">
                <h2 className="text-base font-semibold">By Category</h2>
                {(['daily', 'weekly', 'monthly'] as const).map((period) => {
                  const items = dashboardData.categorySpending.filter(
                    (cs) =>
                      cs.category.masterCategory === period && cs.budgetAmount > 0
                  );
                  if (items.length === 0) return null;
                  return (
                    <div key={period}>
                      <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
                        {MASTER_LABELS[period]}
                      </p>
                      <div className="space-y-2">
                        {items.map((cs) => (
                          <Card key={cs.category.id} size="sm">
                            <CardContent className="pt-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: cs.category.color }}
                                  />
                                  <span className="text-sm font-medium">{cs.category.name}</span>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-muted-foreground">
                                    {formatIDR(cs.spent)} / {formatIDR(cs.budgetAmount)}
                                  </p>
                                  <p
                                    className={`text-xs font-medium ${
                                      cs.remaining < 0 ? 'text-red-600' : 'text-green-600'
                                    }`}
                                  >
                                    {cs.remaining < 0 ? 'Over by ' : ''}
                                    {formatIDR(Math.abs(cs.remaining))} left
                                  </p>
                                </div>
                              </div>
                              <div className="w-full bg-muted rounded-full h-1.5">
                                <div
                                  className={`h-1.5 rounded-full ${
                                    cs.budgetAmount > 0 &&
                                    cs.spent / cs.budgetAmount > 0.9
                                      ? 'bg-red-500'
                                      : 'bg-primary'
                                  }`}
                                  style={{
                                    width: `${
                                      cs.budgetAmount > 0
                                        ? Math.min((cs.spent / cs.budgetAmount) * 100, 100)
                                        : 0
                                    }%`,
                                  }}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Recent transactions */}
            {dashboardData.recentTransactions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold">Recent Transactions</h2>
                  <button
                    className="text-sm text-primary hover:underline"
                    onClick={() => router.push(ROUTES.transactions)}
                  >
                    View all
                  </button>
                </div>
                <div className="space-y-2">
                  {dashboardData.recentTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 cursor-pointer"
                      onClick={() => router.push(ROUTES.transactionDetail(tx.id))}
                    >
                      <div className="flex items-center gap-3">
                        {tx.category && (
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: tx.category.color }}
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            {tx.category?.name ?? (tx.type === 'income' ? 'Income' : 'Expense')}
                          </p>
                          {tx.description && (
                            <p className="text-xs text-muted-foreground">{tx.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-semibold ${
                            tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {tx.type === 'income' ? '+' : '-'}{formatIDR(parseFloat(tx.amount))}
                        </p>
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Navigation bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background px-6 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-around">
          <button
            className="flex flex-col items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => router.push(ROUTES.dashboard)}
          >
            <span className="text-lg">🏠</span>
            <span>Dashboard</span>
          </button>
          <button
            className="flex flex-col items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => router.push(ROUTES.transactions)}
          >
            <span className="text-lg">📋</span>
            <span>Transactions</span>
          </button>
          <button
            className="-mt-6 w-14 h-14 rounded-full bg-primary text-primary-foreground text-2xl flex items-center justify-center shadow-lg hover:opacity-90"
            onClick={() => router.push(ROUTES.transactionNew)}
          >
            +
          </button>
          <button
            className="flex flex-col items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => router.push(ROUTES.categories)}
          >
            <span className="text-lg">🏷️</span>
            <span>Categories</span>
          </button>
          <button
            className="flex flex-col items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => router.push(ROUTES.settings)}
          >
            <span className="text-lg">⚙️</span>
            <span>Settings</span>
          </button>
        </div>
      </div>
    </main>
  );
}
