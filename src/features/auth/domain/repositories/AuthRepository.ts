import type { User } from '@/features/auth/domain/entities/User';

export interface AuthRepository {
  signInWithGoogle(): Promise<void>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
