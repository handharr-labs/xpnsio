import type { BudgetRepository } from '@/features/budget-settings/domain/repositories/BudgetRepository';
import type { BudgetSettingRepository } from '@/features/budget-settings/domain/repositories/BudgetSettingRepository';

export interface SyncBudgetForPeriodParams {
  userId: string;
  year: number;
  month: number;
}

export interface SyncBudgetForPeriodUseCase {
  execute(params: SyncBudgetForPeriodParams): Promise<void>;
}

export class SyncBudgetForPeriodUseCaseImpl implements SyncBudgetForPeriodUseCase {
  constructor(
    private readonly budgetRepository: BudgetRepository,
    private readonly budgetSettingRepository: BudgetSettingRepository
  ) {}

  async execute({ userId, year, month }: SyncBudgetForPeriodParams): Promise<void> {
    const lastApp = await this.budgetRepository.getLastApplication(userId);
    if (!lastApp) return;

    const setting = await this.budgetSettingRepository.getById(lastApp.budgetSettingId);
    if (!setting) return;

    const budgets = await this.budgetRepository.getByMonth(userId, year, month);
    if (budgets.length === setting.items.length) return;

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
  }
}
