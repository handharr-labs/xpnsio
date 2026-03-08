'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useDI } from '@/di/DIContext';
import { ROUTES } from '@/presentation/navigation/routes';

export function DashboardView() {
  const { signOutUseCase } = useDI();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOutUseCase.execute();
    router.push(ROUTES.login);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Your spending overview will appear here.</p>
          </div>
          <Button variant="outline" onClick={handleSignOut} disabled={isLoading}>
            {isLoading ? 'Signing out...' : 'Sign out'}
          </Button>
        </div>
      </div>
    </main>
  );
}
