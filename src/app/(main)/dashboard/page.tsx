import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/auth';
import { db } from '@/lib/db';
import { budgetSettings } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { DashboardView } from '@/presentation/features/dashboard/DashboardView';

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const settings = await db
    .select()
    .from(budgetSettings)
    .where(eq(budgetSettings.userId, user.id))
    .limit(1);

  if (settings.length === 0) redirect('/setup');

  return <DashboardView />;
}
