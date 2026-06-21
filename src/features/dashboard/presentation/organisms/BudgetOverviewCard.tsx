import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@handharr-labs/core';
import type { BudgetStatus } from '@/features/dashboard/domain/entities/BudgetProgressData';

interface BudgetOverviewCardProps {
  totalMonthlyBudget: number;
  totalSpent: number;
  totalRemaining: number;
  budgetStatus: BudgetStatus;
}

const healthConfig: Record<BudgetStatus, {
  bg: string;
  border: string;
  text: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  progressBg: string;
}> = {
  'on-track': {
    bg: 'bg-emerald-500/10',
    border: 'ring-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    label: 'On Track',
    Icon: TrendingUp,
    progressBg: 'bg-emerald-400',
  },
  'at-risk': {
    bg: 'bg-amber-500/10',
    border: 'ring-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    label: 'At Risk',
    Icon: AlertTriangle,
    progressBg: 'bg-amber-400',
  },
  'over': {
    bg: 'bg-red-500/10',
    border: 'ring-red-500/20',
    text: 'text-red-700 dark:text-red-400',
    label: 'Over Budget',
    Icon: TrendingDown,
    progressBg: 'bg-red-400',
  },
};

export function BudgetOverviewCard({
  totalMonthlyBudget,
  totalSpent,
  totalRemaining,
  budgetStatus,
}: BudgetOverviewCardProps) {
  const config = healthConfig[budgetStatus];
  const Icon = config.Icon;
  const percentage = totalMonthlyBudget > 0 ? Math.min(Math.round((totalSpent / totalMonthlyBudget) * 100), 100) : 0;

  return (
    <div className={`rounded-2xl p-5 ring-1 ${config.bg} ${config.border}`}>
      {/* Health Status Badge */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-muted-foreground">Budget Overview</h2>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.text} ${config.bg}`}>
          <Icon className="w-3.5 h-3.5" />
          <span>{config.label}</span>
        </div>
      </div>

      {/* Hero Remaining Amount */}
      <div className="mb-5">
        <p className="text-xs text-muted-foreground mb-1">Remaining</p>
        <p className={`text-3xl md:text-4xl font-bold tracking-tight ${totalRemaining < 0 ? 'text-red-600 dark:text-red-400' : 'text-foreground'}`}>
          {formatCurrency(totalRemaining)}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${config.progressBg}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 text-right">{percentage}% spent</p>
      </div>

      {/* Budget & Spent Row */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Total Budget</p>
          <p className="text-base font-semibold text-foreground">{formatCurrency(totalMonthlyBudget)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-0.5">Total Spent</p>
          <p className="text-base font-semibold text-red-600 dark:text-red-400">{formatCurrency(totalSpent)}</p>
        </div>
      </div>
    </div>
  );
}
