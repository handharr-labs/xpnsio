'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDashboardDataAction } from '@/features/dashboard/presentation/actions/dashboard';
import type { DashboardData } from '@/features/dashboard/domain/entities/DashboardData';

export type DashboardViewData = DashboardData & { year: number; month: number };

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function useDashboardViewModel() {
  const now = new Date();

  const [selectedPeriod, setSelectedPeriod] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });

  const [dashboardData, setDashboardData] = useState<DashboardViewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await getDashboardDataAction({ year: selectedPeriod.year, month: selectedPeriod.month });
    if (result?.data) {
      setDashboardData(result.data as DashboardViewData);
    } else if (result?.serverError) {
      setError(result.serverError);
    }
    setIsLoading(false);
  }, [selectedPeriod.year, selectedPeriod.month]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const isCurrentMonth =
    selectedPeriod.year === now.getFullYear() &&
    selectedPeriod.month === now.getMonth() + 1;

  const monthLabel = `${MONTH_NAMES[selectedPeriod.month - 1]} ${selectedPeriod.year}`;

  const goToPrevMonth = () => setSelectedPeriod(({ year, month }) => {
    if (month === 1) return { year: year - 1, month: 12 };
    return { year, month: month - 1 };
  });

  const goToNextMonth = () => setSelectedPeriod(({ year, month }) => {
    if (month === 12) return { year: year + 1, month: 1 };
    return { year, month: month + 1 };
  });

  return {
    dashboardData,
    isLoading,
    error,
    refresh: load,
    monthLabel,
    isCurrentMonth,
    goToPrevMonth,
    goToNextMonth,
  };
}
