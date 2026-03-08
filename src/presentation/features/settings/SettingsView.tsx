'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDI } from '@/di/DIContext';
import { ROUTES } from '@/presentation/navigation/routes';

export function SettingsView() {
  const { signOutUseCase } = useDI();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOutUseCase.execute();
      router.push(ROUTES.login);
    } catch {
      setIsSigningOut(false);
    }
  };

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Signed in with Google OAuth. Your data is securely stored in Supabase.
            </p>
            <Button
              variant="outline"
              className="w-full text-red-600 hover:text-red-700"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? 'Signing out...' : 'Sign Out'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Navigation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push(ROUTES.dashboard)}
            >
              Dashboard
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push(ROUTES.budgetSettings)}
            >
              Budget Settings
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push(ROUTES.transactions)}
            >
              Transactions
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
