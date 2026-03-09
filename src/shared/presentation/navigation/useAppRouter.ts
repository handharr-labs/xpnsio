'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ROUTES } from './routes';

export function useAppRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return {
    currentPath: pathname,
    searchParams,
    push: (href: string) => router.push(href),
    replace: (href: string) => router.replace(href),
    back: () => router.back(),
    refresh: () => router.refresh(),
    goToLogin: () => router.push(ROUTES.login),
    goToDashboard: () => router.push(ROUTES.dashboard),
    goToTransactions: () => router.push(ROUTES.transactions),
  };
}
