'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTransactionsViewModel } from './useTransactionsViewModel';
import { getCategoriesAction } from '@/app/actions/categories';
import { ROUTES } from '@/presentation/navigation/routes';
import type { Category } from '@/lib/schema';

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

export function TransactionsView() {
  const router = useRouter();
  const { transactions, isLoading, error, filters, setFilters } =
    useTransactionsViewModel();

  const [categories, setCategories] = useState<Category[]>([]);
  const [localFilters, setLocalFilters] = useState({
    startDate: '',
    endDate: '',
    categoryId: '',
    type: '' as '' | 'income' | 'expense',
  });

  useEffect(() => {
    getCategoriesAction({}).then((result) => {
      if (result?.data) setCategories(result.data);
    });
  }, []);

  const applyFilters = () => {
    setFilters({
      startDate: localFilters.startDate || undefined,
      endDate: localFilters.endDate || undefined,
      categoryId: localFilters.categoryId || undefined,
      type: (localFilters.type as 'income' | 'expense') || undefined,
    });
  };

  const clearFilters = () => {
    setLocalFilters({ startDate: '', endDate: '', categoryId: '', type: '' });
    setFilters({});
  };

  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  return (
    <main className="min-h-screen p-6 pb-24">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Transactions</h1>
          <Button onClick={() => router.push(ROUTES.transactionNew)}>+ Add</Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">From</label>
                <input
                  type="date"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={localFilters.startDate}
                  onChange={(e) =>
                    setLocalFilters((f) => ({ ...f, startDate: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">To</label>
                <input
                  type="date"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={localFilters.endDate}
                  onChange={(e) =>
                    setLocalFilters((f) => ({ ...f, endDate: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Category</label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={localFilters.categoryId}
                  onChange={(e) =>
                    setLocalFilters((f) => ({ ...f, categoryId: e.target.value }))
                  }
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
                  value={localFilters.type}
                  onChange={(e) =>
                    setLocalFilters((f) => ({
                      ...f,
                      type: e.target.value as '' | 'income' | 'expense',
                    }))
                  }
                >
                  <option value="">All Types</option>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={applyFilters} className="flex-1">
                Apply Filters
              </Button>
              <Button size="sm" variant="outline" onClick={clearFilters}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-muted-foreground">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No transactions found.
          </p>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => {
              const cat = tx.categoryId ? categoryMap.get(tx.categoryId) : null;
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 cursor-pointer"
                  onClick={() => router.push(ROUTES.transactionDetail(tx.id))}
                >
                  <div className="flex items-center gap-3">
                    {cat && (
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {cat?.name ?? (tx.type === 'income' ? 'Income' : 'Expense')}
                      </p>
                      {tx.description && (
                        <p className="text-xs text-muted-foreground">{tx.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
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
        )}
      </div>

      {/* Floating add button */}
      <button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground text-2xl shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
        onClick={() => router.push(ROUTES.transactionNew)}
        aria-label="Add transaction"
      >
        +
      </button>
    </main>
  );
}
