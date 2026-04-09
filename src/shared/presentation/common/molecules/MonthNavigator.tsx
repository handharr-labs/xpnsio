'use client';

interface MonthNavigatorProps {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  disableNext?: boolean;
}

export function MonthNavigator({ label, onPrev, onNext, disableNext }: MonthNavigatorProps) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onPrev} className="p-1 rounded hover:bg-muted">‹</button>
      <span className="text-sm text-muted-foreground w-32 text-center">{label}</span>
      <button onClick={onNext} disabled={disableNext} className="p-1 rounded hover:bg-muted disabled:opacity-30">›</button>
    </div>
  );
}
