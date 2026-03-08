'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDashboardDataAction } from '@/app/actions/dashboard';

type CategorySpending = {
  category: {
    id: string;
    name: string;
    masterCategory: 'daily' | 'weekly' | 'monthly';
    color: string;
    icon: string;
  };
  budgetAmount: number;
  spent: number;
  remaining: number;
};

type DashboardData = {
  year: number;
  month: number;
  currency: string;
  activeBudgetSetting: {
    id: string;
    name: string;
    totalMonthlyBudget: string;
    currency: string;
  } | null;
  totalIncome: number;
  totalExpense: number;
  totalBudget: number;
  remaining: number;
  categorySpending: CategorySpending[];
  recentTransactions: Array<{
    id: string;
    amount: string;
    type: 'income' | 'expense';
    description: string | null;
    date: string;
    category: {
      id: string;
      name: string;
      color: string;
      icon: string;
    } | null;
  }>;
};

export function useDashboardViewModel(year?: number, month?: number) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await getDashboardDataAction({ year, month });
    if (result?.data) {
      setDashboardData(result.data as DashboardData);
    } else if (result?.serverError) {
      setError(result.serverError);
    }
    setIsLoading(false);
  }, [year, month]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    dashboardData,
    isLoading,
    error,
    refresh: load,
  };
}
