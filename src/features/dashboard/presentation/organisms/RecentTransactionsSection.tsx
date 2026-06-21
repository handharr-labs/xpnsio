import { ChevronRight } from 'lucide-react';

export interface RecentTransactionVM {
  id: string;
  label: string;
  description?: string;
  formattedAmount: string;
  formattedDate: string;
  variant: 'income' | 'expense';
}

interface RecentTransactionsSectionProps {
  transactions: ReadonlyArray<RecentTransactionVM>;
  onViewAll: () => void;
  onSelect: (id: string) => void;
}

export function RecentTransactionsSection({
  transactions,
  onViewAll,
  onSelect,
}: RecentTransactionsSectionProps) {
  if (transactions.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
        <button
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors min-h-[44px] px-2 -mr-2"
          onClick={onViewAll}
        >
          View all
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="rounded-xl ring-1 ring-border bg-card overflow-hidden divide-y divide-border">
        {transactions.map((tx) => (
          <button
            type="button"
            key={tx.id}
            className="flex items-center gap-3 w-full p-4 text-left hover:bg-muted/50 active:bg-muted transition-colors min-h-[56px]"
            onClick={() => onSelect(tx.id)}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                tx.variant === 'income' ? 'bg-emerald-400' : 'bg-red-400'
              }`}
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{tx.label}</p>
              {tx.description && (
                <p className="text-xs text-muted-foreground truncate">{tx.description}</p>
              )}
            </div>

            <div className="text-right shrink-0">
              <p
                className={`text-sm font-semibold tabular-nums ${
                  tx.variant === 'income' ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {tx.formattedAmount}
              </p>
              <p className="text-xs text-muted-foreground">{tx.formattedDate}</p>
            </div>

            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </button>
        ))}
      </div>
    </section>
  );
}
