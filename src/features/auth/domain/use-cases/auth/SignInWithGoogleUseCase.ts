import type { AuthRepository } from '@/features/auth/domain/repositories/AuthRepository';

export interface SignInWithGoogleUseCase {
  execute(): Promise<void>;
}

export class SignInWithGoogleUseCaseImpl implements SignInWithGoogleUseCase {
  constructor(private readonly repository: AuthRepository) {}

  async execute(): Promise<void> {
    return this.repository.signInWithGoogle();
  }
}
