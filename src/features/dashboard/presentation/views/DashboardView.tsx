'use client';

import { useRouter } from 'next/navigation';
import {
  Card, CardContent, Button, MonthNavigator,
  StatOverviewCard, ProgressCardGrid, ListPreviewSection,
} from '@handharr-labs/forge-ui-uno';
import type { ProgressGroupVM, ProgressCardVM, ListPreviewItemVM } from '@handharr-labs/forge-ui-uno';
import { usePullToRefresh } from '@handharr-labs/forge-web-client';
import { formatCurrency, formatCompactCurrency, formatWeekRange, formatRelativeDate } from '@handharr-labs/forge-core';
import { ROUTES } from '@/shared/presentation/navigation/routes';
import { useDashboardViewModel } from '../hooks/useDashboardViewModel';
import { BudgetProgressServiceImpl } from '@/features/dashboard/data/services/BudgetProgressServiceImpl';
import type { CategoryBudgetInfo } from '@/features/dashboard/domain/entities/CategoryBudgetInfo';
import type { BudgetProgressData } from '@/features/dashboard/domain/entities/BudgetProgressData';

const STATUS_LABELS: Record<string, string> = {
  'on-track': 'On Track',
  'at-risk': 'At Risk',
  'over': 'Over Budget',
};

const MASTER_LABELS: Record<string, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

function formatCompact(amount: number) {
  return formatCompactCurrency(amount, 'IDR');
}

function budgetLabel(remaining: number, isOverrun: boolean) {
  return isOverrun ? `over ${formatCompact(Math.abs(remaining))}` : `${formatCompact(remaining)} left`;
}

function toProgressDisplay(p: BudgetProgressData, labelOverride?: string) {
  return { percent: p.percent, status: p.status, label: labelOverride ?? budgetLabel(p.remaining, p.isOverrun) };
}

function mapCategoryToCardVM(c: CategoryBudgetInfo, isCurrentPeriod: boolean): ProgressCardVM | null {
  if (c.masterCategory === 'daily' && c.dailyBudget != null && c.accumulatedBudgetToDate != null) {
    if (!c.dailyProgress || !c.todayProgress || !c.thisWeekProgress || c.availableToday == null || c.spentToday == null) return null;
    return {
      type: 'daily',
      id: c.categoryId,
      name: c.categoryName,
      budgetBadge: `${formatCompact(c.dailyBudget)}/day`,
      todayLabel: isCurrentPeriod ? 'Today' : 'Last Day',
      todayProgress: toProgressDisplay(c.todayProgress),
      todaySpentLabel: `${formatCurrency(c.spentToday, 'IDR')} of ${formatCurrency(c.availableToday, 'IDR')}`,
      pacingLabel: `Pacing (${c.periodDaysElapsed}d)`,
      pacingProgress: toProgressDisplay(c.dailyProgress, `${c.dailyProgress.percent}%`),
      weekLabel: isCurrentPeriod ? 'This Week' : 'Last Week',
      weekProgress: toProgressDisplay(c.thisWeekProgress),
    };
  }

  if (c.masterCategory === 'weekly' && c.weeklyBudget != null && c.accumulatedWeeklyBudget != null) {
    if (!c.weeklyProgress || !c.thisWeekProgress || !c.monthlyProgress || c.availableThisWeek == null || c.spentThisWeek == null) return null;
    return {
      type: 'weekly',
      id: c.categoryId,
      name: c.categoryName,
      budgetBadge: `${formatCompact(c.weeklyBudget)}/wk`,
      weekLabel: isCurrentPeriod ? 'This Week' : 'Last Week',
      weekSubLabel: formatWeekRange(c.weekStartStr),
      weekProgress: toProgressDisplay(c.thisWeekProgress),
      weekSpentLabel: `${formatCurrency(c.spentThisWeek, 'IDR')} of ${formatCurrency(c.availableThisWeek, 'IDR')}`,
      pacingLabel: `Pacing (Week ${c.periodWeeksElapsed})`,
      pacingProgress: toProgressDisplay(c.weeklyProgress, `${c.weeklyProgress.percent}%`),
      monthlyProgress: toProgressDisplay(c.monthlyProgress),
    };
  }

  const progress = c.monthlyProgress;
  const percent = progress?.percent ?? 0;
  const status = progress?.status ?? 'on-track';
  const remaining = progress?.remaining ?? c.remaining;
  const isOverrun = progress?.isOverrun ?? false;

  return {
    type: 'monthly',
    id: c.categoryId,
    name: c.categoryName,
    progress: { percent, status, label: budgetLabel(remaining, isOverrun) },
    spentLabel: `${formatCurrency(c.totalSpent, 'IDR')} / ${formatCurrency(c.monthlyBudget, 'IDR')}`,
  };
}

function buildCategoryGroups(categories: ReadonlyArray<CategoryBudgetInfo>, isCurrentPeriod: boolean): ProgressGroupVM[] {
  const groups: ProgressGroupVM[] = [];
  for (const period of ['daily', 'weekly', 'monthly'] as const) {
    const items = categories
      .filter((c) => c.masterCategory === period)
      .map((c) => mapCategoryToCardVM(c, isCurrentPeriod))
      .filter((vm): vm is ProgressCardVM => vm !== null);
    if (items.length > 0) {
      groups.push({ period, label: MASTER_LABELS[period], items });
    }
  }
  return groups;
}

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

  const budgetProgressService = new BudgetProgressServiceImpl();
  const budgetStatus = dashboardData
    ? budgetProgressService.getProgressStatus(
        budgetProgressService.calculatePercent(dashboardData.totalSpent, dashboardData.totalMonthlyBudget)
      )
    : 'on-track' as const;

  return (
    <main
      ref={containerRef as React.RefObject<HTMLElement>}
      className="min-h-screen overscroll-none"
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
            <h1 className="typo-page-title text-foreground">Dashboard</h1>
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
              <div className="h-48 w-full rounded-2xl bg-zinc-800/50 animate-pulse" />
              <div className="h-8 w-32 rounded-lg bg-zinc-800/50 animate-pulse" />
              <div className="grid gap-3 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 w-full rounded-xl bg-zinc-800/50 animate-pulse" />
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
                  <p className="typo-section-title text-white">No budget for this period</p>
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
              <StatOverviewCard
                formattedRemaining={formatCurrency(dashboardData.totalRemaining)}
                formattedBudget={formatCurrency(dashboardData.totalMonthlyBudget)}
                formattedSpent={formatCurrency(dashboardData.totalSpent)}
                percentage={dashboardData.totalMonthlyBudget > 0 ? Math.min(Math.round((dashboardData.totalSpent / dashboardData.totalMonthlyBudget) * 100), 100) : 0}
                status={budgetStatus}
                statusLabel={STATUS_LABELS[budgetStatus]}
                isOverrun={dashboardData.totalRemaining < 0}
              />
              <ProgressCardGrid title="Categories" groups={buildCategoryGroups(dashboardData.categories, isCurrentMonth)} />
              <ListPreviewSection
                transactions={dashboardData.recentTransactions.map((tx): ListPreviewItemVM => ({
                  id: tx.id,
                  label: tx.categoryName ?? (tx.type === 'income' ? 'Income' : 'Expense'),
                  description: tx.description ?? undefined,
                  formattedAmount: `${tx.type === 'income' ? '+' : '-'}${formatCurrency(tx.amount, dashboardData.currency)}`,
                  formattedDate: formatRelativeDate(tx.date),
                  variant: tx.type === 'income' ? 'income' : 'expense',
                }))}
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
