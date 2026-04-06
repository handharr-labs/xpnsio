'use client';

import { useState, useEffect } from 'react';
import { getCategoriesAction } from '@/features/categories/presentation/actions/categories';
import {
  getBudgetSettingByIdAction,
  updateBudgetSettingAction,
} from '@/features/budget-settings/presentation/actions/budget-settings';
import {
  createCategoryAction,
  updateCategoryAction,
} from '@/features/categories/presentation/actions/categories';
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
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('IDR');
  const [starterDay, setStarterDay] = useState(1);
  const [items, setItems] = useState<EditableCategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      getBudgetSettingByIdAction({ id: budgetSettingId }),
      getCategoriesAction({}),
    ]).then(([settingResult, catResult]) => {
      const setting = settingResult?.data ?? null;
      const allCategories: Category[] = catResult?.data ?? [];

      if (setting) {
        setName(setting.name);
        setCurrency(setting.currency ?? 'IDR');
        setStarterDay(setting.starterDay ?? 1);
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
      }
      setIsLoading(false);
    });
  }, [budgetSettingId]);

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

      const filteredItems = savedCategories.filter((c) => c.monthlyAmount > 0);
      const totalMonthlyBudget = filteredItems.reduce((s, c) => s + c.monthlyAmount, 0);

      await updateBudgetSettingAction({
        id: budgetSettingId,
        name,
        totalMonthlyBudget,
        currency,
        starterDay,
        items: filteredItems,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update budget setting';
      setError(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: '', masterCategory: 'monthly', color: '#6366f1', icon: 'circle', monthlyAmount: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof EditableCategoryItem, value: string | number) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  return {
    name,
    updateName: (v: string) => setName(v),
    currency,
    updateCurrency: (v: string) => setCurrency(v),
    starterDay,
    updateStarterDay: (v: number) => setStarterDay(v),
    items,
    addItem,
    removeItem,
    updateItem,
    isLoading,
    isSubmitting,
    error,
    saveWithCategories,
  };
}
