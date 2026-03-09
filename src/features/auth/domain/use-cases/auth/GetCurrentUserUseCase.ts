import type { User } from '@/features/auth/domain/entities/User';
import type { AuthRepository } from '@/features/auth/domain/repositories/AuthRepository';

export interface GetCurrentUserUseCase {
  execute(): Promise<User | null>;
}

export class GetCurrentUserUseCaseImpl implements GetCurrentUserUseCase {
  constructor(private readonly repository: AuthRepository) {}

  async execute(): Promise<User | null> {
    return this.repository.getCurrentUser();
  }
}
