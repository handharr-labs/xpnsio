import type { CategoryRepository } from '@/features/categories/domain/repositories/CategoryRepository';

export interface DeleteCategoryResult {
  hasTransactions: boolean;
}

export interface DeleteCategoryUseCase {
  execute(id: string, force?: boolean): Promise<DeleteCategoryResult>;
}

export class DeleteCategoryUseCaseImpl implements DeleteCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(id: string, force = false): Promise<DeleteCategoryResult> {
    const hasTransactions = await this.repository.hasTransactions(id);

    if (hasTransactions && !force) {
      return { hasTransactions: true };
    }

    await this.repository.delete(id);
    return { hasTransactions };
  }
}
