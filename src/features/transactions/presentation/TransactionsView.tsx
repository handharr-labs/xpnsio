'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTransactionsViewModel } from './useTransactionsViewModel';
import { getCategoriesAction } from '@/features/categories/presentation/actions/categories';
import { ROUTES } from '@/shared/presentation/navigation/routes';
import { TransactionFilterPanel } from './organisms/TransactionFilterPanel';
import { TransactionListSection } from './organisms/TransactionListSection';
import type { Category } from '@/features/categories/domain/entities/Category';
import type { Transaction } from '@/features/transactions/domain/entities/Transaction';
import type { TransactionFilters } from './organisms/TransactionFilterPanel';

const EMPTY_FILTERS: TransactionFilters = {
  startDate: '',
  endDate: '',
  categoryId: '',
  type: '',
  description: '',
};

export function TransactionsView() {
  const router = useRouter();
  const { transactions, isLoading, error, hasMore, applyFilters, loadMore } =
    useTransactionsViewModel();

  const [categories, setCategories] = useState<Category[]>([]);
  const [localFilters, setLocalFilters] = useState<TransactionFilters>(EMPTY_FILTERS);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getCategoriesAction({}).then((result) => {
      if (result?.data) setCategories(result.data);
    });
  }, []);

  const handleApplyFilters = () => {
    applyFilters({
      startDate: localFilters.startDate || undefined,
      endDate: localFilters.endDate || undefined,
      categoryId: localFilters.categoryId || undefined,
      type: (localFilters.type as 'income' | 'expense') || undefined,
      description: localFilters.description || undefined,
    });
  };

  const clearFilters = () => {
    setLocalFilters(EMPTY_FILTERS);
    applyFilters({});
  };

  const handleFiltersChange = (patch: Partial<TransactionFilters>) => {
    const next = { ...localFilters, ...patch };
    setLocalFilters(next);

    if ('description' in patch) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        applyFilters({
          startDate: next.startDate || undefined,
          endDate: next.endDate || undefined,
          categoryId: next.categoryId || undefined,
          type: (next.type as 'income' | 'expense') || undefined,
          description: patch.description || undefined,
        });
      }, 400);
    }
  };

  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const grouped = transactions.reduce(
    (acc, tx) => {
      (acc[tx.date] ??= []).push(tx);
      return acc;
    },
    {} as Record<string, Transaction[]>
  );
  const dates = Object.keys(grouped);

  return (
    <main className="min-h-screen p-6 pb-24">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Transactions</h1>
        </div>

        {/* Search */}
        <input
          type="search"
          placeholder="Search by description..."
          className="w-full rounded-md border px-3 py-2 text-sm"
          value={localFilters.description}
          onChange={(e) => handleFiltersChange({ description: e.target.value })}
        />

        <TransactionFilterPanel
          categories={categories}
          filters={localFilters}
          onFiltersChange={handleFiltersChange}
          onApply={handleApplyFilters}
          onClear={clearFilters}
        />

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-muted-foreground">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No transactions found.</p>
        ) : (
          <TransactionListSection
            dates={dates}
            grouped={grouped}
            categoryMap={categoryMap}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onSelect={(id) => router.push(ROUTES.transactionDetail(id))}
          />
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
