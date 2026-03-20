'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBudgetSettingsViewModel } from './useBudgetSettingsViewModel';
import { BudgetSettingCard } from './organisms/BudgetSettingCard';
import { ROUTES } from '@/shared/presentation/navigation/routes';

export function BudgetSettingsView() {
  const router = useRouter();
  const { budgetSettings, isLoading, error, applyBudgetSetting, deleteBudgetSetting } =
    useBudgetSettingsViewModel();

  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleApply = async (id: string) => {
    const now = new Date();
    setApplyingId(id);
    setActionError(null);
    try {
      await applyBudgetSetting({
        budgetSettingId: id,
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      });
      alert('Budget applied to current month!');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to apply');
    } finally {
      setApplyingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteBudgetSetting(id);
    } catch {
      // error handled by hook
    }
  };

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Budget Settings</h1>
          <Button onClick={() => router.push(ROUTES.budgetSettingNew)}>
            + New Budget Setting
          </Button>
        </div>

        {(error || actionError) && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error ?? actionError}
          </div>
        )}

        {isLoading ? (
          <p className="text-muted-foreground">Loading budget settings...</p>
        ) : budgetSettings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No budget settings yet. Create one to get started!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {budgetSettings.map((setting) => (
              <BudgetSettingCard
                key={setting.id}
                setting={setting}
                isApplying={applyingId === setting.id}
                onApply={handleApply}
                onEdit={(id) => router.push(ROUTES.budgetSettingEdit(id))}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
