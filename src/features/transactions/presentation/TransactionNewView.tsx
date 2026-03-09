'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTransactionNewViewModel } from './useTransactionNewViewModel';
import { CurrencyInput } from '@/shared/presentation/common/CurrencyInput';
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

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>← Back</Button>
          <h1 className="text-2xl font-bold">New Transaction</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {displayError && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {displayError}
            </div>
          )}

          <Card>
            <CardHeader><CardTitle>Transaction Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Amount</label>
                <CurrencyInput
                  value={amount}
                  onChange={setAmount}
                  currency="IDR"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Category (optional)</label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">None</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Date</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Description (optional)</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Lunch at the office"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Transaction'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
