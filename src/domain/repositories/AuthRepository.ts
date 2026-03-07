import type { User } from '@/domain/entities/User';

export interface AuthRepository {
  signInWithGoogle(): Promise<void>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
