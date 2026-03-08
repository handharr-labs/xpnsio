'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createCategoryAction } from '@/app/actions/categories';
import { createBudgetSettingAction, applyBudgetSettingAction } from '@/app/actions/budget-settings';
import { ROUTES } from '@/presentation/navigation/routes';

const formatIDR = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

const COLOR_OPTIONS = [
  '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6',
  '#8b5cf6', '#ef4444', '#14b8a6', '#f97316', '#84cc16',
];

type SetupCategory = {
  name: string;
  type: 'expense' | 'income';
  masterCategory: 'daily' | 'weekly' | 'monthly' | '';
  color: string;
  icon: string;
  amount: number;
};

const DEFAULT_CATEGORIES: SetupCategory[] = [
  { name: 'Food & Dining', type: 'expense', masterCategory: 'daily', color: '#f59e0b', icon: 'food', amount: 0 },
  { name: 'Transport', type: 'expense', masterCategory: 'daily', color: '#3b82f6', icon: 'car', amount: 0 },
  { name: 'Shopping', type: 'expense', masterCategory: 'monthly', color: '#ec4899', icon: 'shopping', amount: 0 },
  { name: 'Health', type: 'expense', masterCategory: 'monthly', color: '#10b981', icon: 'health', amount: 0 },
  { name: 'Salary', type: 'income', masterCategory: '', color: '#6366f1', icon: 'circle', amount: 0 },
];

export function SetupView() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<SetupCategory[]>(DEFAULT_CATEGORIES);
  const [budgetName, setBudgetName] = useState('My Budget');
  const [totalBudget, setTotalBudget] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const totalAllocated = expenseCategories.reduce((sum, c) => sum + (c.amount || 0), 0);
  const totalBudgetNum = parseFloat(totalBudget) || 0;

  const addCategory = () => {
    setCategories((prev) => [
      ...prev,
      { name: '', type: 'expense', masterCategory: 'monthly', color: '#6366f1', icon: 'circle', amount: 0 },
    ]);
  };

  const updateCategory = (index: number, field: keyof SetupCategory, value: string | number) => {
    setCategories((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };

  const removeCategory = (index: number) => {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      // Step 1: Create all categories
      const createdCategories: Array<{ id: string; name: string; type: string; amount: number }> = [];
      for (const cat of categories) {
        if (!cat.name.trim()) continue;
        const result = await createCategoryAction({
          name: cat.name.trim(),
          type: cat.type,
          masterCategory:
            cat.type === 'expense' && cat.masterCategory
              ? (cat.masterCategory as 'daily' | 'weekly' | 'monthly')
              : undefined,
          color: cat.color,
          icon: cat.icon,
        });
        if (result?.data) {
          createdCategories.push({
            id: result.data.id,
            name: result.data.name,
            type: result.data.type,
            amount: cat.amount,
          });
        }
      }

      // Step 2: Create budget setting
      const expenseItems = createdCategories
        .filter((c) => c.type === 'expense' && c.amount > 0)
        .map((c) => ({ categoryId: c.id, monthlyAmount: c.amount }));

      const settingResult = await createBudgetSettingAction({
        name: budgetName.trim() || 'My Budget',
        totalMonthlyBudget: totalBudgetNum || totalAllocated,
        items: expenseItems,
      });

      if (!settingResult?.data) {
        throw new Error(settingResult?.serverError ?? 'Failed to create budget setting');
      }

      // Step 3: Apply to current month
      const now = new Date();
      await applyBudgetSettingAction({
        budgetSettingId: settingResult.data.id,
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      });

      router.push(ROUTES.dashboard);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Setup failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress indicator */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Welcome to Xpnsio</h1>
          <p className="text-muted-foreground">
            Let's set up your budget in a few quick steps.
          </p>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-right">Step {step} of 4</p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Step 1: Create categories */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Your Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                We've added some defaults. Customize or add your own.
              </p>
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
                  <div className="flex gap-2">
                    <select
                      className="flex-1 rounded-md border px-2 py-1 text-xs"
                      value={cat.type}
                      onChange={(e) => updateCategory(index, 'type', e.target.value)}
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                    {cat.type === 'expense' && (
                      <select
                        className="flex-1 rounded-md border px-2 py-1 text-xs"
                        value={cat.masterCategory}
                        onChange={(e) => updateCategory(index, 'masterCategory', e.target.value)}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    )}
                    <div className="flex gap-1">
                      {COLOR_OPTIONS.slice(0, 5).map((c) => (
                        <button
                          key={c}
                          type="button"
                          className={`w-5 h-5 rounded-full border-2 ${
                            cat.color === c ? 'border-foreground' : 'border-transparent'
                          }`}
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
            <CardHeader>
              <CardTitle>Step 2: Set Budget Amounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                How much do you want to budget for each expense category per month?
              </p>

              <div className="space-y-1">
                <label className="text-sm font-medium">Total Monthly Budget (IDR)</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  type="number"
                  min="0"
                  step="100000"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                  placeholder="e.g. 5000000"
                />
              </div>

              <div className="space-y-2">
                {expenseCategories.map((cat, index) => {
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-sm">{cat.name || 'Unnamed'}</span>
                      </div>
                      <input
                        className="w-36 rounded-md border px-3 py-2 text-sm"
                        type="number"
                        min="0"
                        step="10000"
                        value={cat.amount || ''}
                        onChange={(e) => {
                          const idx = categories.indexOf(cat);
                          updateCategory(idx, 'amount', parseFloat(e.target.value) || 0);
                        }}
                        placeholder="Amount"
                      />
                    </div>
                  );
                })}
              </div>

              {totalAllocated > 0 && (
                <div className="border-t pt-3 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Allocated</span>
                    <span>{formatIDR(totalAllocated)}</span>
                  </div>
                  {totalBudgetNum > 0 && (
                    <div className="flex justify-between font-medium">
                      <span>Remaining</span>
                      <span
                        className={
                          totalBudgetNum - totalAllocated < 0 ? 'text-red-600' : 'text-green-600'
                        }
                      >
                        {formatIDR(totalBudgetNum - totalAllocated)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                  ← Back
                </Button>
                <Button className="flex-1" onClick={() => setStep(3)}>
                  Next →
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Name the budget */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Name Your Budget</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Give your budget setting a name so you can apply it to future months.
              </p>
              <div className="space-y-1">
                <label className="text-sm font-medium">Budget Name</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={budgetName}
                  onChange={(e) => setBudgetName(e.target.value)}
                  placeholder="My Budget"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                  ← Back
                </Button>
                <Button className="flex-1" onClick={() => setStep(4)}>
                  Next →
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review & Confirm */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 4: Review & Confirm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="rounded-lg bg-muted p-3 space-y-1">
                  <p className="text-sm font-medium">Budget: {budgetName}</p>
                  <p className="text-sm text-muted-foreground">
                    Total: {totalBudgetNum > 0 ? formatIDR(totalBudgetNum) : formatIDR(totalAllocated)} / month
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Categories ({categories.filter((c) => c.name.trim()).length})</p>
                  {categories
                    .filter((c) => c.name.trim())
                    .map((cat, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span>{cat.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({cat.type === 'income' ? 'income' : cat.masterCategory})
                          </span>
                        </div>
                        {cat.type === 'expense' && cat.amount > 0 && (
                          <span className="text-muted-foreground">{formatIDR(cat.amount)}</span>
                        )}
                      </div>
                    ))}
                </div>

                <p className="text-xs text-muted-foreground">
                  This budget will be applied to the current month automatically.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(3)}>
                  ← Back
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleComplete}
                  disabled={isSubmitting}
                >
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
