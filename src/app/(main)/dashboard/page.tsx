import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/auth';
import { createServerContainer } from '@/di/container.server';
import { DashboardView } from '@/presentation/features/dashboard/DashboardView';

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const container = createServerContainer();
  const settings = await container.getBudgetSettingsUseCase.execute(user.id);

  if (settings.length === 0) redirect('/setup');

  return <DashboardView />;
}
