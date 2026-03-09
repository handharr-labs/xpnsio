'use client';

import { useState, useEffect } from 'react';
import { getCategoriesAction } from '@/features/categories/presentation/actions/categories';
import {
  createCategoryAction,
  updateCategoryAction,
} from '@/features/categories/presentation/actions/categories';
import { useBudgetSettingsViewModel } from './useBudgetSettingsViewModel';
import type { Category } from '@/features/categories/domain/entities/Category';

export type EditableCategoryItem = {
  id?: string;
  name: string;
  masterCategory: 'daily' | 'weekly' | 'monthly';
  color: string;
  icon: string;
  monthlyAmount: number;
};

export function useBudgetSettingEditViewModel(budgetSettingId: string) {
  const { budgetSettings, isLoading, updateBudgetSetting } = useBudgetSettingsViewModel();

  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('IDR');
  const [totalMonthlyBudget, setTotalMonthlyBudget] = useState(0);
  const [items, setItems] = useState<EditableCategoryItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!isLoading && !initialized) {
      const setting = budgetSettings.find((s) => s.id === budgetSettingId);
      if (setting) {
        setName(setting.name);
        setCurrency(setting.currency ?? 'IDR');
        setTotalMonthlyBudget(setting.totalMonthlyBudget);

        getCategoriesAction({}).then((catResult) => {
          const allCategories: Category[] = catResult?.data ?? [];
          setItems(
            setting.items.map((item) => {
              const cat = allCategories.find((c) => c.id === item.categoryId);
              return {
                id: item.categoryId,
                name: cat?.name ?? item.categoryName,
                masterCategory: cat?.masterCategory ?? item.masterCategory ?? 'monthly',
                color: cat?.color ?? '#6366f1',
                icon: cat?.icon ?? 'circle',
                monthlyAmount: item.monthlyAmount,
              };
            })
          );
          setInitialized(true);
        });
      }
    }
  }, [budgetSettings, isLoading, budgetSettingId, initialized]);

  const saveWithCategories = async (saveItems: EditableCategoryItem[]) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const savedCategories: { categoryId: string; monthlyAmount: number }[] = [];
      for (const item of saveItems) {
        if (!item.name.trim()) continue;
        if (item.id) {
          await updateCategoryAction({
            id: item.id,
            name: item.name.trim(),
            masterCategory: item.masterCategory,
            color: item.color,
            icon: item.icon,
          });
          savedCategories.push({ categoryId: item.id, monthlyAmount: item.monthlyAmount });
        } else {
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
      }

      await updateBudgetSetting({
        id: budgetSettingId,
        name,
        totalMonthlyBudget,
        currency,
        items: savedCategories.filter((c) => c.monthlyAmount > 0),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update budget setting';
      setError(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    name,
    updateName: (v: string) => setName(v),
    currency,
    updateCurrency: (v: string) => setCurrency(v),
    totalMonthlyBudget,
    updateTotalMonthlyBudget: (v: number) => setTotalMonthlyBudget(v),
    items,
    updateItems: (v: EditableCategoryItem[]) => setItems(v),
    isLoading: isLoading && !initialized,
    isSubmitting,
    error,
    saveWithCategories,
  };
}
