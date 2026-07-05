'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Tag, FileText, Pencil, Trash2, Check } from 'lucide-react';
import { Button, CurrencyInput } from '@handharr-labs/forge-ui-uno';
import { formatCurrency, formatFullDate } from '@handharr-labs/forge-core';
import { ROUTES } from '@/shared/presentation/navigation/routes';
import { useTransactionDetailViewModel } from '../hooks/useTransactionDetailViewModel';

export function TransactionDetailView({ id }: { id: string }) {
  const router = useRouter();

  const {
    transaction,
    categories,
    currency,
    isLoading,
    isSubmitting,
    error,
    updateTransaction,
    deleteTransaction,
  } = useTransactionDetailViewModel(id);

  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [amount, setAmount] = useState(0);
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const category = transaction?.categoryId
    ? categories.find((c) => c.id === transaction.categoryId)
    : null;

  const handleEdit = () => {
    if (transaction) {
      setAmount(transaction.amount);
      setCategoryId(transaction.categoryId ?? '');
      setDescription(transaction.description ?? '');
      setDate(transaction.date);
    }
    setIsEditing(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    try {
      await updateTransaction({
        amount,
        type: transaction!.type,
        categoryId: categoryId || undefined,
        description: description.trim() || undefined,
        date,
      });
      setIsEditing(false);
    } catch {
      // error set by ViewModel
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTransaction();
      router.push(ROUTES.transactions);
    } catch {
      // error set by ViewModel
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <main className="min-h-screen">
        <div className="px-4 pt-4 pb-8 md:px-6 md:pt-6">
          <div className="max-w-lg mx-auto space-y-6">
            <div className="h-11 w-32 rounded-xl bg-muted animate-pulse" />
            <div className="h-48 w-full rounded-2xl bg-muted animate-pulse" />
            <div className="h-32 w-full rounded-xl bg-muted animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  // Not Found State
  if (!transaction) {
    return (
      <main className="min-h-screen">
        <div className="px-4 pt-4 pb-8 md:px-6 md:pt-6">
          <div className="max-w-lg mx-auto">
            <div className="rounded-2xl ring-1 ring-border p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                <FileText className="w-7 h-7 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="typo-section-title">Transaction not found</p>
                <p className="text-muted-foreground text-sm">
                  This transaction may have been deleted.
                </p>
              </div>
              <Button onClick={() => router.push(ROUTES.transactions)} className="mt-4">
                Back to Transactions
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const isIncome = transaction.type === 'income';

  return (
    <main className="min-h-screen">
      <div className="px-4 pt-4 pb-8 md:px-6 md:pt-6">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Header */}
          <header className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-11 h-11 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="typo-page-title">Transaction Detail</h1>
          </header>

          {/* Error */}
          {error && (
            <div className="rounded-xl bg-red-500/10 ring-1 ring-red-500/20 p-4 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {!isEditing ? (
            /* View Mode */
            <div className="space-y-4">
              {/* Hero Amount Card */}
              <div
                className={`rounded-2xl p-6 md:p-8 text-center ring-1 ${
                  isIncome
                    ? 'bg-emerald-500/10 ring-emerald-500/20 dark:bg-emerald-500/20'
                    : 'bg-red-500/10 ring-red-500/20 dark:bg-red-500/20'
                }`}
              >
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {isIncome ? 'Income' : 'Expense'}
                </p>
                <p
                  className={`text-4xl md:text-5xl font-bold tracking-tight ${
                    isIncome
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
                </p>
              </div>

              {/* Details Card */}
              <div className="rounded-xl ring-1 ring-border divide-y divide-border">
                {/* Date */}
                <div className="flex items-center gap-4 p-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted/50">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-sm font-medium">{formatFullDate(transaction.date)}</p>
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-center gap-4 p-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted/50">
                    {category ? (
                      <span
                        className="w-5 h-5 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                    ) : (
                      <Tag className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="text-sm font-medium">
                      {category?.name ?? transaction.categoryName ?? 'No category'}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {transaction.description && (
                  <div className="flex items-center gap-4 p-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted/50">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Description</p>
                      <p className="text-sm font-medium">{transaction.description}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              {isConfirmingDelete ? (
                <div className="rounded-xl bg-red-500/10 ring-1 ring-red-500/20 p-4 space-y-3">
                  <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                    Delete this transaction? This cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 h-11 rounded-xl"
                      onClick={() => setIsConfirmingDelete(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white"
                      onClick={handleDelete}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 rounded-xl gap-2"
                    onClick={handleEdit}
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 rounded-xl gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/30"
                    onClick={() => setIsConfirmingDelete(true)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Edit Mode */
            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Amount */}
              <div className="rounded-2xl bg-muted/30 ring-1 ring-border p-6 text-center space-y-4">
                <p className="text-sm font-medium text-muted-foreground">Amount</p>
                <div className="max-w-xs mx-auto">
                  <CurrencyInput
                    value={amount}
                    onChange={setAmount}
                    currencyLabel={currency}
                    required
                    className="text-lg h-14 rounded-xl"
                  />
                </div>
              </div>

              {/* Category - Chip Selector */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">Category</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setCategoryId('')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all min-h-[44px] ${
                      !categoryId
                        ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background'
                        : 'bg-muted/50 ring-1 ring-border hover:bg-muted'
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
                          ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background'
                          : 'bg-muted/50 ring-1 ring-border hover:bg-muted'
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

              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  <input
                    type="date"
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-muted/50 ring-1 ring-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Description <span className="text-muted-foreground/60">(optional)</span>
                </label>
                <input
                  type="text"
                  className="w-full h-12 px-4 rounded-xl bg-muted/50 ring-1 ring-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Lunch at the office"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12 rounded-xl"
                  onClick={() => setIsEditing(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 rounded-xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
