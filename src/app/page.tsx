import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/auth';

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  redirect(user ? '/dashboard' : '/login');
}
