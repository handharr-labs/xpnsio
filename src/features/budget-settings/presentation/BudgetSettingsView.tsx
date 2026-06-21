'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FileText } from 'lucide-react';
import { Button } from '@handharr-labs/ui-xpnsio';
import { ROUTES } from '@/shared/presentation/navigation/routes';
import { useBudgetSettingsViewModel } from './useBudgetSettingsViewModel';
import { BudgetSettingCard } from './organisms/BudgetSettingCard';

export function BudgetSettingsView() {
  const router = useRouter();
  const { budgetSettings, isLoading, error, applyBudgetSetting, deleteBudgetSetting } =
    useBudgetSettingsViewModel();

  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [applySuccessId, setApplySuccessId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleApply = async (id: string) => {
    const now = new Date();
    const setting = budgetSettings.find((s) => s.id === id);
    const starterDay = setting?.starterDay ?? 1;
    // If today is on or past the starterDay, we've rolled into the next billing period.
    const calendarMonth = now.getMonth() + 1;
    const calendarYear = now.getFullYear();
    const isInNextPeriod = now.getDate() >= starterDay;
    const month = isInNextPeriod ? (calendarMonth === 12 ? 1 : calendarMonth + 1) : calendarMonth;
    const year = isInNextPeriod && calendarMonth === 12 ? calendarYear + 1 : calendarYear;
    setApplyingId(id);
    setActionError(null);
    setApplySuccessId(null);
    try {
      await applyBudgetSetting({
        budgetSettingId: id,
        year,
        month,
      });
      setApplySuccessId(id);
      setTimeout(() => setApplySuccessId(null), 3000);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to apply');
    } finally {
      setApplyingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await deleteBudgetSetting(deletingId);
    } catch {
      // error handled by hook
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Content Container - PWA safe area padding */}
      <div className="px-4 pt-4 pb-[calc(5rem+env(safe-area-inset-bottom))] md:px-6 md:pt-6 md:pb-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <header className="flex items-center justify-between min-h-[44px]">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Budget Templates</h1>
            <Button
              onClick={() => router.push(ROUTES.budgetSettingNew)}
              className="h-11 rounded-xl gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Template</span>
            </Button>
          </header>

          {/* Error State */}
          {(error || actionError) && (
            <div className="rounded-xl bg-red-500/10 ring-1 ring-red-500/20 p-4 text-sm text-red-700 dark:text-red-400">
              {error ?? actionError}
            </div>
          )}

          {/* Apply Success Banner */}
          {applySuccessId && (
            <div className="rounded-xl bg-green-500/10 ring-1 ring-green-500/20 p-4 text-sm text-green-700 dark:text-green-400">
              Budget applied to current month!
            </div>
          )}

          {/* Delete Confirmation Banner */}
          {deletingId && (
            <div className="rounded-xl bg-yellow-500/10 ring-1 ring-yellow-500/20 p-4 text-sm space-y-3">
              <p className="text-yellow-700 dark:text-yellow-400">
                Delete &ldquo;{budgetSettings.find((s) => s.id === deletingId)?.name}&rdquo;? This cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteConfirm}
                  className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeletingId(null)}
                  className="px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs font-medium hover:bg-muted/80"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-48 w-full rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : budgetSettings.length === 0 ? (
            /* Empty State */
            <div className="rounded-2xl ring-1 ring-border border-dashed p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                <FileText className="w-7 h-7 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold">No budget templates yet</p>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                  Create a budget template to quickly apply pre-configured budgets to any month.
                </p>
              </div>
              <Button
                onClick={() => router.push(ROUTES.budgetSettingNew)}
                size="lg"
                className="mt-2"
              >
                Create Your First Template
              </Button>
            </div>
          ) : (
            /* Budget Settings Grid */
            <div className="grid gap-4 md:grid-cols-2">
              {budgetSettings.map((setting) => (
                <BudgetSettingCard
                  key={setting.id}
                  setting={setting}
                  isApplying={applyingId === setting.id}
                  onApply={handleApply}
                  onEdit={(id) => router.push(ROUTES.budgetSettingEdit(id))}
                  onDelete={(id) => setDeletingId(id)}   
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
