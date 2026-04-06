import type { BudgetProgressData } from '@/features/dashboard/domain/entities/BudgetProgressData';

export interface CategoryBudgetInfo {
  readonly categoryId: string;
  readonly categoryName: string;
  readonly masterCategory: 'daily' | 'weekly' | 'monthly';
  readonly monthlyBudget: number;
  readonly totalSpent: number;
  readonly remaining: number;
  readonly rolloverAmount: number;               // only meaningful for daily/weekly
  readonly dailyBudget?: number;                 // monthlyBudget / daysInPeriod (daily only)
  readonly accumulatedBudgetToDate?: number;     // dailyBudget × daysElapsed (daily only)
  readonly periodDaysElapsed?: number;           // days elapsed since period start (daily only)
  readonly weeklyBudget?: number;                // monthlyBudget / weeksInPeriod (weekly only)
  readonly accumulatedWeeklyBudget?: number;     // weeklyBudget × weeksElapsed (weekly only)
  readonly periodWeeksElapsed?: number;          // weeks elapsed since period start (weekly only)
  readonly weekStartStr?: string;                // ISO date string of the current week's start (daily/weekly)
  readonly dailyProgress?: BudgetProgressData;
  readonly weeklyProgress?: BudgetProgressData;
  readonly monthlyProgress?: BudgetProgressData;
  readonly spentToday?: number;
  readonly availableToday?: number;
  readonly todayProgress?: BudgetProgressData;
  readonly spentThisWeek?: number;
  readonly availableThisWeek?: number;
  readonly thisWeekProgress?: BudgetProgressData;
}
