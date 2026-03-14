'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDashboardViewModel } from './useDashboardViewModel';
import { usePullToRefresh } from '@/shared/presentation/hooks/usePullToRefresh';
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
  const [selectedPeriod, setSelectedPeriod] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });

  const { dashboardData, isLoading, error, refresh } = useDashboardViewModel(
    selectedPeriod.year,
    selectedPeriod.month
  );

  const { containerRef, pullDistance, isRefreshing } = usePullToRefresh(refresh);

  const isCurrentMonth =
    selectedPeriod.year === now.getFullYear() &&
    selectedPeriod.month === now.getMonth() + 1;

  const monthLabel = `${MONTH_NAMES[selectedPeriod.month - 1]} ${selectedPeriod.year}`;

  const goToPrevMonth = () => setSelectedPeriod(({ year, month }) => {
    if (month === 1) return { year: year - 1, month: 12 };
    return { year, month: month - 1 };
  });

  const goToNextMonth = () => setSelectedPeriod(({ year, month }) => {
    if (month === 12) return { year: year + 1, month: 1 };
    return { year, month: month + 1 };
  });

  return (
    <main
      ref={containerRef as React.RefObject<HTMLElement>}
      className="min-h-screen p-6 pb-24 overscroll-none"
    >
      {(pullDistance > 0 || isRefreshing) && (
        <div
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground pb-2 transition-all"
          style={{ height: isRefreshing ? 40 : pullDistance }}
        >
          <span className={isRefreshing ? 'animate-spin' : ''}>↻</span>
          <span>{isRefreshing ? 'Refreshing…' : 'Release to refresh'}</span>
        </div>
      )}
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={goToPrevMonth} className="p-1 rounded hover:bg-muted">‹</button>
            <span className="text-sm text-muted-foreground w-32 text-center">{monthLabel}</span>
            <button onClick={goToNextMonth} disabled={isCurrentMonth} className="p-1 rounded hover:bg-muted disabled:opacity-30">›</button>
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
              <p className="text-lg font-medium">No budget for this period</p>
              {isCurrentMonth ? (
                <>
                  <p className="text-muted-foreground text-sm">Set up a budget to track your spending.</p>
                  <Button onClick={() => router.push(ROUTES.setup)}>Set Up Budget</Button>
                </>
              ) : (
                <p className="text-muted-foreground text-sm">No budget was applied for this month.</p>
              )}
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
                      className="h-2 rounded-full transition-all bg-blue-500"
                      style={{ width: `${Math.min(Math.floor((dashboardData.totalSpent / dashboardData.totalMonthlyBudget) * 100), 100)}%` }}
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
                          const isWeekly = c.masterCategory === 'weekly' && c.weeklyBudget != null && c.accumulatedWeeklyBudget != null;
                          if (isDaily) {
                            const dailyProgress = c.dailyProgress!;
                            const weeklyProgress = c.weeklyProgress!;
                            const monthlyProgress = c.monthlyProgress!;
                            const weekNumber = Math.ceil((c.periodDaysElapsed ?? 0) / 7);
                            const accumulated = c.accumulatedBudgetToDate!;
                            return (
                              <Card key={c.categoryId} size="sm">
                                <CardContent className="pt-3">
                                  <div className="flex items-center justify-between mb-1 gap-2">
                                    <span className="text-sm font-medium">{c.categoryName}</span>
                                    <div className="flex gap-1.5">
                                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground whitespace-nowrap">
                                        {formatIDR(c.dailyBudget!)}/day
                                      </span>
                                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground whitespace-nowrap">
                                        {formatIDR(c.dailyBudget! * 7)}/week
                                      </span>
                                    </div>
                                  </div>
                                  <div className="divide-y divide-border">
                                    {/* Daily */}
                                    <div className="space-y-1 pb-3">
                                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Daily</p>
                                      <p className="text-xs text-muted-foreground">
                                        Daily: {formatIDR(c.totalSpent)} / {formatIDR(accumulated)} ({c.periodDaysElapsed} days)
                                      </p>
                                      <p className={`text-xs font-medium ${dailyProgress.textClass}`}>
                                        {dailyProgress.isOverrun
                                          ? `Over by ${formatIDR(Math.abs(dailyProgress.remaining))}`
                                          : `${formatIDR(dailyProgress.remaining)} left`}
                                      </p>
                                      <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Pacing</span>
                                        <span>{dailyProgress.percent}%</span>
                                      </div>
                                      <div className="w-full bg-muted rounded-full h-1.5">
                                        <div
                                          className={`h-1.5 rounded-full ${dailyProgress.colorClass}`}
                                          style={{ width: `${Math.min(dailyProgress.percent, 100)}%` }}
                                        />
                                      </div>
                                      <div className="flex justify-between text-xs text-muted-foreground pt-1">
                                        <span>Today</span>
                                        <span>{c.todayProgress!.percent}%</span>
                                      </div>
                                      <p className="text-xs text-muted-foreground">
                                        Available: {formatIDR(c.availableToday!)} (incl. rollover)
                                      </p>
                                      <div className="w-full bg-muted rounded-full h-1.5">
                                        <div
                                          className={`h-1.5 rounded-full ${c.todayProgress!.colorClass}`}
                                          style={{ width: `${Math.min(c.todayProgress!.percent, 100)}%` }}
                                        />
                                      </div>
                                    </div>
                                    {/* Weekly */}
                                    <div className="space-y-1 py-3">
                                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Weekly</p>
                                      <p className="text-xs text-muted-foreground">
                                        Weekly: {formatIDR(c.totalSpent)} / {formatIDR(c.dailyBudget! * (weekNumber * 7))} (week {weekNumber})
                                      </p>
                                      <p className={`text-xs font-medium ${weeklyProgress.textClass}`}>
                                        {weeklyProgress.isOverrun
                                          ? `Over by ${formatIDR(Math.abs(weeklyProgress.remaining))}`
                                          : `${formatIDR(weeklyProgress.remaining)} left`}
                                      </p>
                                      <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Pacing</span>
                                        <span>{weeklyProgress.percent}%</span>
                                      </div>
                                      <div className="w-full bg-muted rounded-full h-1.5">
                                        <div
                                          className={`h-1.5 rounded-full ${weeklyProgress.colorClass}`}
                                          style={{ width: `${Math.min(weeklyProgress.percent, 100)}%` }}
                                        />
                                      </div>
                                      <div className="flex justify-between text-xs text-muted-foreground pt-1">
                                        <span>This Week</span>
                                        <span>{c.thisWeekProgress!.percent}%</span>
                                      </div>
                                      <p className="text-xs text-muted-foreground">
                                        Available: {formatIDR(c.availableThisWeek!)} (incl. rollover)
                                      </p>
                                      <div className="w-full bg-muted rounded-full h-1.5">
                                        <div
                                          className={`h-1.5 rounded-full ${c.thisWeekProgress!.colorClass}`}
                                          style={{ width: `${Math.min(c.thisWeekProgress!.percent, 100)}%` }}
                                        />
                                      </div>
                                    </div>
                                    {/* Monthly */}
                                    <div className="space-y-1 pt-3">
                                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Monthly</p>
                                      <p className="text-xs text-muted-foreground">
                                        Monthly: {formatIDR(c.totalSpent)} / {formatIDR(c.monthlyBudget)}
                                      </p>
                                      <p className={`text-xs font-medium ${monthlyProgress.textClass}`}>
                                        {monthlyProgress.isOverrun
                                          ? `Over by ${formatIDR(Math.abs(monthlyProgress.remaining))}`
                                          : `${formatIDR(monthlyProgress.remaining)} left`}
                                      </p>
                                      <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Progress</span>
                                        <span>{monthlyProgress.percent}%</span>
                                      </div>
                                      <div className="w-full bg-muted rounded-full h-1.5">
                                        <div
                                          className={`h-1.5 rounded-full ${monthlyProgress.colorClass}`}
                                          style={{ width: `${Math.min(monthlyProgress.percent, 100)}%` }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          }
                          if (isWeekly) {
                            const weeklyProgress = c.weeklyProgress!;
                            const monthlyProgress = c.monthlyProgress!;
                            const thisWeekProgress = c.thisWeekProgress!;
                            const accumulated = c.accumulatedWeeklyBudget!;
                            return (
                              <Card key={c.categoryId} size="sm">
                                <CardContent className="pt-3">
                                  <div className="flex items-center justify-between mb-1 gap-2">
                                    <span className="text-sm font-medium">{c.categoryName}</span>
                                    <div className="flex gap-1.5">
                                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground whitespace-nowrap">
                                        {formatIDR(c.weeklyBudget!)}/week
                                      </span>
                                    </div>
                                  </div>
                                  <div className="divide-y divide-border">
                                    {/* Weekly */}
                                    <div className="space-y-1 pb-3">
                                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Weekly</p>
                                      <p className="text-xs text-muted-foreground">
                                        Weekly: {formatIDR(c.totalSpent)} / {formatIDR(accumulated)} ({c.periodWeeksElapsed} weeks)
                                      </p>
                                      <p className={`text-xs font-medium ${weeklyProgress.textClass}`}>
                                        {weeklyProgress.isOverrun
                                          ? `Over by ${formatIDR(Math.abs(weeklyProgress.remaining))}`
                                          : `${formatIDR(weeklyProgress.remaining)} left`}
                                      </p>
                                      <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Pacing</span>
                                        <span>{weeklyProgress.percent}%</span>
                                      </div>
                                      <div className="w-full bg-muted rounded-full h-1.5">
                                        <div
                                          className={`h-1.5 rounded-full ${weeklyProgress.colorClass}`}
                                          style={{ width: `${Math.min(weeklyProgress.percent, 100)}%` }}
                                        />
                                      </div>
                                      <div className="flex justify-between text-xs text-muted-foreground pt-1">
                                        <span>This Week</span>
                                        <span>{thisWeekProgress.percent}%</span>
                                      </div>
                                      <p className="text-xs text-muted-foreground">
                                        Available: {formatIDR(c.availableThisWeek!)} (incl. rollover)
                                      </p>
                                      <div className="w-full bg-muted rounded-full h-1.5">
                                        <div
                                          className={`h-1.5 rounded-full ${thisWeekProgress.colorClass}`}
                                          style={{ width: `${Math.min(thisWeekProgress.percent, 100)}%` }}
                                        />
                                      </div>
                                    </div>
                                    {/* Monthly */}
                                    <div className="space-y-1 pt-3">
                                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Monthly</p>
                                      <p className="text-xs text-muted-foreground">
                                        Monthly: {formatIDR(c.totalSpent)} / {formatIDR(c.monthlyBudget)}
                                      </p>
                                      <p className={`text-xs font-medium ${monthlyProgress.textClass}`}>
                                        {monthlyProgress.isOverrun
                                          ? `Over by ${formatIDR(Math.abs(monthlyProgress.remaining))}`
                                          : `${formatIDR(monthlyProgress.remaining)} left`}
                                      </p>
                                      <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Progress</span>
                                        <span>{monthlyProgress.percent}%</span>
                                      </div>
                                      <div className="w-full bg-muted rounded-full h-1.5">
                                        <div
                                          className={`h-1.5 rounded-full ${monthlyProgress.colorClass}`}
                                          style={{ width: `${Math.min(monthlyProgress.percent, 100)}%` }}
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
                                    className={`text-xs font-medium ${c.monthlyProgress?.textClass ?? 'text-green-600'}`}
                                  >
                                    {(c.monthlyProgress?.isOverrun ?? false)
                                      ? `Over by ${formatIDR(Math.abs(c.monthlyProgress?.remaining ?? c.remaining))}`
                                      : `${formatIDR(c.monthlyProgress?.remaining ?? c.remaining)} left`}
                                  </p>
                                </div>
                              </div>
                              <div className="w-full bg-muted rounded-full h-1.5">
                                <div
                                  className={`h-1.5 rounded-full ${c.monthlyProgress?.colorClass ?? 'bg-green-500'}`}
                                  style={{ width: `${Math.min(c.monthlyProgress?.percent ?? 0, 100)}%` }}
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
