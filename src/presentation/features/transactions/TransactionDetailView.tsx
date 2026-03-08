'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  getTransactionsAction,
  updateTransactionAction,
  deleteTransactionAction,
} from '@/app/actions/transactions';
import { getCategoriesAction } from '@/app/actions/categories';
import { getDashboardDataAction } from '@/app/actions/dashboard';
import { CurrencyInput } from '@/presentation/common/CurrencyInput';
import { formatCurrency } from '@/core/utils/formatCurrency';
import { ROUTES } from '@/presentation/navigation/routes';
import type { Transaction, Category } from '@/lib/schema';

export function TransactionDetailView({ id }: { id: string }) {
  const router = useRouter();

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currency, setCurrency] = useState('IDR');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit form state
  const [amount, setAmount] = useState(0);
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const now = new Date();
    Promise.all([
      getTransactionsAction({}),
      getCategoriesAction({}),
      getDashboardDataAction({ year: now.getFullYear(), month: now.getMonth() + 1 }),
    ]).then(([txResult, catResult, dashResult]) => {
      if (txResult?.data) {
        const found = txResult.data.find((t) => t.id === id) ?? null;
        setTransaction(found);
        if (found) {
          setAmount(parseFloat(found.amount));
          setCategoryId(found.categoryId ?? '');
          setDescription(found.description ?? '');
          setDate(found.date);
        }
      }
      if (catResult?.data) setCategories(catResult.data);
      if (dashResult?.data?.currency) setCurrency(dashResult.data.currency);
      setIsLoading(false);
    });
  }, [id]);

  const category = transaction?.categoryId
    ? categories.find((c) => c.id === transaction.categoryId)
    : null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!amount || amount <= 0) {
      setError('Amount must be positive');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateTransactionAction({
        id,
        amount,
        type: 'expense',
        categoryId: categoryId || undefined,
        description: description.trim() || undefined,
        date,
      });
      if (result?.data) {
        setTransaction(result.data);
        setIsEditing(false);
      } else {
        setError(result?.serverError ?? 'Failed to update');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this transaction? This cannot be undone.')) return;
    try {
      await deleteTransactionAction({ id });
      router.push(ROUTES.transactions);
    } catch {
      setError('Failed to delete transaction');
    }
  };

  if (isLoading) {
    return <main className="min-h-screen p-6"><p className="text-muted-foreground">Loading...</p></main>;
  }

  if (!transaction) {
    return (
      <main className="min-h-screen p-6">
        <p className="text-muted-foreground">Transaction not found.</p>
        <Button className="mt-4" onClick={() => router.push(ROUTES.transactions)}>Back to Transactions</Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>← Back</Button>
          <h1 className="text-2xl font-bold">Transaction Detail</h1>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
        )}

        {!isEditing ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">
                -{formatCurrency(parseFloat(transaction.amount), currency)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">{transaction.date}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Category</p>
                  <p className="font-medium">{category?.name ?? '—'}</p>
                </div>
                {transaction.description && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Description</p>
                    <p className="font-medium">{transaction.description}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsEditing(true)}>Edit</Button>
                <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700" onClick={handleDelete}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Edit Transaction</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Amount</label>
                  <CurrencyInput value={amount} onChange={setAmount} currency={currency} required />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Category</label>
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
                  <label className="text-sm font-medium">Description</label>
                  <input
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsEditing(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
