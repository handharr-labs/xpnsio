import type { AuthUserRecord } from './AuthUserRecord';

export type { AuthUserRecord };

export interface AuthRemoteDataSource {
  signInWithGoogle(): Promise<void>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<AuthUserRecord | null>;
}
