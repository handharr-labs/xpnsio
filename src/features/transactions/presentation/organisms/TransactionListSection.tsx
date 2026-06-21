import { Button, CategoryColorDot } from '@handharr-labs/ui-xpnsio';
import { ChevronRight } from 'lucide-react';

export interface TransactionItemVM {
  id: string;
  label: string;
  description?: string;
  formattedAmount: string;
  variant: 'income' | 'expense';
  categoryColor?: string;
}

export interface TransactionDateGroupVM {
  date: string;
  formattedDate: string;
  items: TransactionItemVM[];
}

interface TransactionListSectionProps {
  groups: TransactionDateGroupVM[];
  hasMore: boolean;
  onLoadMore: () => void;
  onSelect: (id: string) => void;
}

export function TransactionListSection({
  groups,
  hasMore,
  onLoadMore,
  onSelect,
}: TransactionListSectionProps) {
  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.date} className="space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.formattedDate}
            </h3>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="rounded-xl ring-1 ring-border bg-card overflow-hidden divide-y divide-border">
            {group.items.map((tx) => (
              <button
                type="button"
                key={tx.id}
                className="flex items-center gap-3 w-full p-4 text-left hover:bg-muted/50 active:bg-muted transition-colors min-h-[56px] group"
                onClick={() => onSelect(tx.id)}
              >
                <div className="flex-shrink-0">
                  {tx.categoryColor ? (
                    <CategoryColorDot color={tx.categoryColor} size="md" />
                  ) : (
                    <div
                      className={`w-4 h-4 rounded-full ${
                        tx.variant === 'income' ? 'bg-emerald-400' : 'bg-red-400'
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{tx.label}</p>
                  {tx.description && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {tx.description}
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0 text-right">
                  <p
                    className={`text-sm font-semibold tabular-nums ${
                      tx.variant === 'income' ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {tx.formattedAmount}
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </section>
      ))}

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
