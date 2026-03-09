import 'client-only';

import { AuthDataSourceImpl } from '@/features/auth/data/data-sources/auth/AuthDataSourceImpl';
import { AuthRepositoryImpl } from '@/features/auth/data/repositories/AuthRepositoryImpl';
import { SignInWithGoogleUseCaseImpl } from '@/features/auth/domain/use-cases/auth/SignInWithGoogleUseCase';
import { SignOutUseCaseImpl } from '@/features/auth/domain/use-cases/auth/SignOutUseCase';
import { GetCurrentUserUseCaseImpl } from '@/features/auth/domain/use-cases/auth/GetCurrentUserUseCase';

export function createClientContainer() {
  // Auth
  const authDataSource = new AuthDataSourceImpl(
    typeof window !== 'undefined' ? window.location.origin : ''
  );
  const authRepository = new AuthRepositoryImpl(authDataSource);

  return {
    get signInWithGoogleUseCase() { return new SignInWithGoogleUseCaseImpl(authRepository); },
    get signOutUseCase() { return new SignOutUseCaseImpl(authRepository); },
    get getCurrentUserUseCase() { return new GetCurrentUserUseCaseImpl(authRepository); },
  };
}

export type ClientContainer = ReturnType<typeof createClientContainer>;
