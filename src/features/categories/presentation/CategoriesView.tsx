'use client';

import { useState } from 'react';
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
    <main className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Categories</h1>
          <Button onClick={openCreate}>+ Add Category</Button>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-muted-foreground">Loading categories...</p>
        ) : (
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

            {categories.length === 0 && (
              <p className="text-center text-muted-foreground py-12">
                No categories yet. Create your first one!
              </p>
            )}
          </div>
        )}
      </div>

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
