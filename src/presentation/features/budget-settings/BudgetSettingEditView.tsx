'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBudgetSettingsViewModel } from './useBudgetSettingsViewModel';
import { getCategoriesAction } from '@/app/actions/categories';
import { CurrencyInput } from '@/presentation/common/CurrencyInput';
import { formatCurrency } from '@/core/utils/formatCurrency';
import { ROUTES } from '@/presentation/navigation/routes';
import type { Category } from '@/lib/schema';

const CURRENCY_OPTIONS = [
  { value: 'IDR', label: 'IDR — Indonesian Rupiah' },
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'SGD', label: 'SGD — Singapore Dollar' },
  { value: 'MYR', label: 'MYR — Malaysian Ringgit' },
  { value: 'EUR', label: 'EUR — Euro' },
];

type AllocationItem = {
  categoryId: string;
  monthlyAmount: number;
};

export function BudgetSettingEditView({ id }: { id: string }) {
  const router = useRouter();
  const { budgetSettings, isLoading, updateBudgetSetting } = useBudgetSettingsViewModel();

  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('IDR');
  const [totalMonthlyBudget, setTotalMonthlyBudget] = useState(0);
  const [allocations, setAllocations] = useState<AllocationItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    getCategoriesAction({}).then((result) => {
      if (result?.data) setCategories(result.data);
    });
  }, []);

  useEffect(() => {
    if (!isLoading && !initialized) {
      const setting = budgetSettings.find((s) => s.id === id);
      if (setting) {
        setName(setting.name);
        setCurrency(setting.currency ?? 'IDR');
        setTotalMonthlyBudget(parseFloat(setting.totalMonthlyBudget));
        setAllocations(
          setting.items.map((item) => ({
            categoryId: item.categoryId,
            monthlyAmount: parseFloat(item.monthlyAmount),
          }))
        );
        setInitialized(true);
      }
    }
  }, [budgetSettings, isLoading, id, initialized]);

  const totalAllocated = allocations.reduce((sum, a) => sum + (a.monthlyAmount || 0), 0);
  const remaining = totalMonthlyBudget - totalAllocated;

  const addAllocation = () => {
    const unusedCategory = categories.find(
      (c) => !allocations.some((a) => a.categoryId === c.id)
    );
    if (unusedCategory) {
      setAllocations((prev) => [...prev, { categoryId: unusedCategory.id, monthlyAmount: 0 }]);
    }
  };

  const updateAllocation = (index: number, field: keyof AllocationItem, value: string | number) => {
    setAllocations((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeAllocation = (index: number) => {
    setAllocations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) { setError('Name is required'); return; }
    if (!totalMonthlyBudget || totalMonthlyBudget <= 0) { setError('Total monthly budget must be positive'); return; }

    setIsSubmitting(true);
    try {
      await updateBudgetSetting({
        id,
        name: name.trim(),
        totalMonthlyBudget,
        currency,
        items: allocations.filter((a) => a.monthlyAmount > 0),
      });
      router.push(ROUTES.budgetSettings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update budget setting');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !initialized) {
    return <main className="min-h-screen p-6"><p className="text-muted-foreground">Loading...</p></main>;
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>← Back</Button>
          <h1 className="text-2xl font-bold">Edit Budget Setting</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
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
                <label className="text-sm font-medium">Total Monthly Budget</label>
                <CurrencyInput
                  value={totalMonthlyBudget}
                  onChange={setTotalMonthlyBudget}
                  currency={currency}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Category Allocations</span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addAllocation}
                  disabled={allocations.length >= categories.length}
                >
                  + Add Category
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {allocations.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No allocations yet.</p>
              )}
              {allocations.map((alloc, index) => (
                <div key={index} className="flex items-center gap-3">
                  <select
                    className="flex-1 rounded-md border px-3 py-2 text-sm"
                    value={alloc.categoryId}
                    onChange={(e) => updateAllocation(index, 'categoryId', e.target.value)}
                  >
                    {categories.map((cat) => (
                      <option
                        key={cat.id}
                        value={cat.id}
                        disabled={allocations.some((a, i) => i !== index && a.categoryId === cat.id)}
                      >
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <CurrencyInput
                    value={alloc.monthlyAmount}
                    onChange={(v) => updateAllocation(index, 'monthlyAmount', v)}
                    currency={currency}
                    className="w-44"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => removeAllocation(index)}
                    className="text-red-600"
                  >
                    ×
                  </Button>
                </div>
              ))}

              {totalMonthlyBudget > 0 && (
                <div className="border-t pt-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Budget</span>
                    <span>{formatCurrency(totalMonthlyBudget, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Allocated</span>
                    <span>{formatCurrency(totalAllocated, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>Unallocated</span>
                    <span className={remaining < 0 ? 'text-red-600' : 'text-green-600'}>
                      {formatCurrency(remaining, currency)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
