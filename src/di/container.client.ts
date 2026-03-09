import 'client-only';

import { AuthDataSourceImpl } from '@/data/data-sources/auth/AuthDataSourceImpl';
import { AuthRepositoryImpl } from '@/data/repositories/AuthRepositoryImpl';
import { SignInWithGoogleUseCaseImpl } from '@/domain/use-cases/auth/SignInWithGoogleUseCase';
import { SignOutUseCaseImpl } from '@/domain/use-cases/auth/SignOutUseCase';
import { GetCurrentUserUseCaseImpl } from '@/domain/use-cases/auth/GetCurrentUserUseCase';

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
