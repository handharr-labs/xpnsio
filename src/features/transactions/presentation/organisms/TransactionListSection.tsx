import { Button } from '@/components/ui/button';
import { CategoryColorDot } from '@/shared/presentation/common/atoms/CategoryColorDot';
import type { Transaction } from '@/features/transactions/domain/entities/Transaction';
import type { Category } from '@/features/categories/domain/entities/Category';

const formatIDR = (amount: number | string) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
    typeof amount === 'string' ? parseFloat(amount) : amount
  );

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

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
    <div className="space-y-4">
      {dates.map((date) => (
        <div key={date}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">
            {formatDate(date)}
          </p>
          <div className="space-y-2">
            {grouped[date].map((tx) => {
              const cat = tx.categoryId ? categoryMap.get(tx.categoryId) : null;
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 cursor-pointer"
                  onClick={() => onSelect(tx.id)}
                >
                  <div className="flex items-center gap-3">
                    {cat && <CategoryColorDot color={cat.color} />}
                    <div>
                      <p className="text-sm font-medium">
                        {cat?.name ?? (tx.type === 'income' ? 'Income' : 'Expense')}
                      </p>
                      {tx.description && (
                        <p className="text-xs text-muted-foreground">{tx.description}</p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}{formatIDR(tx.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {hasMore && (
        <Button variant="outline" className="w-full" onClick={onLoadMore}>
          Load more
        </Button>
      )}
    </div>
  );
}
