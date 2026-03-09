'use client';

import { useState } from 'react';
import { createCategoryAction } from '@/presentation/features/categories/actions/categories';
import {
  createBudgetSettingAction,
  applyBudgetSettingAction,
} from '@/presentation/features/budget-settings/actions/budget-settings';

export type SetupCategory = {
  name: string;
  masterCategory: 'daily' | 'weekly' | 'monthly';
  color: string;
  icon: string;
  amount: number;
};

export function useSetupViewModel() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeSetup = async (input: {
    categories: SetupCategory[];
    budgetName: string;
    currency: string;
    totalBudget: number;
  }) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const createdIds: Array<{ id: string; amount: number }> = [];
      for (const cat of input.categories) {
        if (!cat.name.trim()) continue;
        const result = await createCategoryAction({
          name: cat.name.trim(),
          masterCategory: cat.masterCategory,
          color: cat.color,
          icon: cat.icon,
        });
        if (result?.data) {
          createdIds.push({ id: result.data.id, amount: cat.amount });
        }
      }

      const totalAllocated = input.categories.reduce((sum, c) => sum + (c.amount || 0), 0);

      const settingResult = await createBudgetSettingAction({
        name: input.budgetName.trim() || 'My Budget',
        totalMonthlyBudget: input.totalBudget || totalAllocated,
        currency: input.currency,
        items: createdIds
          .filter((c) => c.amount > 0)
          .map((c) => ({ categoryId: c.id, monthlyAmount: c.amount })),
      });

      if (!settingResult?.data) {
        throw new Error(settingResult?.serverError ?? 'Failed to create budget setting');
      }

      const now = new Date();
      await applyBudgetSettingAction({
        budgetSettingId: settingResult.data.id,
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Setup failed. Please try again.';
      setError(msg);
      setIsSubmitting(false);
      throw err;
    }
  };

  return {
    isSubmitting,
    error,
    completeSetup,
  };
}
