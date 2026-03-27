'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getDashboardDataAction } from '@/features/dashboard/presentation/actions/dashboard';
import type { DashboardData } from '@/features/dashboard/domain/entities/DashboardData';

export type DashboardViewData = DashboardData & { year: number; month: number };

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getTodayStr(): string {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
}

export function useDashboardViewModel() {
  const now = new Date();

  const [selectedPeriod, setSelectedPeriod] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });

  const [dashboardData, setDashboardData] = useState<DashboardViewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Prevents auto-advance from firing more than once (e.g. on manual navigation).
  const didAutoAdvance = useRef(false);
  // Monotonically-increasing ID so we can discard responses from superseded loads
  // (handles React StrictMode double-invoke and rapid prev/next navigation).
  const loadIdRef = useRef(0);

  const load = useCallback(async () => {
    const id = ++loadIdRef.current;
    setIsLoading(true);
    setError(null);
    const result = await getDashboardDataAction({ year: selectedPeriod.year, month: selectedPeriod.month });

    // Discard stale response — a newer load has already started.
    if (id !== loadIdRef.current) return;

    if (result?.data) {
      const data = result.data as DashboardViewData;

      // On the first load, if today is on or past the period end the current
      // budget period has already rolled over — jump to the next period.
      if (!didAutoAdvance.current && data.periodEnd) {
        const todayStr = getTodayStr();
        if (todayStr >= data.periodEnd) {
          didAutoAdvance.current = true;
          setSelectedPeriod(({ year, month }) => {
            if (month === 12) return { year: year + 1, month: 1 };
            return { year, month: month + 1 };
          });
          // Keep isLoading=true so the skeleton stays visible while the
          // next period loads — avoids a flash of empty/stale content.
          return;
        }
      }
      didAutoAdvance.current = true;
      setDashboardData(data);
    } else if (result?.serverError) {
      setError(result.serverError);
    }
    setIsLoading(false);
  }, [selectedPeriod.year, selectedPeriod.month]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  // A period is "current" when today is strictly before its end date.
  // (periodEnd is treated as exclusive — the starter date belongs to the next period.)
  const todayStr = getTodayStr();
  const isCurrentMonth = dashboardData?.periodEnd !== undefined
    ? todayStr < dashboardData.periodEnd
    : selectedPeriod.year === now.getFullYear() && selectedPeriod.month === now.getMonth() + 1;

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
