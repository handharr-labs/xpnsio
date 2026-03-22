import { UtensilsCrossed, Car, Home, ShoppingBag, Heart, BookOpen, Tv, Plane, Circle } from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  food: UtensilsCrossed,
  car: Car,
  home: Home,
  shopping: ShoppingBag,
  health: Heart,
  education: BookOpen,
  entertainment: Tv,
  travel: Plane,
  circle: Circle,
  other: Circle,
};

export function getCategoryIcon(iconName: string): React.ComponentType<{ className?: string }> {
  return ICON_MAP[iconName] ?? Circle;
}
