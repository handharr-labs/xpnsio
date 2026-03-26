import type { BudgetProgressData } from '@/features/dashboard/domain/services/BudgetProgressService';

export interface CategoryBudgetInfo {
  categoryId: string;
  categoryName: string;
  masterCategory: 'daily' | 'weekly' | 'monthly';
  monthlyBudget: number;
  totalSpent: number;
  remaining: number;
  rolloverAmount: number;               // only meaningful for daily/weekly
  dailyBudget?: number;                 // monthlyBudget / daysInPeriod (daily only)
  accumulatedBudgetToDate?: number;     // dailyBudget × daysElapsed (daily only)
  periodDaysElapsed?: number;           // days elapsed since period start (daily only)
  weeklyBudget?: number;                // monthlyBudget / weeksInPeriod (weekly only)
  accumulatedWeeklyBudget?: number;     // weeklyBudget × weeksElapsed (weekly only)
  periodWeeksElapsed?: number;          // weeks elapsed since period start (weekly only)
  weekStartStr?: string;                // ISO date string of the current week's start (daily/weekly)
  dailyProgress?: BudgetProgressData;
  weeklyProgress?: BudgetProgressData;
  monthlyProgress?: BudgetProgressData;
  spentToday?: number;
  availableToday?: number;
  todayProgress?: BudgetProgressData;
  spentThisWeek?: number;
  availableThisWeek?: number;
  thisWeekProgress?: BudgetProgressData;
}
