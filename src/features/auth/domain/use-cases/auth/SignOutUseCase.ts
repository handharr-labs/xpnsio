import type { AuthRepository } from '@/features/auth/domain/repositories/AuthRepository';

export interface SignOutUseCase {
  execute(): Promise<void>;
}

export class SignOutUseCaseImpl implements SignOutUseCase {
  constructor(private readonly repository: AuthRepository) {}

  async execute(): Promise<void> {
    return this.repository.signOut();
  }
}
