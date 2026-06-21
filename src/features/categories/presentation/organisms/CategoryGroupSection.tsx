'use client';

import type { ComponentType } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button, CategoryColorDot } from '@handharr-labs/ui-xpnsio';

export interface CategoryItemVM {
  id: string;
  name: string;
  color: string;
  icon: ComponentType<{ className?: string }>;
}

interface CategoryGroupSectionProps {
  masterLabel: string;
  items: CategoryItemVM[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CategoryGroupSection({
  masterLabel,
  items,
  onEdit,
  onDelete,
}: CategoryGroupSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {masterLabel}
        </h2>
        <div className="flex-1 h-px bg-border/50" />
        <span className="text-xs text-muted-foreground">{items.length}</span>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-4 rounded-xl ring-1 ring-border bg-card hover:bg-muted/30 transition-colors group"
            >
              <CategoryColorDot color={item.color} size="md" />

              <div className="flex-1 min-w-0 flex items-center gap-2">
                <span className="font-medium truncate">{item.name}</span>
                <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(item.id)}
                  className="h-9 w-9 p-0 rounded-lg"
                  aria-label={`Edit ${item.name}`}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(item.id)}
                  className="h-9 w-9 p-0 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-500/10"
                  aria-label={`Delete ${item.name}`}
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
