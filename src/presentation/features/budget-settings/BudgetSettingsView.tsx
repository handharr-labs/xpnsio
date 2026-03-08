'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBudgetSettingsViewModel } from './useBudgetSettingsViewModel';
import { ROUTES } from '@/presentation/navigation/routes';

const formatIDR = (amount: number | string) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
    typeof amount === 'string' ? parseFloat(amount) : amount
  );

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
              <Card key={setting.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{setting.name}</span>
                    <span className="text-base font-normal text-muted-foreground">
                      {formatIDR(setting.totalMonthlyBudget)} / month
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {setting.items.length} categor{setting.items.length === 1 ? 'y' : 'ies'} allocated
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(ROUTES.budgetSettingEdit(setting.id))}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApply(setting.id)}
                      disabled={applyingId === setting.id}
                    >
                      {applyingId === setting.id ? 'Applying...' : 'Apply to This Month'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(setting.id, setting.name)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
