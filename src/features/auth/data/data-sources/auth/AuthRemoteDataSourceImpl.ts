import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import type { AuthRemoteDataSource } from './AuthRemoteDataSource';
import type { AuthUserRecord } from './AuthUserRecord';

export class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  private readonly supabase = createSupabaseBrowserClient();

  constructor(private readonly redirectOrigin: string) {}

  async signInWithGoogle(): Promise<void> {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${this.redirectOrigin}/auth/callback`,
        queryParams: {
          prompt: 'select_account',
        },
      },
    });
    if (error) throw new Error(error.message);
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  async getCurrentUser(): Promise<AuthUserRecord | null> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    if (!user) return null;

    return {
      id: user.id,
      email: user.email ?? null,
      fullName: user.user_metadata?.full_name ?? null,
      avatarUrl: user.user_metadata?.avatar_url ?? null,
    };
  }
}
