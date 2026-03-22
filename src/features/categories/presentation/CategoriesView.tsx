'use client';

import { useState } from 'react';
import { Plus, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCategoriesViewModel } from './useCategoriesViewModel';
import { CategoryFormDialog } from './organisms/CategoryFormDialog';
import { CategoryGroupSection } from './organisms/CategoryGroupSection';
import type { Category } from '@/features/categories/domain/entities/Category';
import type { CategoryFormState } from './organisms/CategoryFormDialog';

const MASTER_LABELS: Record<string, string> = {
  daily: 'Daily Spend',
  weekly: 'Weekly Spend',
  monthly: 'Monthly Spend',
};

const DEFAULT_FORM: CategoryFormState = {
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
  const [form, setForm] = useState<CategoryFormState>(DEFAULT_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const openCreate = () => {
    setEditingCategory(null);
    setForm(DEFAULT_FORM);
    setFormError(null);
    setShowDialog(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      masterCategory: cat.masterCategory as CategoryFormState['masterCategory'],
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

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Delete "${cat.name}"? This cannot be undone.`)) return;
    await deleteCategory(cat.id);
  };

  const grouped = {
    daily: categories.filter((c) => c.masterCategory === 'daily'),
    weekly: categories.filter((c) => c.masterCategory === 'weekly'),
    monthly: categories.filter((c) => c.masterCategory === 'monthly'),
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Content Container - PWA safe area padding */}
      <div className="px-4 pt-4 pb-[calc(5rem+env(safe-area-inset-bottom))] md:px-6 md:pt-6 md:pb-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <header className="flex items-center justify-between min-h-[44px]">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Categories</h1>
            <Button onClick={openCreate} className="h-11 rounded-xl gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Category</span>
            </Button>
          </header>

          {/* Error State */}
          {error && (
            <div className="rounded-xl bg-red-500/10 ring-1 ring-red-500/20 p-4 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            /* Empty State */
            <div className="rounded-2xl ring-1 ring-border border-dashed p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                <Layers className="w-7 h-7 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold">No categories yet</p>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                  Create categories to organize your spending and track budgets more effectively.
                </p>
              </div>
              <Button onClick={openCreate} size="lg" className="mt-2">
                Create Your First Category
              </Button>
            </div>
          ) : (
            /* Category Groups */
            <div className="space-y-6">
              {(['daily', 'weekly', 'monthly'] as const).map((group) => {
                const items = grouped[group];
                if (items.length === 0) return null;
                return (
                  <CategoryGroupSection
                    key={group}
                    masterLabel={MASTER_LABELS[group]}
                    categories={items}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Dialog */}
      {showDialog && (
        <CategoryFormDialog
          isEdit={editingCategory !== null}
          form={form}
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
