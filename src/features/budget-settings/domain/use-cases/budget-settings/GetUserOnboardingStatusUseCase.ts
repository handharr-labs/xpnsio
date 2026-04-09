import type { BudgetSettingRepository } from '@/features/budget-settings/domain/repositories/BudgetSettingRepository';

export interface GetUserOnboardingStatusUseCase {
  execute(userId: string): Promise<{ isOnboarded: boolean }>;
}

export class GetUserOnboardingStatusUseCaseImpl implements GetUserOnboardingStatusUseCase {
  constructor(private readonly repository: BudgetSettingRepository) {}

  async execute(userId: string): Promise<{ isOnboarded: boolean }> {
    const settings = await this.repository.getByUser(userId);
    return { isOnboarded: settings.length > 0 };
  }
}
