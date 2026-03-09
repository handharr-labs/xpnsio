'use client';

import { useState } from 'react';
import { createCategoryAction } from '@/features/categories/presentation/actions/categories';
import { createBudgetSettingAction } from '@/features/budget-settings/presentation/actions/budget-settings';
import type { BudgetSetting } from '@/features/budget-settings/domain/entities/BudgetSetting';

export function useBudgetSettingNewViewModel() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBudgetSettingWithCategories = async (input: {
    name: string;
    currency: string;
    starterDay: number;
    items: Array<{
      name: string;
      masterCategory: 'daily' | 'weekly' | 'monthly';
      color: string;
      icon: string;
      monthlyAmount: number;
    }>;
  }): Promise<BudgetSetting> => {
    setError(null);
    setIsSubmitting(true);
    try {
      const savedCategories: { categoryId: string; monthlyAmount: number }[] = [];
      for (const item of input.items) {
        if (!item.name.trim()) continue;
        const result = await createCategoryAction({
          name: item.name.trim(),
          masterCategory: item.masterCategory,
          color: item.color,
          icon: item.icon,
        });
        if (result?.data) {
          savedCategories.push({ categoryId: result.data.id, monthlyAmount: item.monthlyAmount });
        }
      }

      const filteredItems = savedCategories.filter((c) => c.monthlyAmount > 0);
      const totalMonthlyBudget = filteredItems.reduce((s, i) => s + i.monthlyAmount, 0);

      const result = await createBudgetSettingAction({
        name: input.name,
        totalMonthlyBudget,
        currency: input.currency,
        starterDay: input.starterDay,
        items: filteredItems,
      });

      if (!result?.data) {
        throw new Error(result?.serverError ?? 'Failed to create budget setting');
      }
      return result.data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create budget setting';
      setError(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    createBudgetSettingWithCategories,
  };
}
