'use client';

import { useState } from 'react';
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

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

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
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <MonthNavigator
            label={monthLabel}
            onPrev={goToPrevMonth}
            onNext={goToNextMonth}
            disableNext={isCurrentMonth}
          />
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
          </>
        )}
      </div>
    </main>
  );
}
