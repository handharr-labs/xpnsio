import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/auth';
import { createServerContainer } from '@/shared/di/container.server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Upsert profile on first login
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const container = createServerContainer();
        await container.upsertUserProfileUseCase.execute({
          id: user.id,
          email: user.email ?? '',
          fullName: user.user_metadata?.full_name ?? null,
          avatarUrl: user.user_metadata?.avatar_url ?? null,
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
