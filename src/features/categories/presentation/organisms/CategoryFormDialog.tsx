import { Button } from '@/components/ui/button';

const COLOR_OPTIONS = [
  '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6',
  '#8b5cf6', '#ef4444', '#14b8a6', '#f97316', '#84cc16',
];

const ICON_OPTIONS = ['circle', 'home', 'car', 'food', 'shopping', 'health', 'education', 'entertainment', 'travel', 'other'];

export interface CategoryFormState {
  name: string;
  masterCategory: 'daily' | 'weekly' | 'monthly';
  color: string;
  icon: string;
}

interface CategoryFormDialogProps {
  isEdit: boolean;
  form: CategoryFormState;
  isSaving: boolean;
  error: string | null;
  onFormChange: (patch: Partial<CategoryFormState>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function CategoryFormDialog({
  isEdit,
  form,
  isSaving,
  error,
  onFormChange,
  onSubmit,
  onClose,
}: CategoryFormDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-xl shadow-lg w-full max-w-md p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          {isEdit ? 'Edit Category' : 'New Category'}
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium">Name</label>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={form.name}
              onChange={(e) => onFormChange({ name: e.target.value })}
              required
              placeholder="e.g. Food & Dining"
            />
          </div>

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
                  onClick={() => onFormChange({ masterCategory: m })}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

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
                  onClick={() => onFormChange({ color: c })}
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
                  onClick={() => onFormChange({ icon: ic })}
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
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSaving}>
              {isSaving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
