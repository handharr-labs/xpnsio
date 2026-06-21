import { Play, Pencil, Trash2, Layers } from 'lucide-react';
import { Button } from '@handharr-labs/ui-xpnsio';

export interface BudgetSettingCardVM {
  id: string;
  name: string;
  formattedBudget: string;
  categoryCountLabel: string;
}

interface BudgetSettingCardProps {
  setting: BudgetSettingCardVM;
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
  return (
    <div className="rounded-2xl ring-1 ring-border bg-card overflow-hidden">
      <div className="p-5 space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold tracking-tight">{setting.name}</h3>
          <p className="text-2xl font-bold text-primary">
            {setting.formattedBudget}
            <span className="text-sm font-normal text-muted-foreground">/month</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 text-xs font-medium text-muted-foreground">
            <Layers className="w-3.5 h-3.5" />
            <span>{setting.categoryCountLabel}</span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 space-y-3">
        <Button
          onClick={() => onApply(setting.id)}
          disabled={isApplying}
          className="w-full h-12 rounded-xl gap-2 font-medium"
        >
          <Play className="w-4 h-4" />
          {isApplying ? 'Applying...' : 'Apply to This Month'}
        </Button>

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
            className="h-11 rounded-xl gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-500/10 border-red-200 dark:border-red-500/30"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
