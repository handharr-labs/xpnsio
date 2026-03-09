import type { Category, MasterCategory } from '@/features/categories/domain/entities/Category';
import type { CategoryRepository } from '@/features/categories/domain/repositories/CategoryRepository';
import { DomainError } from '@/shared/domain/errors/DomainError';

export interface CreateCategoryInput {
  userId: string;
  name: string;
  masterCategory: MasterCategory;
  color: string;
  icon: string;
}

export interface CreateCategoryUseCase {
  execute(data: CreateCategoryInput): Promise<Category>;
}

export class CreateCategoryUseCaseImpl implements CreateCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(data: CreateCategoryInput): Promise<Category> {
    if (!data.name.trim()) {
      throw DomainError.validationFailed('name', 'Name is required');
    }

    return this.repository.create({
      userId: data.userId,
      name: data.name.trim(),
      masterCategory: data.masterCategory,
      color: data.color,
      icon: data.icon,
    });
  }
}
