import type { Category, MasterCategory } from '@/domain/entities/Category';
import type { CategoryRepository } from '@/domain/repositories/CategoryRepository';

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
