import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function HomePage() {
  const session = await auth.gateway.getSession();
  redirect(session ? '/dashboard' : '/login');
}
