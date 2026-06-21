'use client';

import { Sun, Moon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@handharr-labs/ui-xpnsio';
import { useSettingsViewModel } from '../hooks/useSettingsViewModel';

export function SettingsView() {
  const {
    theme,
    toggleTheme,
    isSigningOut,
    isDeleting,
    showDeleteConfirm,
    deleteConfirmText,
    canDelete,
    updateDeleteConfirmText,
    handleSignOut,
    handleDeleteAccount,
    openDeleteConfirm,
    cancelDeleteConfirm,
  } = useSettingsViewModel();

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="typo-page-title">Settings</h1>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Theme</p>
                <p className="text-xs text-muted-foreground">Choose between light and dark mode</p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 rounded-xl ring-1 ring-border bg-muted/50 hover:bg-muted text-sm font-medium transition-colors min-h-[44px]"
              >
                {theme === 'dark' ? (
                  <><Sun className="w-4 h-4" /> Light</>
                ) : (
                  <><Moon className="w-4 h-4" /> Dark</>
                )}
              </button>
            </div>
          </CardContent>
        </Card>

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
              className="w-full text-red-400 hover:text-red-300 border-red-500/30 hover:bg-red-500/10"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? 'Signing out...' : 'Sign Out'}
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-400">Danger Zone</CardTitle>
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
                  onClick={openDeleteConfirm}
                >
                  Delete Account
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-red-400 font-medium">
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
                  onChange={(e) => updateDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={cancelDeleteConfirm}
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
