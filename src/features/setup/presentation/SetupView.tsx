'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSetupViewModel } from './useSetupViewModel';
import type { SetupCategory } from './useSetupViewModel';
import { CurrencyInput } from '@/shared/presentation/common/CurrencyInput';
import { formatCurrency } from '@/shared/core/utils/formatCurrency';
import { ROUTES } from '@/shared/presentation/navigation/routes';

const CURRENCY_OPTIONS = [
  { value: 'IDR', label: 'IDR — Indonesian Rupiah' },
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'SGD', label: 'SGD — Singapore Dollar' },
  { value: 'MYR', label: 'MYR — Malaysian Ringgit' },
  { value: 'EUR', label: 'EUR — Euro' },
];

const COLOR_OPTIONS = [
  '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6',
  '#8b5cf6', '#ef4444', '#14b8a6', '#f97316', '#84cc16',
];

const DEFAULT_CATEGORIES: SetupCategory[] = [
  { name: 'Food & Dining', masterCategory: 'daily', color: '#f59e0b', icon: 'food', amount: 0 },
  { name: 'Transport', masterCategory: 'daily', color: '#3b82f6', icon: 'car', amount: 0 },
  { name: 'Shopping', masterCategory: 'monthly', color: '#ec4899', icon: 'shopping', amount: 0 },
  { name: 'Health', masterCategory: 'monthly', color: '#10b981', icon: 'health', amount: 0 },
];

export function SetupView() {
  const router = useRouter();
  const { isSubmitting, error, completeSetup } = useSetupViewModel();

  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<SetupCategory[]>(DEFAULT_CATEGORIES);
  const [budgetName, setBudgetName] = useState('My Budget');
  const [currency, setCurrency] = useState('IDR');
  const [startDay, setStartDay] = useState(1);

  const totalAllocated = categories.reduce((sum, c) => sum + (c.amount || 0), 0);

  const addCategory = () => {
    setCategories((prev) => [
      ...prev,
      { name: '', masterCategory: 'monthly', color: '#6366f1', icon: 'circle', amount: 0 },
    ]);
  };

  const updateCategory = (index: number, field: keyof SetupCategory, value: string | number) => {
    setCategories((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  };

  const removeCategory = (index: number) => {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    try {
      await completeSetup({ categories, budgetName, currency, totalBudget: totalAllocated, startDay });
      router.push(ROUTES.dashboard);
    } catch {
      // error set by ViewModel
    }
  };

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Welcome to Xpnsio</h1>
          <p className="text-muted-foreground">Let&apos;s set up your budget in a few quick steps.</p>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-muted'}`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-right">Step {step} of 4</p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
        )}

        {/* Step 1: Categories */}
        {step === 1 && (
          <Card>
            <CardHeader><CardTitle>Step 1: Your Categories</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">We&apos;ve added some defaults. Customize or add your own.</p>
              {categories.map((cat, index) => (
                <div key={index} className="space-y-2 rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <input
                      className="flex-1 rounded-md border px-3 py-2 text-sm"
                      value={cat.name}
                      onChange={(e) => updateCategory(index, 'name', e.target.value)}
                      placeholder="Category name"
                    />
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 text-lg font-bold px-2"
                      onClick={() => removeCategory(index)}
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex gap-2 items-center">
                    <select
                      className="flex-1 rounded-md border px-2 py-1 text-xs"
                      value={cat.masterCategory}
                      onChange={(e) => updateCategory(index, 'masterCategory', e.target.value)}
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
                          className={`w-5 h-5 rounded-full border-2 ${cat.color === c ? 'border-foreground' : 'border-transparent'}`}
                          style={{ backgroundColor: c }}
                          onClick={() => updateCategory(index, 'color', c)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" className="w-full" onClick={addCategory}>
                + Add Category
              </Button>
              <Button
                className="w-full"
                onClick={() => setStep(2)}
                disabled={categories.filter((c) => c.name.trim()).length === 0}
              >
                Next →
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Budget amounts */}
        {step === 2 && (
          <Card>
            <CardHeader><CardTitle>Step 2: Set Budget Amounts</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                How much do you want to budget for each category per month?
              </p>

              <div className="space-y-2">
                {categories.map((cat, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm">{cat.name || 'Unnamed'}</span>
                    </div>
                    <CurrencyInput
                      value={cat.amount}
                      onChange={(v) => updateCategory(index, 'amount', v)}
                      currency={currency}
                      className="w-44"
                    />
                  </div>
                ))}
              </div>

              {totalAllocated > 0 && (
                <div className="border-t pt-3 text-sm">
                  <div className="flex justify-between font-medium">
                    <span>Total Monthly Budget</span>
                    <span>{formatCurrency(totalAllocated, currency)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total is calculated from your category budgets.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>← Back</Button>
                <Button className="flex-1" onClick={() => setStep(3)}>Next →</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Name + Currency */}
        {step === 3 && (
          <Card>
            <CardHeader><CardTitle>Step 3: Name Your Budget</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Budget Name</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={budgetName}
                  onChange={(e) => setBudgetName(e.target.value)}
                  placeholder="My Budget"
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
                <label className="text-sm font-medium">Budget Start Day</label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={startDay}
                  onChange={(e) => setStartDay(Number(e.target.value))}
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}{day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : day === 21 || day === 22 || day === 23 ? (day === 21 ? 'st' : day === 22 ? 'nd' : 'rd') : 'th'}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  The day of the month when your budget period starts (e.g., 1st, 15th, 25th).
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>← Back</Button>
                <Button className="flex-1" onClick={() => setStep(4)}>Next →</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <Card>
            <CardHeader><CardTitle>Step 4: Review & Confirm</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="rounded-lg bg-muted p-3 space-y-1">
                  <p className="text-sm font-medium">Budget: {budgetName}</p>
                  <p className="text-sm text-muted-foreground">
                    {currency} · {formatCurrency(totalAllocated, currency)} / month
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Starts on the {startDay}{startDay === 1 ? 'st' : startDay === 2 ? 'nd' : startDay === 3 ? 'rd' : 'th'} of each month
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Categories ({categories.filter((c) => c.name.trim()).length})</p>
                  {categories.filter((c) => c.name.trim()).map((cat, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span>{cat.name}</span>
                        <span className="text-xs text-muted-foreground">({cat.masterCategory})</span>
                      </div>
                      {cat.amount > 0 && (
                        <span className="text-muted-foreground">{formatCurrency(cat.amount, currency)}</span>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground">
                  This budget will be applied to the current month automatically.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(3)}>← Back</Button>
                <Button className="flex-1" onClick={handleComplete} disabled={isSubmitting}>
                  {isSubmitting ? 'Setting up...' : 'Complete Setup'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
