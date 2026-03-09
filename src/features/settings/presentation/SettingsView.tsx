'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDI } from '@/shared/di/DIContext';
import { ROUTES } from '@/shared/presentation/navigation/routes';
import { deleteAccountAction } from '@/features/auth/presentation/actions/auth';

export function SettingsView() {
  const { signOutUseCase } = useDI();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOutUseCase.execute();
      router.push(ROUTES.login);
    } catch {
      setIsSigningOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccountAction({});
      // After successful deletion, the session will be invalid
      // Redirect to login page
      router.push(ROUTES.login);
    } catch (error) {
      setIsDeleting(false);
      setDeleteConfirmText('');
      setShowDeleteConfirm(false);
      // Show error - could add toast notification here
      console.error('Failed to delete account:', error);
    }
  };

  const canDelete = deleteConfirmText === 'DELETE';

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

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showDeleteConfirm ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete Account
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-red-600 font-medium">
                  Warning: This will permanently delete your account and all data including:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Your profile and authentication data</li>
                  <li>All transactions</li>
                  <li>All categories</li>
                  <li>All budgets and budget settings</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  Type <span className="font-mono font-bold">DELETE</span> to confirm:
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                  placeholder="Type DELETE to confirm"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText('');
                    }}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleDeleteAccount}
                    disabled={!canDelete || isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Account'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </main>
  );
}
