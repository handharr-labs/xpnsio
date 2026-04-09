export interface DailyBudgetInput {
  readonly monthlyBudget: number;
  readonly daysInMonth: number;
  readonly transactions: ReadonlyArray<{ readonly date: string; readonly amount: number }>; // YYYY-MM-DD, expense amounts
  readonly today: string; // YYYY-MM-DD
  readonly monthStart: string; // YYYY-MM-DD (first day of month)
}

export interface WeeklyBudgetInput {
  readonly monthlyBudget: number;
  readonly weeksInMonth: number; // approximate (use 4.33 or compute from month)
  readonly transactions: ReadonlyArray<{ readonly date: string; readonly amount: number }>;
  readonly today: string;
  readonly monthStart: string;
}

export interface MonthlyBudgetInput {
  readonly monthlyBudget: number;
  readonly transactions: ReadonlyArray<{ readonly amount: number }>;
}

export interface ComputeTodayAvailableInput {
  readonly accumulatedBudgetToDate: number;
  readonly transactions: ReadonlyArray<{ readonly date: string; readonly amount: number }>;
  readonly today: string;
}

export interface ComputeThisWeekAvailableInput {
  readonly accumulatedWeeklyBudget: number;
  readonly transactions: ReadonlyArray<{ readonly date: string; readonly amount: number }>;
  readonly weekStartStr: string;
  readonly today: string;
}

export interface BudgetComputationService {
  computeDailyRemaining(input: DailyBudgetInput): number;
  computeWeeklyRemaining(input: WeeklyBudgetInput): number;
  computeMonthlyRemaining(input: MonthlyBudgetInput): number;
  computeRolloverAmount(input: DailyBudgetInput): number;
  getDaysInMonth(year: number, month: number): number;
  getPeriodBounds(year: number, month: number, starterDay: number): {
    periodStart: string;   // YYYY-MM-DD
    periodEnd: string;     // YYYY-MM-DD
    daysInPeriod: number;
  };
  /**
   * Compute the ISO date string of a week's start.
   * - For past periods: the start of the last 7-day window ending at effectiveToday.
   * - For current periods: the start of the nth week (1-based) within the period.
   */
  getWeekStart(params: {
    isPastPeriod: boolean;
    effectiveToday: string;
    periodStart: string;
    weekNumber: number; // 1-based, only used when isPastPeriod=false
  }): string;
  computeTodayAvailable(input: ComputeTodayAvailableInput): { spentToday: number; availableToday: number };
  computeThisWeekAvailable(input: ComputeThisWeekAvailableInput): { spentThisWeek: number; availableThisWeek: number };
  /** Days from periodStart to today, inclusive (1-based). */
  computeDaysElapsed(periodStart: string, today: string): number;
  /** Weeks from periodStart to today, rounded (1-based). */
  computeWeeksElapsed(periodStart: string, today: string): number;
}

