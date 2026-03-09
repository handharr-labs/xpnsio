'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDashboardDataAction } from '@/features/dashboard/presentation/actions/dashboard';
import type { DashboardData } from '@/features/dashboard/domain/use-cases/dashboard/GetDashboardDataUseCase';

export type DashboardViewData = DashboardData & { year: number; month: number };

export function useDashboardViewModel(year?: number, month?: number) {
  const [dashboardData, setDashboardData] = useState<DashboardViewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await getDashboardDataAction({ year, month });
    if (result?.data) {
      setDashboardData(result.data as DashboardViewData);
    } else if (result?.serverError) {
      setError(result.serverError);
    }
    setIsLoading(false);
  }, [year, month]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return {
    dashboardData,
    isLoading,
    error,
    refresh: load,
  };
}
