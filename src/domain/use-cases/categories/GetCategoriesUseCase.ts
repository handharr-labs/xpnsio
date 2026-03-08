import type { Category } from '@/domain/entities/Category';
import type { CategoryRepository } from '@/domain/repositories/CategoryRepository';

export interface GetCategoriesUseCase {
  execute(userId: string): Promise<Category[]>;
}

export class GetCategoriesUseCaseImpl implements GetCategoriesUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(userId: string): Promise<Category[]> {
    return this.repository.getByUser(userId);
  }
}
