import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import type { ComponentType } from 'react';

type StatusVariant = 'on-track' | 'at-risk' | 'over';

const healthConfig: Record<StatusVariant, {
  bg: string;
  border: string;
  text: string;
  Icon: ComponentType<{ className?: string }>;
  progressBg: string;
}> = {
  'on-track': {
    bg: 'bg-emerald-500/10',
    border: 'ring-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    Icon: TrendingUp,
    progressBg: 'bg-emerald-400',
  },
  'at-risk': {
    bg: 'bg-amber-500/10',
    border: 'ring-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    Icon: AlertTriangle,
    progressBg: 'bg-amber-400',
  },
  'over': {
    bg: 'bg-red-500/10',
    border: 'ring-red-500/20',
    text: 'text-red-700 dark:text-red-400',
    Icon: TrendingDown,
    progressBg: 'bg-red-400',
  },
};

export interface BudgetOverviewCardProps {
  formattedRemaining: string;
  formattedBudget: string;
  formattedSpent: string;
  percentage: number;
  status: StatusVariant;
  statusLabel: string;
  isOverrun: boolean;
}

export function BudgetOverviewCard({
  formattedRemaining,
  formattedBudget,
  formattedSpent,
  percentage,
  status,
  statusLabel,
  isOverrun,
}: BudgetOverviewCardProps) {
  const config = healthConfig[status];
  const Icon = config.Icon;

  return (
    <div className={`rounded-2xl p-5 ring-1 ${config.bg} ${config.border}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-muted-foreground">Budget Overview</h2>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.text} ${config.bg}`}>
          <Icon className="w-3.5 h-3.5" />
          <span>{statusLabel}</span>
        </div>
      </div>

      <div className="mb-5">
        <p className="text-xs text-muted-foreground mb-1">Remaining</p>
        <p className={`text-3xl md:text-4xl font-bold tracking-tight ${isOverrun ? 'text-red-600 dark:text-red-400' : 'text-foreground'}`}>
          {formattedRemaining}
        </p>
      </div>

      <div className="mb-4">
        <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${config.progressBg}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 text-right">{percentage}% spent</p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Total Budget</p>
          <p className="text-base font-semibold text-foreground">{formattedBudget}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-0.5">Total Spent</p>
          <p className="text-base font-semibold text-red-600 dark:text-red-400">{formattedSpent}</p>
        </div>
      </div>
    </div>
  );
}
