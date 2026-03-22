import { ChevronRight } from 'lucide-react';
import type { Transaction } from '@/features/transactions/domain/entities/Transaction';

const formatIDR = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateStr === today.toISOString().split('T')[0]) return 'Today';
  if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';

  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

interface RecentTransactionsSectionProps {
  transactions: Transaction[];
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

      <div className="rounded-xl ring-1 ring-border overflow-hidden divide-y divide-border">
        {transactions.map((tx) => (
          <button
            type="button"
            key={tx.id}
            className="flex items-center gap-3 w-full p-4 text-left hover:bg-muted/50 active:bg-muted transition-colors min-h-[56px]"
            onClick={() => onSelect(tx.id)}
          >
            {/* Color Indicator */}
            <div
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                tx.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'
              }`}
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {tx.categoryName ?? (tx.type === 'income' ? 'Income' : 'Expense')}
              </p>
              {tx.description && (
                <p className="text-xs text-muted-foreground truncate">{tx.description}</p>
              )}
            </div>

            {/* Amount & Date */}
            <div className="text-right shrink-0">
              <p
                className={`text-sm font-semibold tabular-nums ${
                  tx.type === 'income'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {tx.type === 'income' ? '+' : '-'}{formatIDR(tx.amount)}
              </p>
              <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
            </div>

            {/* Chevron */}
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </button>
        ))}
      </div>
    </section>
  );
}
