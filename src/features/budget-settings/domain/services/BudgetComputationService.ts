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

export interface BudgetComputationService {
  computeDailyRemaining(input: DailyBudgetInput): number;
  computeWeeklyRemaining(input: WeeklyBudgetInput): number;
  computeMonthlyRemaining(input: MonthlyBudgetInput): number;
  computeRolloverAmount(input: DailyBudgetInput): number;
  getDaysInMonth(year: number, month: number): number;
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

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
