import { Play, Pencil, Trash2, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BudgetSetting } from '@/features/budget-settings/domain/entities/BudgetSetting';
import { formatCurrency } from '@/shared/core/utils/formatCurrency';

interface BudgetSettingCardProps {
  setting: BudgetSetting;
  isApplying: boolean;
  onApply: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}

export function BudgetSettingCard({
  setting,
  isApplying,
  onApply,
  onEdit,
  onDelete,
}: BudgetSettingCardProps) {
  const categoryCount = setting.items.length;

  return (
    <div className="rounded-2xl ring-1 ring-border bg-card overflow-hidden">
      {/* Header */}
      <div className="p-5 space-y-4">
        {/* Title & Amount */}
        <div className="space-y-1">
          <h3 className="text-lg font-semibold tracking-tight">{setting.name}</h3>
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(typeof setting.totalMonthlyBudget === 'string' ? parseFloat(setting.totalMonthlyBudget) : setting.totalMonthlyBudget, 'IDR')}
            <span className="text-sm font-normal text-muted-foreground">/month</span>
          </p>
        </div>

        {/* Category Count Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 text-xs font-medium text-muted-foreground">
            <Layers className="w-3.5 h-3.5" />
            <span>
              {categoryCount} {categoryCount === 1 ? 'category' : 'categories'}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 pb-5 space-y-3">
        {/* Primary CTA */}
        <Button
          onClick={() => onApply(setting.id)}
          disabled={isApplying}
          className="w-full h-12 rounded-xl gap-2 font-medium"
        >
          <Play className="w-4 h-4" />
          {isApplying ? 'Applying...' : 'Apply to This Month'}
        </Button>

        {/* Secondary Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onEdit(setting.id)}
            className="flex-1 h-11 rounded-xl gap-2"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => onDelete(setting.id, setting.name)}
            className="h-11 rounded-xl gap-2 text-red-600 hover:text-red-700 hover:bg-red-500/10 border-red-200 dark:border-red-500/30"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
