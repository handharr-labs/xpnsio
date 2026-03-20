import type { Transaction } from '@/features/transactions/domain/entities/Transaction';

const formatIDR = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Recent Transactions</h2>
        <button className="text-sm text-primary hover:underline" onClick={onViewAll}>
          View all
        </button>
      </div>
      <div className="space-y-2">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 cursor-pointer"
            onClick={() => onSelect(tx.id)}
          >
            <div>
              <p className="text-sm font-medium">
                {tx.categoryName ?? (tx.type === 'income' ? 'Income' : 'Expense')}
              </p>
              {tx.description && (
                <p className="text-xs text-muted-foreground">{tx.description}</p>
              )}
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {tx.type === 'income' ? '+' : '-'}{formatIDR(tx.amount)}
              </p>
              <p className="text-xs text-muted-foreground">{tx.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
