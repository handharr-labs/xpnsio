import type { BudgetRepository } from '@/features/budget-settings/domain/repositories/BudgetRepository';
import type { BudgetSettingRepository } from '@/features/budget-settings/domain/repositories/BudgetSettingRepository';
import type { TransactionRepository } from '@/features/transactions/domain/repositories/TransactionRepository';
import type { CategoryRepository } from '@/features/categories/domain/repositories/CategoryRepository';
import type { BudgetComputationService } from '@/features/budget-settings/domain/services/BudgetComputationService';
import type { BudgetProgressService } from '@/features/dashboard/domain/services/BudgetProgressService';
import type { CategoryBudgetInfo } from '@/features/dashboard/domain/entities/CategoryBudgetInfo';
import type { DashboardData } from '@/features/dashboard/domain/entities/DashboardData';

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

    // Auto-carry + sync logic: apply (or re-apply) setting when budgets are missing or stale
    let budgets = await this.budgetRepository.getByMonth(userId, year, month);
    const lastApp = await this.budgetRepository.getLastApplication(userId);
    if (lastApp) {
      const setting = await this.budgetSettingRepository.getById(lastApp.budgetSettingId);
      if (setting && budgets.length !== setting.items.length) {
        const items = setting.items.map((item) => ({
          categoryId: item.categoryId,
          monthlyAmount: String(item.monthlyAmount),
        }));
        await this.budgetRepository.applyBudgetSetting(
          userId,
          lastApp.budgetSettingId,
          items,
          year,
          month
        );
        budgets = await this.budgetRepository.getByMonth(userId, year, month);
      }
    }

    const hasActiveBudget = budgets.length > 0;

    // Resolve starterDay from the applied budget setting for this month
    const application = await this.budgetRepository.getApplication(userId, year, month);
    let starterDay = 1;
    if (application) {
      const setting = await this.budgetSettingRepository.getById(application.budgetSettingId);
      starterDay = setting?.starterDay ?? 1;
    }

    const { periodStart, periodEnd, daysInPeriod } = this.computationService.getPeriodBounds(year, month, starterDay);

    // When viewing a past period, clamp "today" to the last day of that period so
    // daily/weekly progress refers to the period's end rather than the real today.
    const effectiveToday = today > periodEnd ? periodEnd : today;

    // Fetch all expense transactions and category metadata
    const [allExpenseTransactions, allCategories] = await Promise.all([
      this.transactionRepository.getFiltered({
        userId,
        startDate: periodStart,
        endDate: periodEnd,
        type: 'expense',
      }),
      this.categoryRepository.getByUser(userId),
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
        const daysElapsed = Math.round(
          (new Date(effectiveToday).getTime() - new Date(periodStart).getTime()) / 86400000
        ) + 1;
        accumulatedBudgetToDate = dailyBudget * daysElapsed;

        const dailyProgress = this.progressService.calculateProgress({
          spent: totalSpent,
          budget: accumulatedBudgetToDate,
        });
        const weekNumber = Math.ceil(daysElapsed / 7);
        const weeklyProgress = this.progressService.calculateProgress({
          spent: totalSpent,
          budget: dailyBudget * (weekNumber * 7),
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

        const currentWeekStart = new Date(periodStart);
        currentWeekStart.setDate(currentWeekStart.getDate() + (weekNumber - 1) * 7);
        const weekStartStr = currentWeekStart.toISOString().split('T')[0];
        const { spentThisWeek, availableThisWeek } = this.computationService.computeThisWeekAvailable({
          accumulatedWeeklyBudget: dailyBudget * weekNumber * 7,
          transactions: categoryTransactions.map((tx) => ({ date: tx.date, amount: tx.amount })),
          weekStartStr,
          today: effectiveToday,
        });
        const thisWeekProgress = this.progressService.calculateProgress({ spent: spentThisWeek, budget: availableThisWeek });

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
        const weeksElapsed = Math.round(
          (new Date(effectiveToday).getTime() - new Date(periodStart).getTime()) / (86400000 * 7)
        ) + 1;
        weeklyBudget = budget.amount / weeksInPeriod;
        accumulatedWeeklyBudget = weeklyBudget * weeksElapsed;
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

        const weekStart = new Date(periodStart);
        weekStart.setDate(weekStart.getDate() + (weeksElapsed - 1) * 7);
        const weekStartStr = weekStart.toISOString().split('T')[0];
        const { spentThisWeek, availableThisWeek } = this.computationService.computeThisWeekAvailable({
          accumulatedWeeklyBudget,
          transactions: categoryTransactions.map((tx) => ({ date: tx.date, amount: tx.amount })),
          weekStartStr,
          today: effectiveToday,
        });
        const thisWeekProgress = this.progressService.calculateProgress({ spent: spentThisWeek, budget: availableThisWeek });

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

    const recentTransactions = await this.transactionRepository.getFiltered({
      userId,
      startDate: periodStart,
      endDate: periodEnd,
      limit: 10,
    });

    return {
      totalMonthlyBudget,
      totalSpent,
      totalRemaining,
      categories: categoryInfoList,
      recentTransactions,
      hasActiveBudget,
    };
  }

}

