import type { Category } from '@/features/categories/domain/entities/Category';
import type { CategoryRepository } from '@/features/categories/domain/repositories/CategoryRepository';

export interface GetCategoriesUseCase {
  execute(userId: string): Promise<Category[]>;
}

export class GetCategoriesUseCaseImpl implements GetCategoriesUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(userId: string): Promise<Category[]> {
    return this.repository.getByUser(userId);
  }
}
