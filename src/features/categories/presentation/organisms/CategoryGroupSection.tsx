'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryColorDot } from '@/shared/presentation/common/atoms/CategoryColorDot';
import type { Category } from '@/features/categories/domain/entities/Category';
import { getCategoryIcon } from '@/features/categories/presentation/utils/getCategoryIcon';

interface CategoryGroupSectionProps {
  masterLabel: string;
  categories: Category[];
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
}

export function CategoryGroupSection({
  masterLabel,
  categories,
  onEdit,
  onDelete,
}: CategoryGroupSectionProps) {
  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {masterLabel}
        </h2>
        <div className="flex-1 h-px bg-border/50" />
        <span className="text-xs text-muted-foreground">{categories.length}</span>
      </div>

      {/* Category List */}
      <div className="grid gap-2 md:grid-cols-2">
        {categories.map((cat) => {
          const IconComponent = getCategoryIcon(cat.icon);
          return (
            <div
              key={cat.id}
              className="flex items-center gap-3 p-4 rounded-xl ring-1 ring-border bg-card hover:bg-muted/30 transition-colors group"
            >
              {/* Color Dot */}
              <CategoryColorDot color={cat.color} size="md" />

              {/* Name & Icon */}
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <span className="font-medium truncate">{cat.name}</span>
                <IconComponent className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>

              {/* Actions */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(cat)}
                  className="h-9 w-9 p-0 rounded-lg"
                  aria-label={`Edit ${cat.name}`}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(cat)}
                  className="h-9 w-9 p-0 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-500/10"
                  aria-label={`Delete ${cat.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
