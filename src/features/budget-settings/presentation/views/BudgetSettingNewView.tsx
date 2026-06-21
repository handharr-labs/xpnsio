'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button, CurrencyInput } from '@handharr-labs/ui-xpnsio';
import { ROUTES } from '@/shared/presentation/navigation/routes';
import { CURRENCY_OPTIONS } from '@/shared/presentation/constants/currencyOptions';
import { useBudgetSettingNewViewModel } from '../hooks/useBudgetSettingNewViewModel';

const COLOR_OPTIONS = [
  '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6',
  '#8b5cf6', '#ef4444', '#14b8a6', '#f97316', '#84cc16',
];

type CategoryItem = {
  id: string;
  name: string;
  masterCategory: 'daily' | 'weekly' | 'monthly';
  color: string;
  icon: string;
  monthlyAmount: number;
};

export function BudgetSettingNewView() {
  const router = useRouter();
  const { isSubmitting, error, createBudgetSettingWithCategories } = useBudgetSettingNewViewModel();

  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('IDR');
  const [starterDay, setStarterDay] = useState(1);
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  const totalAllocated = items.reduce((sum, item) => sum + (item.monthlyAmount || 0), 0);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: '', masterCategory: 'monthly', color: '#6366f1', icon: 'circle', monthlyAmount: 0 },
    ]);
  };

  const updateItem = (index: number, field: keyof CategoryItem, value: string | number) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!name.trim()) { setLocalError('Name is required'); return; }

    try {
      await createBudgetSettingWithCategories({
        name: name.trim(),
        currency,
        starterDay,
        items,
      });
      router.push(ROUTES.budgetSettings);
    } catch {
      // error set by ViewModel
    }
  };

  const displayError = localError ?? error;

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>← Back</Button>
          <h1 className="typo-page-title">New Budget Setting</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {displayError && (
            <div className="rounded-md bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 p-3 text-sm text-red-700 dark:text-red-400">
              {displayError}
            </div>
          )}

          <Card>
            <CardHeader><CardTitle>Basic Info</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Setting Name</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Monthly Budget"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Currency</label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  {CURRENCY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Budget Starts On Day</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={starterDay}
                  onChange={(e) => setStarterDay(Math.min(28, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                />
                <p className="text-xs text-muted-foreground">
                  Day of month when your budget cycle begins (e.g., 27 for salary-based cycles)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Categories</span>
                <Button type="button" size="sm" variant="outline" onClick={addItem}>
                  + Add Category
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No categories yet. Add categories to allocate budget.
                </p>
              )}

              {items.map((item, index) => (
                <div key={item.id} className="space-y-2 rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <input
                      className="flex-1 rounded-md border px-3 py-2 text-sm"
                      value={item.name}
                      onChange={(e) => updateItem(index, 'name', e.target.value)}
                      placeholder="Category name"
                    />
                    <button
                      type="button"
                      className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-lg font-bold px-2"
                      onClick={() => removeItem(index)}
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex gap-2 items-center">
                    <select
                      className="flex-1 rounded-md border px-2 py-1 text-xs"
                      value={item.masterCategory}
                      onChange={(e) => updateItem(index, 'masterCategory', e.target.value)}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                    <div className="flex gap-1">
                      {COLOR_OPTIONS.slice(0, 5).map((c) => (
                        <button
                          key={c}
                          type="button"
                          className={`w-5 h-5 rounded-full border-2 ${item.color === c ? 'border-foreground' : 'border-transparent'}`}
                          style={{ backgroundColor: c }}
                          onClick={() => updateItem(index, 'color', c)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Monthly budget</label>
                    <CurrencyInput
                      value={item.monthlyAmount}
                      onChange={(v) => updateItem(index, 'monthlyAmount', v)}
                      currencyLabel={currency}
                    />
                  </div>
                </div>
              ))}

            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Budget Setting'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
