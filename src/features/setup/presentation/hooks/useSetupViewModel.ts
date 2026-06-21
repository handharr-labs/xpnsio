'use client';

import { useState } from 'react';
import { completeSetupAction } from '../actions/setup';

export type SetupCategory = {
  name: string;
  masterCategory: 'daily' | 'weekly' | 'monthly';
  color: string;
  icon: string;
  amount: number;
};

const DEFAULT_CATEGORIES: SetupCategory[] = [
  { name: 'Food & Dining', masterCategory: 'daily', color: '#f59e0b', icon: 'food', amount: 0 },
  { name: 'Transport', masterCategory: 'daily', color: '#3b82f6', icon: 'car', amount: 0 },
  { name: 'Shopping', masterCategory: 'monthly', color: '#ec4899', icon: 'shopping', amount: 0 },
  { name: 'Health', masterCategory: 'monthly', color: '#10b981', icon: 'health', amount: 0 },
];

export function useSetupViewModel() {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<SetupCategory[]>(DEFAULT_CATEGORIES);
  const [budgetName, setBudgetName] = useState('My Budget');
  const [currency, setCurrency] = useState('IDR');
  const [startDay, setStartDay] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalAllocated = categories.reduce((sum, c) => sum + (c.amount || 0), 0);

  const addCategory = () => {
    setCategories((prev) => [
      ...prev,
      { name: '', masterCategory: 'monthly', color: '#6366f1', icon: 'circle', amount: 0 },
    ]);
  };

  const updateCategory = (index: number, field: keyof SetupCategory, value: string | number) => {
    setCategories((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  };

  const removeCategory = (index: number) => {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const completeSetup = async (): Promise<void> => {
    setError(null);
    setIsSubmitting(true);
    try {
      const validCategories = categories.filter((c) => c.name.trim());
      const result = await completeSetupAction({
        budgetName,
        currency,
        startDay,
        totalBudget: totalAllocated,
        categories: validCategories,
      });
      if (result?.serverError) {
        throw new Error(result.serverError);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Setup failed. Please try again.';
      setError(msg);
      setIsSubmitting(false);
      throw err;
    }
  };

  return {
    step,
    setStep,
    categories: categories as ReadonlyArray<SetupCategory>,
    budgetName,
    setBudgetName,
    currency,
    setCurrency,
    startDay,
    setStartDay,
    totalAllocated,
    addCategory,
    updateCategory,
    removeCategory,
    isSubmitting,
    error,
    completeSetup,
  };
}
