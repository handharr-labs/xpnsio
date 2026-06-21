'use client';

import { Button } from '@handharr-labs/ui-xpnsio';
import { Calendar, Tag, ArrowDownUp } from 'lucide-react';
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
  const hasFilters = filters.startDate || filters.endDate || filters.categoryId || filters.type;

  return (
    <div className="rounded-xl ring-1 ring-border bg-card p-4 space-y-4">
      {/* Date Range */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>Date Range</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">From</label>
            <input
              type="date"
              className="w-full h-11 rounded-lg bg-muted/50 ring-1 ring-border px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              value={filters.startDate}
              onChange={(e) => onFiltersChange({ startDate: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">To</label>
            <input
              type="date"
              className="w-full h-11 rounded-lg bg-muted/50 ring-1 ring-border px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              value={filters.endDate}
              onChange={(e) => onFiltersChange({ endDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Category & Type */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Tag className="w-3.5 h-3.5" />
            <span>Category</span>
          </div>
          <select
            className="w-full h-11 rounded-lg bg-muted/50 ring-1 ring-border px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
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
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <ArrowDownUp className="w-3.5 h-3.5" />
            <span>Type</span>
          </div>
          <select
            className="w-full h-11 rounded-lg bg-muted/50 ring-1 ring-border px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
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

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          size="lg"
          onClick={onApply}
          className="flex-1 h-11 rounded-lg font-medium"
        >
          Apply Filters
        </Button>
        {hasFilters && (
          <Button
            size="lg"
            variant="outline"
            onClick={onClear}
            className="h-11 rounded-lg font-medium px-6"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
