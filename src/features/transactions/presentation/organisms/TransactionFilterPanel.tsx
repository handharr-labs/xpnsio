import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Category } from '@/features/categories/domain/entities/Category';

export interface TransactionFilters {
  startDate: string;
  endDate: string;
  categoryId: string;
  type: '' | 'income' | 'expense';
  description: string;
}

interface TransactionFilterPanelProps {
  categories: Category[];
  filters: TransactionFilters;
  onFiltersChange: (patch: Partial<TransactionFilters>) => void;
  onApply: () => void;
  onClear: () => void;
}

export function TransactionFilterPanel({
  categories,
  filters,
  onFiltersChange,
  onApply,
  onClear,
}: TransactionFilterPanelProps) {
  return (
    <Card>
      <CardContent className="pt-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">From</label>
            <input
              type="date"
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={filters.startDate}
              onChange={(e) => onFiltersChange({ startDate: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">To</label>
            <input
              type="date"
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={filters.endDate}
              onChange={(e) => onFiltersChange({ endDate: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Category</label>
            <select
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={filters.categoryId}
              onChange={(e) => onFiltersChange({ categoryId: e.target.value })}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Type</label>
            <select
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={filters.type}
              onChange={(e) =>
                onFiltersChange({ type: e.target.value as '' | 'income' | 'expense' })
              }
            >
              <option value="">All Types</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={onApply} className="flex-1">
            Apply Filters
          </Button>
          <Button size="sm" variant="outline" onClick={onClear}>
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
