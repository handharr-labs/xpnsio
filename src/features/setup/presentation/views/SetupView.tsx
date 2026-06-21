'use client';

import { useRouter } from 'next/navigation';
import { Layers, Wallet, Settings, CheckCircle2, Plus, Trash2, Check } from 'lucide-react';
import { Button, CurrencyInput } from '@handharr-labs/ui-xpnsio';
import { formatCurrency } from '@handharr-labs/core';
import { ROUTES } from '@/shared/presentation/navigation/routes';
import { CURRENCY_OPTIONS } from '@/shared/presentation/constants/currencyOptions';
import { useSetupViewModel } from '../hooks/useSetupViewModel';
import type { SetupCategory } from '../hooks/useSetupViewModel';
import { getOrdinalSuffix } from '@/shared/core/utils/formatOrdinal';

const COLOR_OPTIONS = [
  '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6',
  '#8b5cf6', '#ef4444', '#14b8a6', '#f97316', '#84cc16',
];

const STEPS = [
  { id: 1, label: 'Categories', Icon: Layers },
  { id: 2, label: 'Amounts', Icon: Wallet },
  { id: 3, label: 'Settings', Icon: Settings },
  { id: 4, label: 'Review', Icon: CheckCircle2 },
];

export function SetupView() {
  const router = useRouter();
  const {
    step,
    setStep,
    categories,
    budgetName,
    setBudgetName,
    currency,
    setCurrency,
    startDay,
    setStartDay,
    totalAllocated,
    addCategory,
    updateCategory,
    removeCategory,
    isSubmitting,
    error,
    completeSetup,
  } = useSetupViewModel();

  const handleComplete = async () => {
    try {
      await completeSetup();
      router.push(ROUTES.dashboard);
    } catch {
      // error set by ViewModel
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="px-4 pt-6 pb-8 md:px-6 md:pt-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome to Xpnsio</h1>
            <p className="text-muted-foreground">
              {"Let's set up your budget in a few quick steps."}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="space-y-4">
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
            <div className="flex justify-between">
              {STEPS.map((s) => {
                const isActive = step === s.id;
                const isCompleted = step > s.id;
                const Icon = s.Icon;
                return (
                  <div
                    key={s.id}
                    className={`flex items-center gap-2 ${
                      isActive ? 'text-primary' : isCompleted ? 'text-primary/60' : 'text-muted-foreground'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : isCompleted
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span className="text-xs font-medium hidden sm:inline">{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl bg-red-500/10 ring-1 ring-red-500/20 p-4 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Step 1: Categories */}
          {step === 1 && (
            <div className="rounded-2xl ring-1 ring-border bg-card overflow-hidden">
              <div className="p-5 border-b border-border">
                <h2 className="typo-section-title">Step 1: Your Categories</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {"We've added some defaults. Customize or add your own."}
                </p>
              </div>
              <div className="p-5 space-y-3">
                {(categories as SetupCategory[]).map((cat, index) => (
                  <div key={index} className="rounded-xl ring-1 ring-border p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        className="flex-1 h-11 px-4 rounded-lg bg-muted/50 ring-1 ring-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        value={cat.name}
                        onChange={(e) => updateCategory(index, 'name', e.target.value)}
                        placeholder="Category name"
                      />
                      <button
                        type="button"
                        className="flex items-center justify-center w-11 h-11 rounded-lg hover:bg-red-500/10 text-red-600 transition-colors"
                        onClick={() => removeCategory(index)}
                        aria-label="Remove category"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex rounded-lg ring-1 ring-border overflow-hidden">
                        {(['daily', 'weekly', 'monthly'] as const).map((m) => (
                          <button
                            key={m}
                            type="button"
                            className={`px-3 py-2 text-xs font-medium capitalize transition-colors min-h-[36px] ${
                              cat.masterCategory === m
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted/50 hover:bg-muted'
                            }`}
                            onClick={() => updateCategory(index, 'masterCategory', m)}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-1.5">
                        {COLOR_OPTIONS.slice(0, 6).map((c) => (
                          <button
                            key={c}
                            type="button"
                            className={`w-7 h-7 rounded-full transition-all ${
                              cat.color === c ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110' : 'hover:scale-105'
                            }`}
                            style={{ backgroundColor: c }}
                            onClick={() => updateCategory(index, 'color', c)}
                            aria-label={`Select color ${c}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 rounded-xl gap-2"
                  onClick={addCategory}
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </Button>
              </div>
              <div className="p-5 border-t border-border">
                <Button
                  className="w-full h-12 rounded-xl"
                  onClick={() => setStep(2)}
                  disabled={(categories as SetupCategory[]).filter((c) => c.name.trim()).length === 0}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Budget amounts */}
          {step === 2 && (
            <div className="rounded-2xl ring-1 ring-border bg-card overflow-hidden">
              <div className="p-5 border-b border-border">
                <h2 className="typo-section-title">Step 2: Set Budget Amounts</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  How much do you want to budget for each category per month?
                </p>
              </div>
              <div className="p-5 space-y-3">
                {(categories as SetupCategory[]).map((cat, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-xl ring-1 ring-border">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{cat.name || 'Unnamed'}</p>
                        <p className="text-xs text-muted-foreground capitalize">{cat.masterCategory}</p>
                      </div>
                    </div>
                    <CurrencyInput
                      value={cat.amount}
                      onChange={(v) => updateCategory(index, 'amount', v)}
                      currencyLabel={currency}
                      className="w-40"
                    />
                  </div>
                ))}
                {totalAllocated > 0 && (
                  <div className="rounded-xl bg-primary/10 ring-1 ring-primary/20 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Monthly Budget</span>
                      <span className="text-lg font-bold text-primary">
                        {formatCurrency(totalAllocated, currency)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-5 border-t border-border flex gap-3">
                <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-1 h-12 rounded-xl" onClick={() => setStep(3)}>Continue</Button>
              </div>
            </div>
          )}

          {/* Step 3: Name + Currency */}
          {step === 3 && (
            <div className="rounded-2xl ring-1 ring-border bg-card overflow-hidden">
              <div className="p-5 border-b border-border">
                <h2 className="typo-section-title">Step 3: Budget Settings</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Name your budget and choose your preferences.
                </p>
              </div>
              <div className="p-5 space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Budget Name</label>
                  <input
                    className="w-full h-12 px-4 rounded-xl bg-muted/50 ring-1 ring-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    value={budgetName}
                    onChange={(e) => setBudgetName(e.target.value)}
                    placeholder="My Budget"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Currency</label>
                  <select
                    className="w-full h-12 px-4 rounded-xl bg-muted/50 ring-1 ring-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    {CURRENCY_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Budget Start Day</label>
                  <select
                    className="w-full h-12 px-4 rounded-xl bg-muted/50 ring-1 ring-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                    value={startDay}
                    onChange={(e) => setStartDay(Number(e.target.value))}
                  >
                    {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>{day}{getOrdinalSuffix(day)} of each month</option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">The day when your monthly budget period starts.</p>
                </div>
              </div>
              <div className="p-5 border-t border-border flex gap-3">
                <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setStep(2)}>Back</Button>
                <Button className="flex-1 h-12 rounded-xl" onClick={() => setStep(4)}>Continue</Button>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="rounded-2xl ring-1 ring-border bg-card overflow-hidden">
              <div className="p-5 border-b border-border">
                <h2 className="typo-section-title">Step 4: Review & Confirm</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {"Here's your budget summary. Ready to get started?"}
                </p>
              </div>
              <div className="p-5 space-y-5">
                <div className="rounded-xl bg-muted/30 ring-1 ring-border p-5 space-y-4">
                  <div className="text-center pb-4 border-b border-dashed border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Budget</p>
                    <p className="text-xl font-bold mt-1">{budgetName}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {currency} · Starts on the {startDay}{getOrdinalSuffix(startDay)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="typo-section-label text-muted-foreground">
                      Categories ({(categories as SetupCategory[]).filter((c) => c.name.trim()).length})
                    </p>
                    {(categories as SetupCategory[]).filter((c) => c.name.trim()).map((cat, i) => (
                      <div key={i} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span className="text-sm">{cat.name}</span>
                          <span className="text-xs text-muted-foreground capitalize">({cat.masterCategory})</span>
                        </div>
                        {cat.amount > 0 && (
                          <span className="text-sm font-medium">{formatCurrency(cat.amount, currency)}</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-dashed border-border">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total Monthly</span>
                      <span className="text-xl font-bold text-primary">{formatCurrency(totalAllocated, currency)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  This budget will be applied to the current month automatically.
                </p>
              </div>
              <div className="p-5 border-t border-border flex gap-3">
                <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setStep(3)}>Back</Button>
                <Button
                  className="flex-1 h-12 rounded-xl"
                  onClick={handleComplete}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Setting up...' : 'Complete Setup'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
