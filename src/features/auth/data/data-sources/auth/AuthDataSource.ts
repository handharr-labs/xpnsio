export interface AuthUserRecord {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
}

export interface AuthDataSource {
  signInWithGoogle(): Promise<void>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<AuthUserRecord | null>;
}
