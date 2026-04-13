'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Home, Receipt, Plus, Wallet, Settings } from 'lucide-react';
import { ROUTES } from '@/shared/presentation/navigation/routes';

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background px-6 py-3">
      <div className="max-w-2xl mx-auto flex items-center">
        <button
          className={`flex-1 flex flex-col items-center gap-1 text-xs transition-colors ${isActive(ROUTES.dashboard) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => router.push(ROUTES.dashboard)}
        >
          <Home size={20} />
          <span>Dashboard</span>
        </button>
        <button
          className={`flex-1 flex flex-col items-center gap-1 text-xs transition-colors ${isActive(ROUTES.splitBills) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => router.push(ROUTES.splitBills)}
        >
          <Receipt size={20} />
          <span>Split Bill</span>
        </button>
        <button
          className="flex-1 flex justify-center"
          onClick={() => router.push(ROUTES.transactionNew)}
        >
          <div className="-mt-6 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:opacity-90">
            <Plus size={24} />
          </div>
        </button>
        <button
          className={`flex-1 flex flex-col items-center gap-1 text-xs transition-colors ${isActive(ROUTES.budgetSettings) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => router.push(ROUTES.budgetSettings)}
        >
          <Wallet size={20} />
          <span>Budget</span>
        </button>
        <button
          className={`flex-1 flex flex-col items-center gap-1 text-xs transition-colors ${isActive(ROUTES.settings) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => router.push(ROUTES.settings)}
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}
