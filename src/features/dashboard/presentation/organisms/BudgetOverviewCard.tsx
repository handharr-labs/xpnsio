import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formatIDR = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

interface BudgetOverviewCardProps {
  totalMonthlyBudget: number;
  totalSpent: number;
  totalRemaining: number;
}

export function BudgetOverviewCard({
  totalMonthlyBudget,
  totalSpent,
  totalRemaining,
}: BudgetOverviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Budget</p>
            <p className="text-sm font-semibold">{formatIDR(totalMonthlyBudget)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Spent</p>
            <p className="text-sm font-semibold text-red-600">{formatIDR(totalSpent)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Remaining</p>
            <p className={`text-sm font-semibold ${totalRemaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatIDR(totalRemaining)}
            </p>
          </div>
        </div>

        {totalMonthlyBudget > 0 && (
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all bg-blue-500"
              style={{ width: `${Math.min(Math.floor((totalSpent / totalMonthlyBudget) * 100), 100)}%` }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
