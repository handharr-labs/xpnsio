import { Card, CardContent } from '@/components/ui/card';
import type { CategoryBudgetInfo } from '@/features/dashboard/domain/use-cases/dashboard/GetDashboardDataUseCase';

const formatIDR = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

const formatWeekRange = (weekStartStr: string | undefined): string => {
  if (!weekStartStr) return '';
  const start = new Date(weekStartStr);
  const end = new Date(weekStartStr);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  return `${fmt(start)} – ${fmt(end)}`;
};

const MASTER_LABELS: Record<string, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

interface CategoryBreakdownSectionProps {
  categories: CategoryBudgetInfo[];
}

function ProgressBar({ percent, colorClass }: { percent: number; colorClass: string }) {
  return (
    <div className="w-full bg-muted rounded-full h-1.5">
      <div
        className={`h-1.5 rounded-full ${colorClass}`}
        style={{ width: `${Math.min(percent, 100)}%` }}
      />
    </div>
  );
}

function DailyCategoryCard({ c }: { c: CategoryBudgetInfo }) {
  const dailyProgress = c.dailyProgress!;
  const weeklyProgress = c.weeklyProgress!;
  const monthlyProgress = c.monthlyProgress!;
  const weekNumber = Math.ceil((c.periodDaysElapsed ?? 0) / 7);
  const accumulated = c.accumulatedBudgetToDate!;

  return (
    <Card size="sm">
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
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Pacing</span>
              <span>{dailyProgress.percent}%</span>
            </div>
            <ProgressBar percent={dailyProgress.percent} colorClass={dailyProgress.colorClass} />
            <div className="flex justify-between text-xs text-muted-foreground pt-1">
              <span>Today</span>
              <span>{c.todayProgress!.percent}%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatIDR(c.spentToday!)} / {formatIDR(c.availableToday!)} (incl. rollover)
            </p>
            <p className={`text-xs font-medium ${c.todayProgress!.textClass}`}>
              {c.todayProgress!.isOverrun
                ? `Over by ${formatIDR(Math.abs(c.availableToday! - c.spentToday!))}`
                : `${formatIDR(c.availableToday! - c.spentToday!)} left`}
            </p>
            <ProgressBar percent={c.todayProgress!.percent} colorClass={c.todayProgress!.colorClass} />
          </div>
          {/* Weekly */}
          <div className="space-y-1 py-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Weekly</p>
            <p className="text-xs text-muted-foreground">
              Weekly: {formatIDR(c.totalSpent)} / {formatIDR(c.accumulatedWeeklyBudget!)} (Week {weekNumber} · {formatWeekRange(c.weekStartStr)})
            </p>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Pacing</span>
              <span>{weeklyProgress.percent}%</span>
            </div>
            <ProgressBar percent={weeklyProgress.percent} colorClass={weeklyProgress.colorClass} />
            <div className="flex justify-between text-xs text-muted-foreground pt-1">
              <span>This Week</span>
              <span>{c.thisWeekProgress!.percent}%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatIDR(c.spentThisWeek!)} / {formatIDR(c.availableThisWeek!)} (incl. rollover)
            </p>
            <p className={`text-xs font-medium ${c.thisWeekProgress!.textClass}`}>
              {c.thisWeekProgress!.isOverrun
                ? `Over by ${formatIDR(Math.abs(c.availableThisWeek! - c.spentThisWeek!))}`
                : `${formatIDR(c.availableThisWeek! - c.spentThisWeek!)} left`}
            </p>
            <ProgressBar percent={c.thisWeekProgress!.percent} colorClass={c.thisWeekProgress!.colorClass} />
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
            <ProgressBar percent={monthlyProgress.percent} colorClass={monthlyProgress.colorClass} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WeeklyCategoryCard({ c }: { c: CategoryBudgetInfo }) {
  const weeklyProgress = c.weeklyProgress!;
  const monthlyProgress = c.monthlyProgress!;
  const thisWeekProgress = c.thisWeekProgress!;
  const accumulated = c.accumulatedWeeklyBudget!;

  return (
    <Card size="sm">
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
              Weekly: {formatIDR(c.totalSpent)} / {formatIDR(accumulated)} (Week {c.periodWeeksElapsed} · {formatWeekRange(c.weekStartStr)})
            </p>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Pacing</span>
              <span>{weeklyProgress.percent}%</span>
            </div>
            <ProgressBar percent={weeklyProgress.percent} colorClass={weeklyProgress.colorClass} />
            <div className="flex justify-between text-xs text-muted-foreground pt-1">
              <span>This Week</span>
              <span>{thisWeekProgress.percent}%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatIDR(c.spentThisWeek!)} / {formatIDR(c.availableThisWeek!)} (incl. rollover)
            </p>
            <p className={`text-xs font-medium ${thisWeekProgress.textClass}`}>
              {thisWeekProgress.isOverrun
                ? `Over by ${formatIDR(Math.abs(c.availableThisWeek! - c.spentThisWeek!))}`
                : `${formatIDR(c.availableThisWeek! - c.spentThisWeek!)} left`}
            </p>
            <ProgressBar percent={thisWeekProgress.percent} colorClass={thisWeekProgress.colorClass} />
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
            <ProgressBar percent={monthlyProgress.percent} colorClass={monthlyProgress.colorClass} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MonthlyCategoryCard({ c }: { c: CategoryBudgetInfo }) {
  return (
    <Card size="sm">
      <CardContent className="pt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{c.categoryName}</span>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              {formatIDR(c.totalSpent)} / {formatIDR(c.monthlyBudget)}
            </p>
            <p className={`text-xs font-medium ${c.monthlyProgress?.textClass ?? 'text-green-600'}`}>
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
}

export function CategoryBreakdownSection({ categories }: CategoryBreakdownSectionProps) {
  if (categories.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold">By Category</h2>
      {(['daily', 'weekly', 'monthly'] as const).map((period) => {
        const items = categories.filter((c) => c.masterCategory === period);
        if (items.length === 0) return null;
        return (
          <div key={period}>
            <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
              {MASTER_LABELS[period]}
            </p>
            <div className="space-y-2">
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
    </div>
  );
}
