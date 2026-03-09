import type { BudgetSettingRepository } from '@/domain/repositories/BudgetSettingRepository';

export interface DeleteBudgetSettingUseCase {
  execute(id: string): Promise<void>;
}

export class DeleteBudgetSettingUseCaseImpl implements DeleteBudgetSettingUseCase {
  constructor(private readonly repository: BudgetSettingRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
