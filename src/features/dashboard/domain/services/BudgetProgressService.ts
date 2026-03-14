/**
 * Domain service for calculating budget progress.
 * Pure functions - no I/O, no async, no DOM dependencies.
 */

export interface BudgetProgressInput {
  spent: number;
  budget: number;
}

export interface BudgetProgressData {
  readonly percent: number;           // 0-100+, using Math.floor
  readonly remaining: number;         // Can be negative for overrun
  readonly isOverrun: boolean;        // true if remaining <= 0
  readonly colorClass: string;        // Tailwind class: bg-green-500/yellow-500/red-500
  readonly textClass: string;         // Tailwind class: text-green-600/yellow-600/red-600
  readonly displayText: string;       // Formatted "X left" or "Over by X"
}

export interface BudgetProgressService {
  calculateProgress(input: BudgetProgressInput): BudgetProgressData;
  calculatePercent(spent: number, budget: number): number;
  getProgressColor(percent: number): string;
  getProgressTextColor(percent: number): string;
  getRemainingText(remaining: number, isOverrun: boolean): string;
}

export class BudgetProgressServiceImpl implements BudgetProgressService {
  calculateProgress(input: BudgetProgressInput): BudgetProgressData {
    const { spent, budget } = input;
    const percent = this.calculatePercent(spent, budget);
    const remaining = budget - spent;
    const isOverrun = remaining <= 0;

    return {
      percent,
      remaining,
      isOverrun,
      colorClass: this.getProgressColor(percent),
      textClass: this.getProgressTextColor(percent),
      displayText: this.getRemainingText(remaining, isOverrun),
    };
  }

  calculatePercent(spent: number, budget: number): number {
    if (budget <= 0) return 0;
    return Math.floor((spent / budget) * 100);
  }

  getProgressColor(percent: number): string {
    if (percent >= 100) return 'bg-red-500';
    if (percent >= 90) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  getProgressTextColor(percent: number): string {
    if (percent >= 100) return 'text-red-600';
    if (percent >= 90) return 'text-yellow-600';
    return 'text-green-600';
  }

  getRemainingText(remaining: number, isOverrun: boolean): string {
    const amount = Math.abs(remaining);
    return isOverrun ? `Over by ${amount}` : `${amount} left`;
  }
}
