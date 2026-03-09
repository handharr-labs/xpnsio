'use client';

import { useState, useEffect } from 'react';
import {
  getBudgetSettingsAction,
  createBudgetSettingAction,
  updateBudgetSettingAction,
  applyBudgetSettingAction,
  deleteBudgetSettingAction,
} from '@/presentation/features/budget-settings/actions/budget-settings';
import type { BudgetSetting } from '@/domain/entities/BudgetSetting';

export function useBudgetSettingsViewModel() {
  const [budgetSettings, setBudgetSettings] = useState<BudgetSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    const result = await getBudgetSettingsAction({});
    if (result?.data) {
      setBudgetSettings(result.data);
    } else if (result?.serverError) {
      setError(result.serverError);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const createBudgetSetting = async (input: {
    name: string;
    totalMonthlyBudget: number;
    currency?: string;
    items: { categoryId: string; monthlyAmount: number }[];
  }) => {
    setError(null);
    const result = await createBudgetSettingAction(input);
    if (result?.data) {
      await load();
      return result.data;
    } else {
      const msg = result?.serverError ?? 'Failed to create budget setting';
      setError(msg);
      throw new Error(msg);
    }
  };

  const updateBudgetSetting = async (input: {
    id: string;
    name?: string;
    totalMonthlyBudget?: number;
    currency?: string;
    items?: { categoryId: string; monthlyAmount: number }[];
  }) => {
    setError(null);
    const result = await updateBudgetSettingAction(input);
    if (result?.data) {
      await load();
      return result.data;
    } else {
      const msg = result?.serverError ?? 'Failed to update budget setting';
      setError(msg);
      throw new Error(msg);
    }
  };

  const applyBudgetSetting = async (input: {
    budgetSettingId: string;
    year: number;
    month: number;
  }) => {
    setError(null);
    const result = await applyBudgetSettingAction(input);
    if (result?.data) {
      return result.data;
    } else {
      const msg = result?.serverError ?? 'Failed to apply budget setting';
      setError(msg);
      throw new Error(msg);
    }
  };

  const deleteBudgetSetting = async (id: string) => {
    setError(null);
    const result = await deleteBudgetSettingAction({ id });
    if (result?.data) {
      setBudgetSettings((prev) => prev.filter((s) => s.id !== id));
    } else {
      const msg = result?.serverError ?? 'Failed to delete budget setting';
      setError(msg);
      throw new Error(msg);
    }
  };

  return {
    budgetSettings,
    isLoading,
    error,
    createBudgetSetting,
    updateBudgetSetting,
    applyBudgetSetting,
    deleteBudgetSetting,
    refresh: load,
  };
}
