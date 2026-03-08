'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCategoriesViewModel } from './useCategoriesViewModel';
import type { Category } from '@/lib/schema';

const MASTER_LABELS: Record<string, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

const COLOR_OPTIONS = [
  '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6',
  '#8b5cf6', '#ef4444', '#14b8a6', '#f97316', '#84cc16',
];

const ICON_OPTIONS = ['circle', 'home', 'car', 'food', 'shopping', 'health', 'education', 'entertainment', 'travel', 'other'];

type FormState = {
  name: string;
  type: 'income' | 'expense';
  masterCategory: 'daily' | 'weekly' | 'monthly' | '';
  color: string;
  icon: string;
};

const DEFAULT_FORM: FormState = {
  name: '',
  type: 'expense',
  masterCategory: 'monthly',
  color: '#6366f1',
  icon: 'circle',
};

export function CategoriesView() {
  const { categories, isLoading, error, createCategory, updateCategory, deleteCategory } =
    useCategoriesViewModel();

  const [showDialog, setShowDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
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
      type: cat.type,
      masterCategory: (cat.masterCategory as FormState['masterCategory']) ?? '',
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
          color: form.color,
          icon: form.icon,
          masterCategory: form.masterCategory || undefined,
        });
      } else {
        await createCategory({
          name: form.name,
          type: form.type,
          masterCategory: form.masterCategory
            ? (form.masterCategory as 'daily' | 'weekly' | 'monthly')
            : undefined,
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
    try {
      await deleteCategory(cat.id);
    } catch {
      // error shown via hook
    }
  };

  const grouped = {
    daily: categories.filter((c) => c.masterCategory === 'daily'),
    weekly: categories.filter((c) => c.masterCategory === 'weekly'),
    monthly: categories.filter((c) => c.masterCategory === 'monthly'),
    income: categories.filter((c) => c.type === 'income'),
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
            {(['daily', 'weekly', 'monthly', 'income'] as const).map((group) => {
              const items = grouped[group];
              if (items.length === 0) return null;
              return (
                <Card key={group}>
                  <CardHeader>
                    <CardTitle>{MASTER_LABELS[group] ?? 'Income'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {items.map((cat) => (
                      <div
                        key={cat.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="font-medium">{cat.name}</span>
                          <span className="text-xs text-muted-foreground">{cat.icon}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEdit(cat)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(cat)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
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

      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-xl shadow-lg w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-semibold">
              {editingCategory ? 'Edit Category' : 'New Category'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                  {formError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium">Name</label>
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  placeholder="e.g. Food & Dining"
                />
              </div>

              {!editingCategory && (
                <div className="space-y-1">
                  <label className="text-sm font-medium">Type</label>
                  <div className="flex gap-2">
                    {(['expense', 'income'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`flex-1 rounded-md border px-3 py-2 text-sm capitalize transition-colors ${
                          form.type === t
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => setForm((f) => ({ ...f, type: t }))}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(editingCategory ? editingCategory.type === 'expense' : form.type === 'expense') && (
                <div className="space-y-1">
                  <label className="text-sm font-medium">Budget Period</label>
                  <div className="flex gap-2">
                    {(['daily', 'weekly', 'monthly'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        className={`flex-1 rounded-md border px-3 py-2 text-sm capitalize transition-colors ${
                          form.masterCategory === m
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => setForm((f) => ({ ...f, masterCategory: m }))}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        form.color === c ? 'border-foreground scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                      onClick={() => setForm((f) => ({ ...f, color: c }))}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Icon</label>
                <div className="flex gap-2 flex-wrap">
                  {ICON_OPTIONS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      className={`px-2 py-1 rounded text-xs border transition-colors ${
                        form.icon === ic
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setForm((f) => ({ ...f, icon: ic }))}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDialog(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isSaving}>
                  {isSaving ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
