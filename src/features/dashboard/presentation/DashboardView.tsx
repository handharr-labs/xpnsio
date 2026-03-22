'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDashboardViewModel } from './useDashboardViewModel';
import { usePullToRefresh } from '@/shared/presentation/hooks/usePullToRefresh';
import { ROUTES } from '@/shared/presentation/navigation/routes';
import { MonthNavigator } from '@/shared/presentation/common/molecules/MonthNavigator';
import { BudgetOverviewCard } from './organisms/BudgetOverviewCard';
import { CategoryBreakdownSection } from './organisms/CategoryBreakdownSection';
import { RecentTransactionsSection } from './organisms/RecentTransactionsSection';

export function DashboardView() {
  const router = useRouter();

  const {
    dashboardData,
    isLoading,
    error,
    refresh,
    monthLabel,
    isCurrentMonth,
    goToPrevMonth,
    goToNextMonth,
  } = useDashboardViewModel();

  const { containerRef, pullDistance, isRefreshing } = usePullToRefresh(refresh);

  return (
    <main
      ref={containerRef as React.RefObject<HTMLElement>}
      className="min-h-screen overscroll-none bg-zinc-950 dark"
    >
      {/* Pull to Refresh Indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground transition-all"
          style={{ height: isRefreshing ? 40 : pullDistance }}
        >
          <span className={isRefreshing ? 'animate-spin' : ''}>↻</span>
          <span>{isRefreshing ? 'Refreshing…' : 'Release to refresh'}</span>
        </div>
      )}

      {/* Content Container - PWA safe area padding */}
      <div className="px-4 pt-4 pb-[calc(6rem+env(safe-area-inset-bottom))] md:px-6 md:pt-6 md:pb-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <header className="flex items-center justify-between min-h-[44px]">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">Dashboard</h1>
            <MonthNavigator
              label={monthLabel}
              onPrev={goToPrevMonth}
              onNext={goToNextMonth}
              disableNext={isCurrentMonth}
            />
          </header>

          {/* Error State */}
          {error && (
            <div className="rounded-xl bg-red-500/10 ring-1 ring-red-500/20 p-4 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-48 rounded-2xl bg-zinc-800/50 animate-pulse" />
              <div className="h-8 w-32 rounded-lg bg-zinc-800/50 animate-pulse" />
              <div className="grid gap-3 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 rounded-xl bg-zinc-800/50 animate-pulse" />
                ))}
              </div>
            </div>
          ) : !dashboardData?.hasActiveBudget ? (
            /* Empty State */
            <Card className="border-dashed bg-zinc-900/50 ring-1 ring-white/10 border-zinc-700">
              <CardContent className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-800 mx-auto flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-white">No budget for this period</p>
                  {isCurrentMonth ? (
                    <p className="text-zinc-400 text-sm max-w-xs mx-auto">
                      Set up a budget to start tracking your spending and stay on top of your finances.
                    </p>
                  ) : (
                    <p className="text-zinc-400 text-sm">No budget was applied for this month.</p>
                  )}
                </div>
                {isCurrentMonth && (
                  <Button onClick={() => router.push(ROUTES.setup)} size="lg" className="mt-2">
                    Set Up Budget
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            /* Main Content */
            <div className="space-y-8">
              <BudgetOverviewCard
                totalMonthlyBudget={dashboardData.totalMonthlyBudget}
                totalSpent={dashboardData.totalSpent}
                totalRemaining={dashboardData.totalRemaining}
              />
              <CategoryBreakdownSection categories={dashboardData.categories} />
              <RecentTransactionsSection
                transactions={dashboardData.recentTransactions}
                onViewAll={() => router.push(ROUTES.transactions)}
                onSelect={(id) => router.push(ROUTES.transactionDetail(id))}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
