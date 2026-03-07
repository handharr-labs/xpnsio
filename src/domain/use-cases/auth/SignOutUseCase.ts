import type { AuthRepository } from '@/domain/repositories/AuthRepository';

export interface SignOutUseCase {
  execute(): Promise<void>;
}

export class SignOutUseCaseImpl implements SignOutUseCase {
  constructor(private readonly repository: AuthRepository) {}

  async execute(): Promise<void> {
    return this.repository.signOut();
  }
}
