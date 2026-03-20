import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { BudgetSetting } from '@/features/budget-settings/domain/entities/BudgetSetting';

const formatIDR = (amount: number | string) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
    typeof amount === 'string' ? parseFloat(amount) : amount
  );

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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{setting.name}</span>
          <span className="text-base font-normal text-muted-foreground">
            {formatIDR(setting.totalMonthlyBudget)} / month
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {setting.items.length} categor{setting.items.length === 1 ? 'y' : 'ies'} allocated
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(setting.id)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onApply(setting.id)}
            disabled={isApplying}
          >
            {isApplying ? 'Applying...' : 'Apply to This Month'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700"
            onClick={() => onDelete(setting.id, setting.name)}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
