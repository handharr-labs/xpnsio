import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { CategoryColorDot } from '@/shared/presentation/common/atoms/CategoryColorDot';
import type { Transaction } from '@/features/transactions/domain/entities/Transaction';
import type { Category } from '@/features/categories/domain/entities/Category';
import { formatCurrency } from '@/shared/core/utils/formatCurrency';
import { formatRelativeDate } from '@/shared/core/utils/formatRelativeDate';

interface TransactionListSectionProps {
  dates: string[];
  grouped: Record<string, Transaction[]>;
  categoryMap: Map<string, Category>;
  hasMore: boolean;
  onLoadMore: () => void;
  onSelect: (id: string) => void;
}

export function TransactionListSection({
  dates,
  grouped,
  categoryMap,
  hasMore,
  onLoadMore,
  onSelect,
}: TransactionListSectionProps) {
  return (
    <div className="space-y-6">
      {dates.map((date) => (
        <section key={date} className="space-y-2">
          {/* Date Header */}
          <div className="flex items-center gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {formatRelativeDate(date, 'long')}
            </h3>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Transaction List */}
          <div className="rounded-xl ring-1 ring-border bg-card overflow-hidden divide-y divide-border">
            {grouped[date].map((tx) => {
              const cat = tx.categoryId ? categoryMap.get(tx.categoryId) : null;
              const isIncome = tx.type === 'income';

              return (
                <button
                  type="button"
                  key={tx.id}
                  className="flex items-center gap-3 w-full p-4 text-left hover:bg-muted/50 active:bg-muted transition-colors min-h-[56px] group"
                  onClick={() => onSelect(tx.id)}
                >
                  {/* Color Indicator */}
                  <div className="flex-shrink-0">
                    {cat ? (
                      <CategoryColorDot color={cat.color} size="md" />
                    ) : (
                      <div
                        className={`w-4 h-4 rounded-full ${
                          isIncome ? 'bg-emerald-400' : 'bg-red-400'
                        }`}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {cat?.name ?? (isIncome ? 'Income' : 'Expense')}
                    </p>
                    {tx.description && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {tx.description}
                      </p>
                    )}
                  </div>

                  {/* Amount */}
                  <div className="flex-shrink-0 text-right">
                    <p
                      className={`text-sm font-semibold tabular-nums ${
                        isIncome ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-300'
                      }`}
                    >
                      {isIncome ? '+' : '-'}{formatCurrency(typeof tx.amount === 'string' ? parseFloat(tx.amount) : tx.amount, 'IDR')}
                    </p>
                  </div>

                  {/* Chevron */}
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>
        </section>
      ))}

      {/* Load More */}
      {hasMore && (
        <Button
          variant="outline"
          className="w-full h-12 rounded-xl font-medium"
          onClick={onLoadMore}
        >
          Load more transactions
        </Button>
      )}
    </div>
  );
}
