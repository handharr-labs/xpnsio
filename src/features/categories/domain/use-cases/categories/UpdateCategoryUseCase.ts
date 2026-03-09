import type { Category, MasterCategory } from '@/features/categories/domain/entities/Category';
import type { CategoryRepository } from '@/features/categories/domain/repositories/CategoryRepository';

export interface UpdateCategoryInput {
  name?: string;
  color?: string;
  icon?: string;
  masterCategory?: MasterCategory;
}

export interface UpdateCategoryUseCase {
  execute(id: string, data: UpdateCategoryInput): Promise<Category>;
}

export class UpdateCategoryUseCaseImpl implements UpdateCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(id: string, data: UpdateCategoryInput): Promise<Category> {
    return this.repository.update(id, data);
  }
}
