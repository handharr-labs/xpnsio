import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CategoryColorDot } from '@/shared/presentation/common/atoms/CategoryColorDot';
import type { Category } from '@/features/categories/domain/entities/Category';

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
    <Card>
      <CardHeader>
        <CardTitle>{masterLabel}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="flex items-center gap-3">
              <CategoryColorDot color={cat.color} size="md" />
              <span className="font-medium">{cat.name}</span>
              <span className="text-xs text-muted-foreground">{cat.icon}</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(cat)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(cat)}
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
}
