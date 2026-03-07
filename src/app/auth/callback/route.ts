import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/auth';
import { db } from '@/lib/db';
import { profiles } from '@/lib/schema';

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
        await db.insert(profiles).values({
          id: user.id,
          email: user.email ?? '',
          fullName: user.user_metadata?.full_name ?? null,
          avatarUrl: user.user_metadata?.avatar_url ?? null,
        }).onConflictDoUpdate({
          target: profiles.id,
          set: {
            email: user.email ?? '',
            fullName: user.user_metadata?.full_name ?? null,
            avatarUrl: user.user_metadata?.avatar_url ?? null,
            updatedAt: new Date(),
          },
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
