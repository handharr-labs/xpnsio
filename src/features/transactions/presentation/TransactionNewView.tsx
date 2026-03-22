'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransactionNewViewModel } from './useTransactionNewViewModel';
import { CurrencyInput } from '@/shared/presentation/common/atoms/CurrencyInput';
import { ROUTES } from '@/shared/presentation/navigation/routes';

export function TransactionNewView() {
  const router = useRouter();
  const { categories, isSubmitting, error, createTransaction } = useTransactionNewViewModel();

  const [amount, setAmount] = useState(0);
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!amount || amount <= 0) {
      setLocalError('Amount must be a positive number');
      return;
    }
    if (!date) {
      setLocalError('Date is required');
      return;
    }

    try {
      await createTransaction({
        amount,
        type: 'expense',
        categoryId: categoryId || undefined,
        description: description.trim() || undefined,
        date,
      });
      router.push(ROUTES.dashboard);
    } catch {
      // error set by ViewModel
    }
  };

  const displayError = localError ?? error;
  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <main className="min-h-screen">
      <div className="px-4 pt-4 pb-8 md:px-6 md:pt-6">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <header className="flex items-center gap-3 mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-11 h-11 rounded-xl bg-zinc-800/50 hover:bg-zinc-700 transition-colors text-white"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-white">New Expense</h1>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Error */}
            {displayError && (
              <div className="rounded-xl bg-red-500/10 ring-1 ring-red-500/20 p-4 text-sm text-red-700 dark:text-red-400">
                {displayError}
              </div>
            )}

            {/* Amount - Hero Section */}
            <div className="rounded-2xl bg-zinc-900/50 ring-1 ring-white/10 p-6 md:p-8 text-center space-y-4">
              <p className="text-sm font-medium text-zinc-400">Amount</p>
              <div className="max-w-xs mx-auto">
                <CurrencyInput
                  value={amount}
                  onChange={setAmount}
                  currency="IDR"
                  required
                  className="text-lg h-14 rounded-xl"
                />
              </div>
            </div>

            {/* Category - Chip/Pill Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-400">Category</label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCategoryId('')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all min-h-[44px] ${
                    !categoryId
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-zinc-950'
                      : 'bg-zinc-800/50 ring-1 ring-white/10 hover:bg-zinc-700 text-zinc-300'
                  }`}
                >
                  {!categoryId && <Check className="w-4 h-4" />}
                  <span>No Category</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all min-h-[44px] ${
                      categoryId === cat.id
                        ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-zinc-950'
                        : 'bg-zinc-800/50 ring-1 ring-white/10 hover:bg-zinc-700 text-zinc-300'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    {categoryId === cat.id && <Check className="w-4 h-4" />}
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date - Compact */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
                <input
                  type="date"
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-zinc-900/50 ring-1 ring-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Description - Smallest */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">
                Description <span className="text-zinc-500">(optional)</span>
              </label>
              <input
                type="text"
                className="w-full h-12 px-4 rounded-xl bg-zinc-900/50 ring-1 ring-white/10 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Lunch at the office"
              />
            </div>

            {/* Submit Button - Full Width CTA */}
            <Button
              type="submit"
              size="lg"
              className="w-full h-14 rounded-xl text-base font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Transaction'}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
