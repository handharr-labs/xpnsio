'use client';

import { useState, useEffect } from 'react';
import { createTransactionAction } from '@/presentation/features/transactions/actions/transactions';
import { getCategoriesAction } from '@/presentation/features/categories/actions/categories';
import type { Category } from '@/domain/entities/Category';

export function useTransactionNewViewModel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategoriesAction({}).then((result) => {
      if (result?.data) setCategories(result.data);
    });
  }, []);

  const createTransaction = async (input: {
    amount: number;
    type: 'income' | 'expense';
    categoryId?: string;
    description?: string;
    date: string;
  }) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await createTransactionAction(input);
      if (result?.data) {
        return result.data;
      } else {
        const msg = result?.serverError ?? 'Failed to create transaction';
        setError(msg);
        throw new Error(msg);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create transaction';
      setError(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    categories,
    isSubmitting,
    error,
    createTransaction,
  };
}
