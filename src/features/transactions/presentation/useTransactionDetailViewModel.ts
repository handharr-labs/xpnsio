'use client';

import { useState, useEffect } from 'react';
import {
  getTransactionsAction,
  updateTransactionAction,
  deleteTransactionAction,
} from '@/features/transactions/presentation/actions/transactions';
import { getCategoriesAction } from '@/features/categories/presentation/actions/categories';
import type { Transaction } from '@/features/transactions/domain/entities/Transaction';
import type { Category } from '@/features/categories/domain/entities/Category';

export function useTransactionDetailViewModel(id: string) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currency] = useState('IDR');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      getTransactionsAction({}),
      getCategoriesAction({}),
    ]).then(([txResult, catResult]) => {
      if (txResult?.data) {
        const found = txResult.data.find((t) => t.id === id) ?? null;
        setTransaction(found);
      }
      if (catResult?.data) setCategories(catResult.data);
      setIsLoading(false);
    });
  }, [id]);

  const updateTransaction = async (input: {
    amount: number;
    type: 'income' | 'expense';
    categoryId?: string;
    description?: string;
    date: string;
  }) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await updateTransactionAction({ id, ...input });
      if (result?.data) {
        setTransaction(result.data);
        return result.data;
      } else {
        const msg = result?.serverError ?? 'Failed to update';
        setError(msg);
        throw new Error(msg);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update';
      setError(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteTransaction = async () => {
    setError(null);
    try {
      await deleteTransactionAction({ id });
    } catch {
      setError('Failed to delete transaction');
      throw new Error('Failed to delete transaction');
    }
  };

  return {
    transaction,
    categories,
    currency,
    isLoading,
    isSubmitting,
    error,
    updateTransaction,
    deleteTransaction,
  };
}
