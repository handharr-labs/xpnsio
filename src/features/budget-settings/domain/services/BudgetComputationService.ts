export interface DailyBudgetInput {
  monthlyBudget: number;
  daysInMonth: number;
  transactions: Array<{ date: string; amount: number }>; // YYYY-MM-DD, expense amounts
  today: string; // YYYY-MM-DD
  monthStart: string; // YYYY-MM-DD (first day of month)
}

export interface WeeklyBudgetInput {
  monthlyBudget: number;
  weeksInMonth: number; // approximate (use 4.33 or compute from month)
  transactions: Array<{ date: string; amount: number }>;
  today: string;
  monthStart: string;
}

export interface MonthlyBudgetInput {
  monthlyBudget: number;
  transactions: Array<{ amount: number }>;
}

export interface ComputeTodayAvailableInput {
  accumulatedBudgetToDate: number;
  transactions: { date: string; amount: number }[];
  today: string;
}

export interface ComputeThisWeekAvailableInput {
  accumulatedWeeklyBudget: number;
  transactions: { date: string; amount: number }[];
  weekStartStr: string;
  today: string;
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
  computeTodayAvailable(input: ComputeTodayAvailableInput): { spentToday: number; availableToday: number };
  computeThisWeekAvailable(input: ComputeThisWeekAvailableInput): { spentThisWeek: number; availableThisWeek: number };
}

export class BudgetComputationServiceImpl implements BudgetComputationService {
  getDaysInMonth(year: number, month: number): number {
    // Day 0 of month+1 = last day of month
    return new Date(year, month, 0).getDate();
  }

  computeDailyRemaining(input: DailyBudgetInput): number {
    const { monthlyBudget, daysInMonth, transactions, today, monthStart } = input;
    const dailyAllowance = monthlyBudget / daysInMonth;

    const start = new Date(monthStart);
    const end = new Date(today);

    // Build a map of spending per day
    const spendingByDay = new Map<string, number>();
    for (const tx of transactions) {
      spendingByDay.set(tx.date, (spendingByDay.get(tx.date) ?? 0) + tx.amount);
    }

    let carry = 0;

    const current = new Date(start);
    while (current <= end) {
      const dateStr = this.formatDate(current);
      const allowance = carry + dailyAllowance;
      const spent = spendingByDay.get(dateStr) ?? 0;
      carry = Math.max(0, allowance - spent);
      current.setDate(current.getDate() + 1);
    }

    return carry;
  }

  computeRolloverAmount(input: DailyBudgetInput): number {
    const { monthlyBudget, daysInMonth, transactions, today, monthStart } = input;
    const dailyAllowance = monthlyBudget / daysInMonth;

    const start = new Date(monthStart);
    const end = new Date(today);

    // Build a map of spending per day
    const spendingByDay = new Map<string, number>();
    for (const tx of transactions) {
      spendingByDay.set(tx.date, (spendingByDay.get(tx.date) ?? 0) + tx.amount);
    }

    let carry = 0;

    const current = new Date(start);
    while (current < end) {
      const dateStr = this.formatDate(current);
      const allowance = carry + dailyAllowance;
      const spent = spendingByDay.get(dateStr) ?? 0;
      carry = Math.max(0, allowance - spent);
      current.setDate(current.getDate() + 1);
    }

    // carry at start of today = carry before adding today's allowance
    return carry;
  }

  computeWeeklyRemaining(input: WeeklyBudgetInput): number {
    const { monthlyBudget, weeksInMonth, transactions, today, monthStart } = input;
    const weeklyAllowance = monthlyBudget / weeksInMonth;

    const start = new Date(monthStart);
    const end = new Date(today);

    // Build a map of spending per day for range lookup
    const spendingByDay = new Map<string, number>();
    for (const tx of transactions) {
      spendingByDay.set(tx.date, (spendingByDay.get(tx.date) ?? 0) + tx.amount);
    }

    let carry = 0;

    // Iterate week by week from monthStart to today
    const weekStart = new Date(start);
    while (weekStart <= end) {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      // Clamp weekEnd to today
      const effectiveEnd = weekEnd < end ? weekEnd : end;

      // Sum spending in this week segment
      let spent = 0;
      const cur = new Date(weekStart);
      while (cur <= effectiveEnd) {
        const dateStr = this.formatDate(cur);
        spent += spendingByDay.get(dateStr) ?? 0;
        cur.setDate(cur.getDate() + 1);
      }

      const allowance = carry + weeklyAllowance;
      carry = Math.max(0, allowance - spent);

      weekStart.setDate(weekStart.getDate() + 7);
    }

    return carry;
  }

  computeMonthlyRemaining(input: MonthlyBudgetInput): number {
    const { monthlyBudget, transactions } = input;
    const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    return monthlyBudget - totalSpent;
  }

  getPeriodBounds(year: number, month: number, starterDay: number): {
    periodStart: string;
    periodEnd: string;
    daysInPeriod: number;
  } {
    if (starterDay === 1) {
      const days = this.getDaysInMonth(year, month);
      const m = String(month).padStart(2, '0');
      return {
        periodStart: `${year}-${m}-01`,
        periodEnd: `${year}-${m}-${String(days).padStart(2, '0')}`,
        daysInPeriod: days,
      };
    }
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const daysInPrevMonth = this.getDaysInMonth(prevYear, prevMonth);
    const actualStartDay = Math.min(starterDay, daysInPrevMonth);
    const pm = String(prevMonth).padStart(2, '0');
    const cm = String(month).padStart(2, '0');
    const periodStart = `${prevYear}-${pm}-${String(actualStartDay).padStart(2, '0')}`;
    const periodEnd = `${year}-${cm}-${String(starterDay).padStart(2, '0')}`;
    const diff = (new Date(periodEnd).getTime() - new Date(periodStart).getTime()) / 86400000;
    return { periodStart, periodEnd, daysInPeriod: Math.round(diff) + 1 };
  }

  computeTodayAvailable(input: ComputeTodayAvailableInput): { spentToday: number; availableToday: number } {
    const { accumulatedBudgetToDate, transactions, today } = input;
    const spentToday = transactions.filter(tx => tx.date === today).reduce((sum, tx) => sum + tx.amount, 0);
    const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const availableToday = accumulatedBudgetToDate - (totalSpent - spentToday);
    return { spentToday, availableToday: Math.max(availableToday, 0) };
  }

  computeThisWeekAvailable(input: ComputeThisWeekAvailableInput): { spentThisWeek: number; availableThisWeek: number } {
    const { accumulatedWeeklyBudget, transactions, weekStartStr, today } = input;
    const spentThisWeek = transactions.filter(tx => tx.date >= weekStartStr && tx.date <= today).reduce((sum, tx) => sum + tx.amount, 0);
    const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const availableThisWeek = accumulatedWeeklyBudget - (totalSpent - spentThisWeek);
    return { spentThisWeek, availableThisWeek: Math.max(availableThisWeek, 0) };
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
