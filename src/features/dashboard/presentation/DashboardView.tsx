'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDashboardViewModel } from './useDashboardViewModel';
import { ROUTES } from '@/shared/presentation/navigation/routes';

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
  const router = useRouter();

  const now = new Date();
  const { dashboardData, isLoading, error } = useDashboardViewModel(
    now.getFullYear(),
    now.getMonth() + 1
  );

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
        ) : !dashboardData?.hasActiveBudget ? (
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
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="text-sm font-semibold">{formatIDR(dashboardData.totalMonthlyBudget)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Spent</p>
                    <p className="text-sm font-semibold text-red-600">
                      {formatIDR(dashboardData.totalSpent)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Remaining</p>
                    <p
                      className={`text-sm font-semibold ${
                        dashboardData.totalRemaining < 0 ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {formatIDR(dashboardData.totalRemaining)}
                    </p>
                  </div>
                </div>

                {dashboardData.totalMonthlyBudget > 0 && (
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        dashboardData.totalSpent / dashboardData.totalMonthlyBudget > 0.9
                          ? 'bg-red-500'
                          : 'bg-primary'
                      }`}
                      style={{
                        width: `${Math.min(
                          (dashboardData.totalSpent / dashboardData.totalMonthlyBudget) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Category breakdown */}
            {dashboardData.categories.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-base font-semibold">By Category</h2>
                {(['daily', 'weekly', 'monthly'] as const).map((period) => {
                  const items = dashboardData.categories.filter(
                    (c) => c.masterCategory === period
                  );
                  if (items.length === 0) return null;
                  return (
                    <div key={period}>
                      <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
                        {MASTER_LABELS[period]}
                      </p>
                      <div className="space-y-2">
                        {items.map((c) => {
                          const isDaily = c.masterCategory === 'daily' && c.dailyBudget != null && c.accumulatedBudgetToDate != null;
                          if (isDaily) {
                            const accumulated = c.accumulatedBudgetToDate!;
                            const dailyLeft = accumulated - c.totalSpent;
                            const isOverrun = dailyLeft <= 0;
                            return (
                              <Card key={c.categoryId} size="sm">
                                <CardContent className="pt-3">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium">{c.categoryName}</span>
                                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                                      {formatIDR(c.dailyBudget!)}/day
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mb-1">
                                    {formatIDR(c.totalSpent)} / {formatIDR(accumulated)} ({c.periodDaysElapsed} days)
                                  </p>
                                  <p className={`text-xs font-medium mb-2 ${isOverrun ? 'text-red-600' : 'text-green-600'}`}>
                                    {isOverrun
                                      ? `Over by ${formatIDR(Math.abs(dailyLeft))}`
                                      : `${formatIDR(dailyLeft)} left`}
                                  </p>
                                  <div className="space-y-2">
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Daily</span>
                                        <span>{accumulated > 0 ? Math.round((c.totalSpent / accumulated) * 100) : 0}%</span>
                                      </div>
                                      <div className="w-full bg-muted rounded-full h-1.5">
                                        <div
                                          className={`h-1.5 rounded-full ${isOverrun ? 'bg-red-500' : 'bg-primary'}`}
                                          style={{ width: `${accumulated > 0 ? Math.min((c.totalSpent / accumulated) * 100, 100) : 0}%` }}
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Weekly</span>
                                        <span>{accumulated > 0 ? Math.round((c.totalSpent / accumulated) * 100) : 0}%</span>
                                      </div>
                                      <div className="w-full bg-muted rounded-full h-1.5">
                                        <div
                                          className={`h-1.5 rounded-full ${isOverrun ? 'bg-red-500' : 'bg-primary'}`}
                                          style={{ width: `${accumulated > 0 ? Math.min((c.totalSpent / accumulated) * 100, 100) : 0}%` }}
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Monthly</span>
                                        <span>{c.monthlyBudget > 0 ? Math.round((c.totalSpent / c.monthlyBudget) * 100) : 0}%</span>
                                      </div>
                                      <div className="w-full bg-muted rounded-full h-1.5">
                                        <div
                                          className={`h-1.5 rounded-full ${c.totalSpent > c.monthlyBudget ? 'bg-red-500' : 'bg-primary'}`}
                                          style={{ width: `${c.monthlyBudget > 0 ? Math.min((c.totalSpent / c.monthlyBudget) * 100, 100) : 0}%` }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          }
                          return (
                          <Card key={c.categoryId} size="sm">
                            <CardContent className="pt-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">{c.categoryName}</span>
                                <div className="text-right">
                                  <p className="text-xs text-muted-foreground">
                                    {formatIDR(c.totalSpent)} / {formatIDR(c.monthlyBudget)}
                                  </p>
                                  <p
                                    className={`text-xs font-medium ${
                                      c.remaining < 0 ? 'text-red-600' : 'text-green-600'
                                    }`}
                                  >
                                    {c.remaining < 0 ? 'Over by ' : ''}
                                    {formatIDR(Math.abs(c.remaining))} left
                                  </p>
                                </div>
                              </div>
                              <div className="w-full bg-muted rounded-full h-1.5">
                                <div
                                  className={`h-1.5 rounded-full ${
                                    c.monthlyBudget > 0 &&
                                    c.totalSpent / c.monthlyBudget > 0.9
                                      ? 'bg-red-500'
                                      : 'bg-primary'
                                  }`}
                                  style={{
                                    width: `${
                                      c.monthlyBudget > 0
                                        ? Math.min((c.totalSpent / c.monthlyBudget) * 100, 100)
                                        : 0
                                    }%`,
                                  }}
                                />
                              </div>
                            </CardContent>
                          </Card>
                          );
                        })}
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
                      <div>
                        <p className="text-sm font-medium">
                          {tx.categoryName ?? (tx.type === 'income' ? 'Income' : 'Expense')}
                        </p>
                        {tx.description && (
                          <p className="text-xs text-muted-foreground">{tx.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-semibold ${
                            tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {tx.type === 'income' ? '+' : '-'}{formatIDR(tx.amount)}
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

    </main>
  );
}
