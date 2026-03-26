import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import type { CategoryBudgetInfo } from '@/features/dashboard/domain/entities/CategoryBudgetInfo';
import type { BudgetStatus } from '@/features/dashboard/domain/services/BudgetProgressService';
import { formatCurrency, formatCompactCurrency } from '@/shared/core/utils/formatCurrency';
import { formatWeekRange } from '@/shared/core/utils/formatWeekRange';

const formatCompact = (amount: number) => formatCompactCurrency(amount, 'IDR');
const formatBudgetLabel = (remaining: number, isOverrun: boolean) =>
  isOverrun ? `over ${formatCompact(Math.abs(remaining))}` : `${formatCompact(remaining)} left`;

const MASTER_LABELS: Record<string, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

const STATUS_COLOR: Record<BudgetStatus, string> = {
  'on-track': 'bg-emerald-400',
  'at-risk':  'bg-yellow-400',
  'over':     'bg-red-400',
};

const STATUS_TEXT: Record<BudgetStatus, string> = {
  'on-track': 'text-emerald-600 dark:text-emerald-300',
  'at-risk':  'text-yellow-600 dark:text-yellow-300',
  'over':     'text-red-600 dark:text-red-300',
};

interface CategoryBreakdownSectionProps {
  categories: CategoryBudgetInfo[];
}

interface ProgressBarProps {
  percent: number;
  status: BudgetStatus;
  height?: 'sm' | 'md';
}

function ProgressBar({ percent, status, height = 'sm' }: ProgressBarProps) {
  return (
    <div className={`w-full bg-muted rounded-full overflow-hidden ${height === 'md' ? 'h-2' : 'h-1.5'}`}>
      <div
        className={`h-full rounded-full transition-all duration-300 ${STATUS_COLOR[status]}`}
        style={{ width: `${Math.min(percent, 100)}%` }}
      />
    </div>
  );
}

interface StatusBadgeProps {
  label: string;
  status: BudgetStatus;
}

function StatusBadge({ label, status }: StatusBadgeProps) {
  return (
    <span className={`text-xs font-medium ${STATUS_TEXT[status]}`}>
      {label}
    </span>
  );
}


function DailyCategoryCard({ c }: { c: CategoryBudgetInfo }) {
  const dailyProgress = c.dailyProgress;
  const todayProgress = c.todayProgress;
  const thisWeekProgress = c.thisWeekProgress;

  if (!dailyProgress || !todayProgress || !thisWeekProgress || c.dailyBudget == null || c.availableToday == null || c.spentToday == null) return null;

  return (
    <Card size="sm" className="hover:ring-foreground/20 transition-all cursor-pointer group">
      <CardContent className="pt-3 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{c.categoryName}</span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {formatCompact(c.dailyBudget)}/day
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Today - Primary Focus */}
        <div className="p-3 rounded-lg bg-muted/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Today</span>
            <StatusBadge label={formatBudgetLabel(todayProgress.remaining, todayProgress.isOverrun)} status={todayProgress.status} />
          </div>
          <ProgressBar percent={todayProgress.percent} status={todayProgress.status} height="md" />
          <p className="text-xs text-muted-foreground">
            {formatCurrency(c.spentToday, 'IDR')} of {formatCurrency(c.availableToday, 'IDR')}
          </p>
        </div>

        {/* Pacing & This Week - Compact Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Pacing ({c.periodDaysElapsed}d)</p>
            <ProgressBar percent={dailyProgress.percent} status={dailyProgress.status} />
            <p className={`text-xs font-medium ${STATUS_TEXT[dailyProgress.status]}`}>{dailyProgress.percent}%</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">This Week</p>
            <ProgressBar percent={thisWeekProgress.percent} status={thisWeekProgress.status} />
            <p className={`text-xs font-medium ${STATUS_TEXT[thisWeekProgress.status]}`}>
              {formatBudgetLabel(thisWeekProgress.remaining, thisWeekProgress.isOverrun)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WeeklyCategoryCard({ c }: { c: CategoryBudgetInfo }) {
  const weeklyProgress = c.weeklyProgress;
  const thisWeekProgress = c.thisWeekProgress;
  const monthlyProgress = c.monthlyProgress;

  if (!weeklyProgress || !thisWeekProgress || !monthlyProgress || c.weeklyBudget == null || c.availableThisWeek == null || c.spentThisWeek == null) return null;

  return (
    <Card size="sm" className="hover:ring-foreground/20 transition-all cursor-pointer group">
      <CardContent className="pt-3 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{c.categoryName}</span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {formatCompact(c.weeklyBudget)}/wk
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* This Week - Primary Focus */}
        <div className="p-3 rounded-lg bg-muted/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              This Week
              <span className="font-normal ml-1">({formatWeekRange(c.weekStartStr)})</span>
            </span>
            <StatusBadge label={formatBudgetLabel(thisWeekProgress.remaining, thisWeekProgress.isOverrun)} status={thisWeekProgress.status} />
          </div>
          <ProgressBar percent={thisWeekProgress.percent} status={thisWeekProgress.status} height="md" />
          <p className="text-xs text-muted-foreground">
            {formatCurrency(c.spentThisWeek, 'IDR')} of {formatCurrency(c.availableThisWeek, 'IDR')}
          </p>
        </div>

        {/* Pacing & Monthly - Compact Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Pacing (Week {c.periodWeeksElapsed})</p>
            <ProgressBar percent={weeklyProgress.percent} status={weeklyProgress.status} />
            <p className={`text-xs font-medium ${STATUS_TEXT[weeklyProgress.status]}`}>{weeklyProgress.percent}%</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Monthly</p>
            <ProgressBar percent={monthlyProgress.percent} status={monthlyProgress.status} />
            <p className={`text-xs font-medium ${STATUS_TEXT[monthlyProgress.status]}`}>
              {formatBudgetLabel(monthlyProgress.remaining, monthlyProgress.isOverrun)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MonthlyCategoryCard({ c }: { c: CategoryBudgetInfo }) {
  const progress = c.monthlyProgress;
  const percent = progress?.percent ?? 0;
  const status: BudgetStatus = progress?.status ?? 'on-track';
  const remaining = progress?.remaining ?? c.remaining;
  const isOverrun = progress?.isOverrun ?? false;

  return (
    <Card size="sm" className="hover:ring-foreground/20 transition-all cursor-pointer group">
      <CardContent className="pt-3 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{c.categoryName}</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Progress */}
        <ProgressBar percent={percent} status={status} height="md" />

        {/* Stats Row */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {formatCurrency(c.totalSpent, 'IDR')} / {formatCurrency(c.monthlyBudget, 'IDR')}
          </span>
          <StatusBadge label={formatBudgetLabel(remaining, isOverrun)} status={status} />
        </div>
      </CardContent>
    </Card>
  );
}

export function CategoryBreakdownSection({ categories }: CategoryBreakdownSectionProps) {
  if (categories.length === 0) return null;

  return (
    <section className="space-y-5">
      <h2 className="text-lg font-semibold text-white">Categories</h2>

      {(['daily', 'weekly', 'monthly'] as const).map((period) => {
        const items = categories.filter((c) => c.masterCategory === period);
        if (items.length === 0) return null;

        return (
          <div key={period} className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {MASTER_LABELS[period]}
              </h3>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {items.map((c) => {
                const isDaily =
                  c.masterCategory === 'daily' &&
                  c.dailyBudget != null &&
                  c.accumulatedBudgetToDate != null;
                const isWeekly =
                  c.masterCategory === 'weekly' &&
                  c.weeklyBudget != null &&
                  c.accumulatedWeeklyBudget != null;

                if (isDaily) return <DailyCategoryCard key={c.categoryId} c={c} />;
                if (isWeekly) return <WeeklyCategoryCard key={c.categoryId} c={c} />;
                return <MonthlyCategoryCard key={c.categoryId} c={c} />;
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}
