import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import type { CategoryBudgetInfo } from '@/features/dashboard/domain/use-cases/dashboard/GetDashboardDataUseCase';
import { formatCurrency, formatCompactCurrency } from '@/shared/core/utils/formatCurrency';
import { formatWeekRange } from '@/shared/core/utils/formatWeekRange';

const formatCompact = (amount: number) => formatCompactCurrency(amount, 'IDR');

const MASTER_LABELS: Record<string, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

interface CategoryBreakdownSectionProps {
  categories: CategoryBudgetInfo[];
}

interface ProgressBarProps {
  percent: number;
  colorClass: string;
  height?: 'sm' | 'md';
}

function ProgressBar({ percent, colorClass, height = 'sm' }: ProgressBarProps) {
  return (
    <div className={`w-full bg-muted rounded-full overflow-hidden ${height === 'md' ? 'h-2' : 'h-1.5'}`}>
      <div
        className={`h-full rounded-full transition-all duration-300 ${colorClass}`}
        style={{ width: `${Math.min(percent, 100)}%` }}
      />
    </div>
  );
}

interface StatusBadgeProps {
  isOverrun: boolean;
  remaining: number;
  textClass: string;
}

function StatusBadge({ isOverrun, remaining, textClass }: StatusBadgeProps) {
  return (
    <span className={`text-xs font-medium ${textClass}`}>
      {isOverrun ? `−${formatCompact(Math.abs(remaining))}` : `${formatCompact(remaining)} left`}
    </span>
  );
}

interface PeriodRowProps {
  label: string;
  spent: number;
  budget: number;
  percent: number;
  colorClass: string;
  textClass: string;
  isOverrun: boolean;
  remaining: number;
  subtitle?: string;
}

function PeriodRow({ label, spent, budget, percent, colorClass, textClass, isOverrun, remaining, subtitle }: PeriodRowProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-foreground">{label}</span>
          {subtitle && <span className="text-xs text-muted-foreground ml-1.5">{subtitle}</span>}
        </div>
        <StatusBadge isOverrun={isOverrun} remaining={remaining} textClass={textClass} />
      </div>
      <ProgressBar percent={percent} colorClass={colorClass} height="md" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatCompact(spent)} / {formatCompact(budget)}</span>
        <span>{percent}%</span>
      </div>
    </div>
  );
}

function DailyCategoryCard({ c }: { c: CategoryBudgetInfo }) {
  const dailyProgress = c.dailyProgress;
  const todayProgress = c.todayProgress;
  const monthlyProgress = c.monthlyProgress;

  if (!dailyProgress || !todayProgress || !monthlyProgress || c.dailyBudget == null || c.availableToday == null || c.spentToday == null) return null;

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
            <StatusBadge isOverrun={todayProgress.isOverrun} remaining={c.availableToday - c.spentToday} textClass={todayProgress.textClass} />
          </div>
          <ProgressBar percent={todayProgress.percent} colorClass={todayProgress.colorClass} height="md" />
          <p className="text-xs text-muted-foreground">
            {formatCurrency(c.spentToday, 'IDR')} of {formatCurrency(c.availableToday, 'IDR')}
          </p>
        </div>

        {/* Pacing & Monthly - Compact Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Pacing ({c.periodDaysElapsed}d)</p>
            <ProgressBar percent={dailyProgress.percent} colorClass={dailyProgress.colorClass} />
            <p className={`text-xs font-medium ${dailyProgress.textClass}`}>{dailyProgress.percent}%</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Monthly</p>
            <ProgressBar percent={monthlyProgress.percent} colorClass={monthlyProgress.colorClass} />
            <p className={`text-xs font-medium ${monthlyProgress.textClass}`}>
              {formatCompact(monthlyProgress.remaining)} left
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
            <StatusBadge isOverrun={thisWeekProgress.isOverrun} remaining={c.availableThisWeek - c.spentThisWeek} textClass={thisWeekProgress.textClass} />
          </div>
          <ProgressBar percent={thisWeekProgress.percent} colorClass={thisWeekProgress.colorClass} height="md" />
          <p className="text-xs text-muted-foreground">
            {formatCurrency(c.spentThisWeek, 'IDR')} of {formatCurrency(c.availableThisWeek, 'IDR')}
          </p>
        </div>

        {/* Pacing & Monthly - Compact Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Pacing (Week {c.periodWeeksElapsed})</p>
            <ProgressBar percent={weeklyProgress.percent} colorClass={weeklyProgress.colorClass} />
            <p className={`text-xs font-medium ${weeklyProgress.textClass}`}>{weeklyProgress.percent}%</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Monthly</p>
            <ProgressBar percent={monthlyProgress.percent} colorClass={monthlyProgress.colorClass} />
            <p className={`text-xs font-medium ${monthlyProgress.textClass}`}>
              {formatCompact(monthlyProgress.remaining)} left
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
  const colorClass = progress?.colorClass ?? 'bg-emerald-500';
  const textClass = progress?.textClass ?? 'text-emerald-300';
  const isOverrun = progress?.isOverrun ?? false;
  const remaining = progress?.remaining ?? c.remaining;

  return (
    <Card size="sm" className="hover:ring-foreground/20 transition-all cursor-pointer group">
      <CardContent className="pt-3 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{c.categoryName}</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Progress */}
        <ProgressBar percent={percent} colorClass={colorClass} height="md" />

        {/* Stats Row */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {formatCurrency(c.totalSpent, 'IDR')} / {formatCurrency(c.monthlyBudget, 'IDR')}
          </span>
          <StatusBadge isOverrun={isOverrun} remaining={remaining} textClass={textClass} />
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
