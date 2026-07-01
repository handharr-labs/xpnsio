import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { createServerContainer } from '@/shared/di/container.server';
import { DashboardView } from '@/features/dashboard/presentation/views/DashboardView';

export default async function DashboardPage() {
  const session = await auth.gateway.getSession();

  if (!session) redirect('/login');

  const container = createServerContainer();
  const { isOnboarded } = await container.getUserOnboardingStatusUseCase.execute(
    session.user.id,
  );

  if (!isOnboarded) redirect('/setup');

  return <DashboardView />;
}
