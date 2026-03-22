'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, Plus, X } from 'lucide-react';
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
  const [showFilters, setShowFilters] = useState(false);

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

  const hasActiveFilters = localFilters.startDate || localFilters.endDate || localFilters.categoryId || localFilters.type;

  return (
    <main className="min-h-screen bg-zinc-950 dark">
      {/* Content Container - PWA safe area padding */}
      <div className="px-4 pt-4 pb-[calc(5rem+env(safe-area-inset-bottom))] md:px-6 md:pt-6 md:pb-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Header */}
          <header className="flex items-center justify-between min-h-[44px]">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">Transactions</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                showFilters || hasActiveFilters
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && !showFilters && (
                <span className="w-2 h-2 rounded-full bg-primary-foreground" />
              )}
            </button>
          </header>

          {/* Search Bar - Prominent */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="search"
              placeholder="Search transactions..."
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-zinc-900/50 ring-1 ring-white/10 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              value={localFilters.description}
              onChange={(e) => handleFiltersChange({ description: e.target.value })}
            />
            {localFilters.description && (
              <button
                onClick={() => handleFiltersChange({ description: '' })}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-zinc-800"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            )}
          </div>

          {/* Filter Panel - Collapsible */}
          {showFilters && (
            <TransactionFilterPanel
              categories={categories}
              filters={localFilters}
              onFiltersChange={handleFiltersChange}
              onApply={handleApplyFilters}
              onClear={clearFilters}
            />
          )}

          {/* Error State */}
          {error && (
            <div className="rounded-xl bg-red-500/10 ring-1 ring-red-500/20 p-4 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-zinc-800/50 animate-pulse" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            /* Empty State */
            <div className="rounded-2xl ring-1 ring-white/10 bg-zinc-900/50 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-zinc-800 mx-auto flex items-center justify-center">
                <Search className="w-7 h-7 text-zinc-400" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-white">No transactions found</p>
                <p className="text-zinc-400 text-sm max-w-xs mx-auto">
                  {hasActiveFilters || localFilters.description
                    ? 'Try adjusting your filters or search term.'
                    : 'Start tracking your spending by adding your first transaction.'}
                </p>
              </div>
            </div>
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
      </div>

      {/* Floating Add Button - PWA safe area */}
      <button
        className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-6 md:bottom-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        onClick={() => router.push(ROUTES.transactionNew)}
        aria-label="Add transaction"
      >
        <Plus className="w-6 h-6" />
      </button>
    </main>
  );
}
