import type { Category, MasterCategory } from '@/features/categories/domain/entities/Category';
import type { CategoryRepository } from '@/features/categories/domain/repositories/CategoryRepository';
import { ValidationError } from '@handharr-labs/forge-core';

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
      throw new ValidationError('Name is required');
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
