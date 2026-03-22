import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/shared/core/utils/formatCurrency';

interface BudgetOverviewCardProps {
  totalMonthlyBudget: number;
  totalSpent: number;
  totalRemaining: number;
}

type BudgetHealth = 'on-track' | 'at-risk' | 'over';

function getBudgetHealth(spent: number, budget: number): BudgetHealth {
  if (budget === 0) return 'on-track';
  const percentage = (spent / budget) * 100;
  if (percentage > 100) return 'over';
  if (percentage > 80) return 'at-risk';
  return 'on-track';
}

const healthConfig = {
  'on-track': {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    border: 'ring-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    label: 'On Track',
    Icon: TrendingUp,
    progressBg: 'bg-emerald-500',
  },
  'at-risk': {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    border: 'ring-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    label: 'At Risk',
    Icon: AlertTriangle,
    progressBg: 'bg-amber-500',
  },
  'over': {
    bg: 'bg-red-500/10 dark:bg-red-500/20',
    border: 'ring-red-500/20',
    text: 'text-red-700 dark:text-red-400',
    label: 'Over Budget',
    Icon: TrendingDown,
    progressBg: 'bg-red-500',
  },
};

export function BudgetOverviewCard({
  totalMonthlyBudget,
  totalSpent,
  totalRemaining,
}: BudgetOverviewCardProps) {
  const health = getBudgetHealth(totalSpent, totalMonthlyBudget);
  const config = healthConfig[health];
  const Icon = config.Icon;
  const percentage = totalMonthlyBudget > 0 ? Math.min(Math.round((totalSpent / totalMonthlyBudget) * 100), 100) : 0;

  return (
    <div className={`rounded-2xl p-5 ring-1 ${config.bg} ${config.border}`}>
      {/* Health Status Badge */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-zinc-300">Budget Overview</h2>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.text} ${config.bg}`}>
          <Icon className="w-3.5 h-3.5" />
          <span>{config.label}</span>
        </div>
      </div>

      {/* Hero Remaining Amount */}
      <div className="mb-5">
        <p className="text-xs text-zinc-300 mb-1">Remaining</p>
        <p className={`text-3xl md:text-4xl font-bold tracking-tight ${totalRemaining < 0 ? 'text-red-400' : 'text-white'}`}>
          {formatCurrency(totalRemaining)}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${config.progressBg}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-zinc-300 mt-1.5 text-right">{percentage}% spent</p>
      </div>

      {/* Budget & Spent Row */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
        <div>
          <p className="text-xs text-zinc-300 mb-0.5">Total Budget</p>
          <p className="text-base font-semibold text-white">{formatCurrency(totalMonthlyBudget)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-300 mb-0.5">Total Spent</p>
          <p className="text-base font-semibold text-red-400">{formatCurrency(totalSpent)}</p>
        </div>
      </div>
    </div>
  );
}
