import type {
  BudgetProgressService,
  BudgetProgressInput,
} from '@/features/dashboard/domain/services/BudgetProgressService';
import type { BudgetStatus, BudgetProgressData } from '@/features/dashboard/domain/entities/BudgetProgressData';

export class BudgetProgressServiceImpl implements BudgetProgressService {
  calculateProgress(input: BudgetProgressInput): BudgetProgressData {
    const { spent, budget } = input;
    const percent = this.calculatePercent(spent, budget);
    const remaining = budget - spent;
    const isOverrun = remaining < 0;

    return {
      percent,
      remaining,
      isOverrun,
      status: this.getProgressStatus(percent),
    };
  }

  calculatePercent(spent: number, budget: number): number {
    if (budget <= 0) return spent > 0 ? 100 : 0;
    return Math.floor((spent / budget) * 100);
  }

  getProgressStatus(percent: number): BudgetStatus {
    if (percent >= 100) return 'over';
    if (percent >= 90) return 'at-risk';
    return 'on-track';
  }
}
