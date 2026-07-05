import type { BudgetRepository } from '@/features/budget-settings/domain/repositories/BudgetRepository';
import type { BudgetSettingRepository } from '@/features/budget-settings/domain/repositories/BudgetSettingRepository';
import type { TransactionRepository } from '@/features/transactions/domain/repositories/TransactionRepository';
import type { CategoryRepository } from '@/features/categories/domain/repositories/CategoryRepository';
import type { BudgetComputationService } from '@/features/budget-settings/domain/services/BudgetComputationService';
import type { BudgetProgressService } from '@/features/dashboard/domain/services/BudgetProgressService';
import type { CategoryBudgetInfo } from '@/features/dashboard/domain/entities/CategoryBudgetInfo';
import type { DashboardData } from '@/features/dashboard/domain/entities/DashboardData';
import { orElse } from '@handharr-labs/forge-core';

export type { CategoryBudgetInfo, DashboardData };

export interface GetDashboardDataParams {
  userId: string;
  year: number;
  month: number;
  today: string; // YYYY-MM-DD, provided by the caller (Server Action)
}

export interface GetDashboardDataUseCase {
  execute(params: GetDashboardDataParams): Promise<DashboardData>;
}

export class GetDashboardDataUseCaseImpl implements GetDashboardDataUseCase {
  constructor(
    private readonly budgetRepository: BudgetRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly computationService: BudgetComputationService,
    private readonly categoryRepository: CategoryRepository,
    private readonly budgetSettingRepository: BudgetSettingRepository,
    private readonly progressService: BudgetProgressService
  ) {}

  async execute(params: GetDashboardDataParams): Promise<DashboardData> {
    const { userId, year, month, today } = params;

    // These three don't depend on the period bounds, so fetch them together.
    // The applied budget setting (starterDay/currency) is resolved via the
    // application row; getById is chained after it but still overlaps the
    // budgets/categories fetches.
    const settingPromise = this.budgetRepository
      .getApplication(userId, year, month)
      .then((application) =>
        application ? this.budgetSettingRepository.getById(application.budgetSettingId) : null
      );
    const [budgets, allCategories, setting] = await Promise.all([
      this.budgetRepository.getByMonth(userId, year, month),
      this.categoryRepository.getByUser(userId),
      settingPromise,
    ]);

    const hasActiveBudget = budgets.length > 0;
    const starterDay = orElse(setting?.starterDay, 1);
    const currency = orElse(setting?.currency, 'IDR');

    const { periodStart, periodEnd, daysInPeriod } = this.computationService.getPeriodBounds(year, month, starterDay);

    // When viewing a past period, clamp "today" to the last day of that period so
    // daily/weekly progress refers to the period's end rather than the real today.
    // Treat periodEnd as exclusive: the starter date belongs to the next period.
    // When today >= periodEnd the current period is done.
    const effectiveToday = today >= periodEnd ? periodEnd : today;

    // Both transaction reads depend only on the period bounds — fetch together.
    // (recentTransactions includes income, so it can't be derived from the
    // expense-only list below.)
    const [allExpenseTransactions, recentTransactions] = await Promise.all([
      this.transactionRepository.getFiltered({
        userId,
        startDate: periodStart,
        endDate: periodEnd,
        type: 'expense',
      }),
      this.transactionRepository.getFiltered({
        userId,
        startDate: periodStart,
        endDate: periodEnd,
        limit: 10,
      }),
    ]);

    const categoryMap = new Map(allCategories.map((c) => [c.id, c]));

    // Build category budget info
    const categoryInfoList: CategoryBudgetInfo[] = [];

    for (const budget of budgets) {
      const category = categoryMap.get(budget.categoryId);
      const masterCategory = category?.masterCategory ?? 'monthly';

      const categoryTransactions = allExpenseTransactions.filter(
        (tx) => tx.categoryId === budget.categoryId
      );
      const totalSpent = categoryTransactions.reduce((sum, tx) => sum + tx.amount, 0);

      let remaining: number;
      let rolloverAmount = 0;

      let dailyBudget: number | undefined;
      let accumulatedBudgetToDate: number | undefined;
      let weeklyBudget: number | undefined;
      let accumulatedWeeklyBudget: number | undefined;

      if (masterCategory === 'daily') {
        const input = {
          monthlyBudget: budget.amount,
          daysInMonth: daysInPeriod,
          transactions: categoryTransactions.map((tx) => ({ date: tx.date, amount: tx.amount })),
          today: effectiveToday,
          monthStart: periodStart,
        };
        remaining = this.computationService.computeDailyRemaining(input);
        rolloverAmount = this.computationService.computeRolloverAmount(input);
        dailyBudget = budget.amount / daysInPeriod;
        const daysElapsed = this.computationService.computeDaysElapsed(periodStart, effectiveToday);
        accumulatedBudgetToDate = dailyBudget * daysElapsed;

        const dailyProgress = this.progressService.calculateProgress({
          spent: totalSpent,
          budget: accumulatedBudgetToDate,
        });
        const weekNumber = Math.ceil(daysElapsed / 7);
        const weeklyProgress = this.progressService.calculateProgress({
          spent: totalSpent,
          budget: dailyBudget * weekNumber * 7,
        });
        const monthlyProgress = this.progressService.calculateProgress({
          spent: totalSpent,
          budget: budget.amount,
        });

        const { spentToday, availableToday } = this.computationService.computeTodayAvailable({
          accumulatedBudgetToDate,
          transactions: categoryTransactions.map((tx) => ({ date: tx.date, amount: tx.amount })),
          today: effectiveToday,
        });
        const todayProgress = this.progressService.calculateProgress({ spent: spentToday, budget: availableToday });

        // For past periods (today >= periodEnd), show the last 7 days of the period with a
        // standalone weekly budget — the cumulative rollover formula gives inflated results
        // because totalSpent already covers the full period.
        // For the current period, use the period-aligned week number as before.
        const isPastPeriod = today >= periodEnd;
        let weekStartStr: string;
        let spentThisWeek: number;
        let availableThisWeek: number;

        weekStartStr = this.computationService.getWeekStart({
          isPastPeriod,
          effectiveToday,
          periodStart,
          weekNumber,
        });

        if (isPastPeriod) {
          spentThisWeek = categoryTransactions
            .filter((tx) => tx.date >= weekStartStr && tx.date <= effectiveToday)
            .reduce((sum, tx) => sum + tx.amount, 0);
          const weekBudget = dailyBudget * 7;
          availableThisWeek = Math.max(weekBudget - spentThisWeek, 0);
        } else {
          const weekResult = this.computationService.computeThisWeekAvailable({
            accumulatedWeeklyBudget: dailyBudget * weekNumber * 7,
            transactions: categoryTransactions.map((tx) => ({ date: tx.date, amount: tx.amount })),
            weekStartStr,
            today: effectiveToday,
          });
          spentThisWeek = weekResult.spentThisWeek;
          availableThisWeek = weekResult.availableThisWeek;
        }

        const thisWeekProgress = this.progressService.calculateProgress({
          spent: spentThisWeek,
          budget: isPastPeriod ? dailyBudget * 7 : availableThisWeek,
        });

        categoryInfoList.push({
          categoryId: budget.categoryId,
          categoryName: category?.name ?? budget.categoryId,
          masterCategory,
          monthlyBudget: budget.amount,
          totalSpent,
          remaining,
          rolloverAmount,
          dailyBudget,
          accumulatedBudgetToDate,
          accumulatedWeeklyBudget: dailyBudget * weekNumber * 7,
          periodDaysElapsed: daysElapsed,
          weekStartStr,
          dailyProgress,
          weeklyProgress,
          monthlyProgress,
          spentToday,
          availableToday,
          todayProgress,
          spentThisWeek,
          availableThisWeek,
          thisWeekProgress,
        });
        continue;
      } else if (masterCategory === 'weekly') {
        const weeksInPeriod = daysInPeriod / 7;
        const weeksElapsed = this.computationService.computeWeeksElapsed(periodStart, effectiveToday);
        weeklyBudget = budget.amount / weeksInPeriod;
        accumulatedWeeklyBudget = Math.min(weeklyBudget * weeksElapsed, budget.amount);
        remaining = this.computationService.computeWeeklyRemaining({
          monthlyBudget: budget.amount,
          weeksInMonth: weeksInPeriod,
          transactions: categoryTransactions.map((tx) => ({ date: tx.date, amount: tx.amount })),
          today: effectiveToday,
          monthStart: periodStart,
        });

        const weeklyProgress = this.progressService.calculateProgress({
          spent: totalSpent,
          budget: accumulatedWeeklyBudget,
        });
        const monthlyProgress = this.progressService.calculateProgress({
          spent: totalSpent,
          budget: budget.amount,
        });

        const isPastPeriodWeekly = today >= periodEnd;
        let weekStartStr: string;
        let spentThisWeek: number;
        let availableThisWeek: number;

        weekStartStr = this.computationService.getWeekStart({
          isPastPeriod: isPastPeriodWeekly,
          effectiveToday,
          periodStart,
          weekNumber: weeksElapsed,
        });

        if (isPastPeriodWeekly) {
          spentThisWeek = categoryTransactions
            .filter((tx) => tx.date >= weekStartStr && tx.date <= effectiveToday)
            .reduce((sum, tx) => sum + tx.amount, 0);
          availableThisWeek = Math.max(weeklyBudget - spentThisWeek, 0);
        } else {
          const weekResult = this.computationService.computeThisWeekAvailable({
            accumulatedWeeklyBudget,
            transactions: categoryTransactions.map((tx) => ({ date: tx.date, amount: tx.amount })),
            weekStartStr,
            today: effectiveToday,
          });
          spentThisWeek = weekResult.spentThisWeek;
          availableThisWeek = weekResult.availableThisWeek;
        }

        const thisWeekProgress = this.progressService.calculateProgress({
          spent: spentThisWeek,
          budget: isPastPeriodWeekly ? weeklyBudget : availableThisWeek,
        });

        categoryInfoList.push({
          categoryId: budget.categoryId,
          categoryName: category?.name ?? budget.categoryId,
          masterCategory,
          monthlyBudget: budget.amount,
          totalSpent,
          remaining,
          rolloverAmount,
          weeklyBudget,
          accumulatedWeeklyBudget,
          periodWeeksElapsed: weeksElapsed,
          weekStartStr,
          weeklyProgress,
          monthlyProgress,
          spentThisWeek,
          availableThisWeek,
          thisWeekProgress,
        });
        continue;
      } else {
        remaining = this.computationService.computeMonthlyRemaining({
          monthlyBudget: budget.amount,
          transactions: categoryTransactions.map((tx) => ({ amount: tx.amount })),
        });

        const monthlyProgress = this.progressService.calculateProgress({
          spent: totalSpent,
          budget: budget.amount,
        });

        categoryInfoList.push({
          categoryId: budget.categoryId,
          categoryName: category?.name ?? budget.categoryId,
          masterCategory,
          monthlyBudget: budget.amount,
          totalSpent,
          remaining,
          rolloverAmount,
          dailyBudget,
          accumulatedBudgetToDate,
          weeklyBudget,
          accumulatedWeeklyBudget,
          monthlyProgress,
        });
      }
    }

    const totalMonthlyBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = categoryInfoList.reduce((sum, c) => sum + c.totalSpent, 0);
    const totalRemaining = totalMonthlyBudget - totalSpent;

    return {
      totalMonthlyBudget,
      totalSpent,
      totalRemaining,
      categories: categoryInfoList,
      recentTransactions,
      hasActiveBudget,
      periodEnd,
      currency,
    };
  }

}

