'use client';

import type { ComponentType } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '@handharr-labs/ui-xpnsio';

export interface IconOption {
  id: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}

export interface CategoryFormState {
  name: string;
  masterCategory: 'daily' | 'weekly' | 'monthly';
  color: string;
  icon: string;
}

interface CategoryFormDialogProps {
  isEdit: boolean;
  form: CategoryFormState;
  colorOptions: string[];
  iconOptions: IconOption[];
  periodOptions?: { value: 'daily' | 'weekly' | 'monthly'; label: string }[];
  isSaving: boolean;
  error: string | null;
  onFormChange: (patch: Partial<CategoryFormState>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const DEFAULT_PERIODS: { value: 'daily' | 'weekly' | 'monthly'; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export function CategoryFormDialog({
  isEdit,
  form,
  colorOptions,
  iconOptions,
  periodOptions = DEFAULT_PERIODS,
  isSaving,
  error,
  onFormChange,
  onSubmit,
  onClose,
}: CategoryFormDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-background rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-semibold">
            {isEdit ? 'Edit Category' : 'New Category'}
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 space-y-6">
          {error && (
            <div className="rounded-xl bg-red-500/10 ring-1 ring-red-500/20 p-4 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <input
              className="w-full h-12 px-4 rounded-xl bg-muted/50 ring-1 ring-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              value={form.name}
              onChange={(e) => onFormChange({ name: e.target.value })}
              required
              placeholder="e.g. Food & Dining"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Budget Period</label>
            <div className="flex gap-2">
              {periodOptions.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  className={`flex-1 h-11 rounded-xl text-sm font-medium capitalize transition-all ${
                    form.masterCategory === p.value
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background'
                      : 'bg-muted/50 ring-1 ring-border hover:bg-muted'
                  }`}
                  onClick={() => onFormChange({ masterCategory: p.value })}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Color</label>
            <div className="flex gap-3 flex-wrap">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                    form.color === c
                      ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => onFormChange({ color: c })}
                  aria-label={`Select color ${c}`}
                >
                  {form.color === c && <Check className="w-5 h-5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Icon</label>
            <div className="grid grid-cols-5 gap-2">
              {iconOptions.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl transition-all min-h-[60px] ${
                    form.icon === id
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background'
                      : 'bg-muted/50 ring-1 ring-border hover:bg-muted'
                  }`}
                  onClick={() => onFormChange({ icon: id })}
                  aria-label={`Select ${label} icon`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium truncate max-w-full">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 rounded-xl"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 rounded-xl"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
