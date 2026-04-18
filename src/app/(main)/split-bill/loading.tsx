import { MapPin, Receipt } from 'lucide-react';

export default function SplitBillLoading() {
  return (
    <main className="min-h-screen">
      <div className="px-4 pt-4 pb-8 md:px-6 md:pt-6 max-w-lg mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="h-8 w-32 rounded-lg bg-muted animate-pulse" />
          <div className="h-8 w-24 rounded-xl bg-muted animate-pulse" />
        </header>

        {/* Trips section skeleton */}
        <div className="mb-6 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Trips
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Group multiple bills from one trip. Participants pay one net settlement.
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 w-full rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        </div>

        {/* Standalone bills section skeleton */}
        <div className="mb-2">
          <p className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
            <Receipt className="w-3.5 h-3.5" /> Standalone Bills
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            One-off bills split directly with participants. Each bill is settled individually.
          </p>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 w-full rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  );
}
