'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ROUTES } from '@/shared/presentation/navigation/routes';

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background px-6 py-3">
      <div className="max-w-2xl mx-auto flex items-center justify-around">
        <button
          className={`flex flex-col items-center gap-1 text-xs transition-colors ${isActive(ROUTES.dashboard) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => router.push(ROUTES.dashboard)}
        >
          <span className="text-lg">🏠</span>
          <span>Dashboard</span>
        </button>
        <button
          className={`flex flex-col items-center gap-1 text-xs transition-colors ${isActive(ROUTES.transactions) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => router.push(ROUTES.transactions)}
        >
          <span className="text-lg">📋</span>
          <span>Transactions</span>
        </button>
        <button
          className="-mt-6 w-14 h-14 rounded-full bg-primary text-primary-foreground text-2xl flex items-center justify-center shadow-lg hover:opacity-90"
          onClick={() => router.push(ROUTES.transactionNew)}
        >
          +
        </button>
        <button
          className={`flex flex-col items-center gap-1 text-xs transition-colors ${isActive(ROUTES.budgetSettings) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => router.push(ROUTES.budgetSettings)}
        >
          <span className="text-lg">💰</span>
          <span>Budget</span>
        </button>
        <button
          className={`flex flex-col items-center gap-1 text-xs transition-colors ${isActive(ROUTES.settings) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => router.push(ROUTES.settings)}
        >
          <span className="text-lg">⚙️</span>
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}
