'use client';

import { useState } from 'react';
import { Plus, Layers, UtensilsCrossed, Car, Home, ShoppingBag, Heart, BookOpen, Tv, Plane, Circle } from 'lucide-react';
import { Button, FormDialog, ItemGroupSection } from '@handharr-labs/ui-xpnsio';
import type { IconOption, FormDialogState } from '@handharr-labs/ui-xpnsio';
import { useCategoriesViewModel } from '../hooks/useCategoriesViewModel';
import type { Category } from '@/features/categories/domain/entities/Category';
import { getCategoryIcon } from '../utils/getCategoryIcon';

const MASTER_LABELS: Record<string, string> = {
  daily: 'Daily Spend',
  weekly: 'Weekly Spend',
  monthly: 'Monthly Spend',
};

const COLOR_OPTIONS = [
  '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6',
  '#8b5cf6', '#ef4444', '#14b8a6', '#f97316', '#84cc16',
];

const ICON_OPTIONS: IconOption[] = [
  { id: 'circle', label: 'Default', Icon: Circle },
  { id: 'food', label: 'Food', Icon: UtensilsCrossed },
  { id: 'car', label: 'Transport', Icon: Car },
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'shopping', label: 'Shopping', Icon: ShoppingBag },
  { id: 'health', label: 'Health', Icon: Heart },
  { id: 'education', label: 'Education', Icon: BookOpen },
  { id: 'entertainment', label: 'Entertainment', Icon: Tv },
  { id: 'travel', label: 'Travel', Icon: Plane },
  { id: 'other', label: 'Other', Icon: Circle },
];

const DEFAULT_FORM: FormDialogState = {
  name: '',
  masterCategory: 'monthly',
  color: '#6366f1',
  icon: 'circle',
};

export function CategoriesView() {
  const { categories, isLoading, error, createCategory, updateCategory, deleteCategory } =
    useCategoriesViewModel();

  const [showDialog, setShowDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<FormDialogState>(DEFAULT_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const categoryById = new Map(categories.map((c) => [c.id, c]));

  const openCreate = () => {
    setEditingCategory(null);
    setForm(DEFAULT_FORM);
    setFormError(null);
    setShowDialog(true);
  };

  const openEdit = (id: string) => {
    const cat = categoryById.get(id);
    if (!cat) return;
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      masterCategory: cat.masterCategory as FormDialogState['masterCategory'],
      color: cat.color,
      icon: cat.icon,
    });
    setFormError(null);
    setShowDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSaving(true);
    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          name: form.name,
          masterCategory: form.masterCategory,
          color: form.color,
          icon: form.icon,
        });
      } else {
        await createCategory({
          name: form.name,
          masterCategory: form.masterCategory,
          color: form.color,
          icon: form.icon,
        });
      }
      setShowDialog(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    const cat = categoryById.get(id);
    if (cat) setDeletingCategory(cat);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    await deleteCategory(deletingCategory.id);
    setDeletingCategory(null);
  };

  const grouped = {
    daily: categories.filter((c) => c.masterCategory === 'daily'),
    weekly: categories.filter((c) => c.masterCategory === 'weekly'),
    monthly: categories.filter((c) => c.masterCategory === 'monthly'),
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="px-4 pt-4 pb-[calc(5rem+env(safe-area-inset-bottom))] md:px-6 md:pt-6 md:pb-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <header className="flex items-center justify-between min-h-[44px]">
            <h1 className="typo-page-title">Categories</h1>
            <Button onClick={openCreate} className="h-11 rounded-xl gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Category</span>
            </Button>
          </header>

          {error && (
            <div className="rounded-xl bg-red-500/10 ring-1 ring-red-500/20 p-4 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {deletingCategory && (
            <div className="rounded-xl bg-yellow-500/10 ring-1 ring-yellow-500/20 p-4 text-sm space-y-3">
              <p className="text-yellow-700 dark:text-yellow-400">
                Delete &ldquo;{deletingCategory.name}&rdquo;? This cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteConfirm}
                  className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeletingCategory(null)}
                  className="px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs font-medium hover:bg-muted/80"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 w-full rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="rounded-2xl ring-1 ring-border border-dashed p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                <Layers className="w-7 h-7 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="typo-section-title">No categories yet</p>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                  Create categories to organize your spending and track budgets more effectively.
                </p>
              </div>
              <Button onClick={openCreate} size="lg" className="mt-2">
                Create Your First Category
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {(['daily', 'weekly', 'monthly'] as const).map((group) => {
                const items = grouped[group];
                if (items.length === 0) return null;
                return (
                  <ItemGroupSection
                    key={group}
                    masterLabel={MASTER_LABELS[group]}
                    items={items.map((cat) => ({
                      id: cat.id,
                      name: cat.name,
                      color: cat.color,
                      icon: getCategoryIcon(cat.icon),
                    }))}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showDialog && (
        <FormDialog
          isEdit={editingCategory !== null}
          form={form}
          colorOptions={COLOR_OPTIONS}
          iconOptions={ICON_OPTIONS}
          isSaving={isSaving}
          error={formError}
          onFormChange={(patch) => setForm((f) => ({ ...f, ...patch }))}
          onSubmit={handleSubmit}
          onClose={() => setShowDialog(false)}
        />
      )}
    </main>
  );
}
