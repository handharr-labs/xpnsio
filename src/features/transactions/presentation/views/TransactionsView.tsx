'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, Plus, X } from 'lucide-react';
import { Button, FilterPanel, GroupedListSection } from '@handharr-labs/forge-ui-uno';
import type { DateGroupVM, FilterState } from '@handharr-labs/forge-ui-uno';
import { formatCurrency, formatRelativeDate } from '@handharr-labs/forge-core';
import { ROUTES } from '@/shared/presentation/navigation/routes';
import { useTransactionsViewModel } from '../hooks/useTransactionsViewModel';
import type { Transaction } from '@/features/transactions/domain/entities/Transaction';

const EMPTY_FILTERS: FilterState = {
  startDate: '',
  endDate: '',
  categoryId: '',
  type: '',
  description: '',
};

export function TransactionsView() {
  const router = useRouter();
  const { transactions, categories, currency, isLoading, error, hasMore, applyFilters, loadMore } =
    useTransactionsViewModel();

  const [localFilters, setLocalFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleFiltersChange = (patch: Partial<FilterState>) => {
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
    <main className="min-h-screen">
      {/* Content Container - PWA safe area padding */}
      <div className="px-4 pt-4 pb-[calc(5rem+env(safe-area-inset-bottom))] md:px-6 md:pt-6 md:pb-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Header */}
          <header className="flex items-center justify-between min-h-[44px]">
            <h1 className="typo-page-title">Transactions</h1>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant={showFilters || hasActiveFilters ? 'default' : 'outline'}
              className="h-11 rounded-xl gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && !showFilters && (
                <span className="w-2 h-2 rounded-full bg-current opacity-70" />
              )}
            </Button>
          </header>

          {/* Search Bar - Prominent */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search transactions..."
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-muted/50 ring-1 ring-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              value={localFilters.description}
              onChange={(e) => handleFiltersChange({ description: e.target.value })}
            />
            {localFilters.description && (
              <button
                onClick={() => handleFiltersChange({ description: '' })}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Filter Panel - Collapsible */}
          {showFilters && (
            <FilterPanel
              categoryOptions={categories.map((c) => ({ id: c.id, name: c.name }))}
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
                <div key={i} className="h-16 w-full rounded-xl bg-zinc-800/50 animate-pulse" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            /* Empty State */
            <div className="rounded-2xl ring-1 ring-white/10 bg-zinc-900/50 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-zinc-800 mx-auto flex items-center justify-center">
                <Search className="w-7 h-7 text-zinc-400" />
              </div>
              <div className="space-y-2">
                <p className="typo-section-title text-white">No transactions found</p>
                <p className="text-zinc-400 text-sm max-w-xs mx-auto">
                  {hasActiveFilters || localFilters.description
                    ? 'Try adjusting your filters or search term.'
                    : 'Start tracking your spending by adding your first transaction.'}
                </p>
              </div>
            </div>
          ) : (
            <GroupedListSection
              groups={dates.map((date): DateGroupVM => ({
                date,
                formattedDate: formatRelativeDate(date, 'long'),
                items: grouped[date].map((tx) => {
                  const cat = tx.categoryId ? categoryMap.get(tx.categoryId) : null;
                  const isIncome = tx.type === 'income';
                  return {
                    id: tx.id,
                    label: cat?.name ?? (isIncome ? 'Income' : 'Expense'),
                    description: tx.description ?? undefined,
                    formattedAmount: `${isIncome ? '+' : '-'}${formatCurrency(tx.amount, currency)}`,
                    variant: isIncome ? 'income' as const : 'expense' as const,
                    categoryColor: cat?.color,
                  };
                }),
              }))}
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
