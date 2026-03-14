'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getTransactionsAction,
  createTransactionAction,
  updateTransactionAction,
  deleteTransactionAction,
} from '@/features/transactions/presentation/actions/transactions';
import type { Transaction } from '@/features/transactions/domain/entities/Transaction';

const PAGE_SIZE = 20;

export type TransactionFilters = {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  type?: 'income' | 'expense';
  description?: string;
};

export function useTransactionsViewModel() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [hasMore, setHasMore] = useState(false);

  const load = useCallback(async (currentFilters: TransactionFilters = {}) => {
    setIsLoading(true);
    setError(null);
    const result = await getTransactionsAction({ ...currentFilters, limit: PAGE_SIZE, offset: 0 });
    if (result?.data) {
      setTransactions(result.data);
      setHasMore(result.data.length === PAGE_SIZE);
    } else if (result?.serverError) {
      setError(result.serverError);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(filters);
  }, [filters, load]);

  const loadMore = async () => {
    const result = await getTransactionsAction({
      ...filters,
      limit: PAGE_SIZE,
      offset: transactions.length,
    });
    if (result?.data) {
      setTransactions((prev) => [...prev, ...result.data!]);
      setHasMore(result.data.length === PAGE_SIZE);
    } else if (result?.serverError) {
      setError(result.serverError);
    }
  };

  const createTransaction = async (input: {
    categoryId?: string;
    amount: number;
    type: 'income' | 'expense';
    description?: string;
    date: string;
  }) => {
    setError(null);
    const result = await createTransactionAction(input);
    if (result?.data) {
      setTransactions((prev) => [result.data!, ...prev]);
      return result.data;
    } else {
      const msg = result?.serverError ?? 'Failed to create transaction';
      setError(msg);
      throw new Error(msg);
    }
  };

  const updateTransaction = async (input: {
    id: string;
    categoryId?: string;
    amount?: number;
    type?: 'income' | 'expense';
    description?: string;
    date?: string;
  }) => {
    setError(null);
    const result = await updateTransactionAction(input);
    if (result?.data) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === input.id ? result.data! : t))
      );
      return result.data;
    } else {
      const msg = result?.serverError ?? 'Failed to update transaction';
      setError(msg);
      throw new Error(msg);
    }
  };

  const deleteTransaction = async (id: string) => {
    setError(null);
    const result = await deleteTransactionAction({ id });
    if (result?.data) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } else {
      const msg = result?.serverError ?? 'Failed to delete transaction';
      setError(msg);
      throw new Error(msg);
    }
  };

  const applyFilters = (newFilters: TransactionFilters) => {
    setFilters(newFilters);
  };

  return {
    transactions,
    isLoading,
    error,
    filters,
    hasMore,
    applyFilters,
    loadMore,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refresh: () => load(filters),
  };
}
