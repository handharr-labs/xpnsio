'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Home, Receipt, Plus, Wallet, Settings } from 'lucide-react';
import { BottomNav } from '@handharr-labs/ui-xpnsio';
import type { BottomNavItem } from '@handharr-labs/ui-xpnsio';
import { ROUTES } from '@/shared/presentation/navigation/routes';

const NAV_ITEMS: BottomNavItem[] = [
  { icon: Home, label: 'Dashboard', path: ROUTES.dashboard },
  { icon: Receipt, label: 'Split Bill', path: ROUTES.splitBills },
  { icon: Plus, label: 'New', path: ROUTES.transactionNew, fab: true },
  { icon: Wallet, label: 'Budget', path: ROUTES.budgetSettings },
  { icon: Settings, label: 'Settings', path: ROUTES.settings },
];

export function AppBottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <BottomNav
      items={NAV_ITEMS}
      currentPath={pathname}
      onNavigate={(path) => router.push(path)}
    />
  );
}
