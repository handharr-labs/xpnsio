'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  getCategoriesAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from '@/app/actions/categories';
import type { Category } from '@/lib/schema';

export function useCategoriesViewModel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const load = async () => {
    setIsLoading(true);
    setError(null);
    const result = await getCategoriesAction({});
    if (result?.data) {
      setCategories(result.data);
    } else if (result?.serverError) {
      setError(result.serverError);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const createCategory = async (input: {
    name: string;
    type: 'income' | 'expense';
    masterCategory?: 'daily' | 'weekly' | 'monthly';
    color: string;
    icon: string;
  }) => {
    setError(null);
    const result = await createCategoryAction(input);
    if (result?.data) {
      setCategories((prev) => [...prev, result.data!]);
      return result.data;
    } else {
      const msg = result?.serverError ?? 'Failed to create category';
      setError(msg);
      throw new Error(msg);
    }
  };

  const updateCategory = async (input: {
    id: string;
    name?: string;
    color?: string;
    icon?: string;
    masterCategory?: 'daily' | 'weekly' | 'monthly';
  }) => {
    setError(null);
    const result = await updateCategoryAction(input);
    if (result?.data) {
      setCategories((prev) =>
        prev.map((c) => (c.id === input.id ? result.data! : c))
      );
      return result.data;
    } else {
      const msg = result?.serverError ?? 'Failed to update category';
      setError(msg);
      throw new Error(msg);
    }
  };

  const deleteCategory = async (id: string, force?: boolean) => {
    setError(null);
    const result = await deleteCategoryAction({ id, force });
    if (result?.data) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } else {
      const msg = result?.serverError ?? 'Failed to delete category';
      setError(msg);
      throw new Error(msg);
    }
  };

  return {
    categories,
    isLoading: isLoading || isPending,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refresh: load,
  };
}
