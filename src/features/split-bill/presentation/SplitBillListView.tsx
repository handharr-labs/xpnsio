'use client';

import { useRouter } from 'next/navigation';
import { Plus, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSplitBillListViewModel } from './useSplitBillListViewModel';
import { TripListView } from '@/features/trips/presentation/views/TripListView';
import { ROUTES } from '@/shared/presentation/navigation/routes';
import { formatRelativeDate } from '@/shared/presentation/utils/formatRelativeDate';

export function SplitBillListView() {
  const router = useRouter();
  const { bills, isLoading } = useSplitBillListViewModel();

  return (
    <main className="min-h-screen">
      <div className="px-4 pt-4 pb-8 md:px-6 md:pt-6 max-w-lg mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Split Bills</h1>
          <Button
            size="sm"
            className="rounded-xl gap-2"
            onClick={() => router.push(ROUTES.splitBillNew)}
          >
            <Plus className="w-4 h-4" /> New Bill
          </Button>
        </header>

        {/* Trips section */}
        <div className="mb-6">
          <TripListView />
        </div>

        {/* Standalone bills section */}
        <div className="mb-2">
          <p className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
            <Receipt className="w-3.5 h-3.5" /> Standalone Bills
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            One-off bills split directly with participants. Each bill is settled individually.
          </p>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && bills.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <Receipt className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">No bills yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first split bill and share it with your group.
              </p>
            </div>
            <Button className="rounded-xl gap-2" onClick={() => router.push(ROUTES.splitBillNew)}>
              <Plus className="w-4 h-4" /> Create a bill
            </Button>
          </div>
        )}

        {!isLoading && bills.length > 0 && (
          <div className="space-y-3">
            {bills.map((bill) => (
              <button
                key={bill.id}
                onClick={() => router.push(ROUTES.splitBillManage(bill.id))}
                className="w-full text-left rounded-2xl bg-muted/50 ring-1 ring-border hover:bg-muted transition-colors p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{bill.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatRelativeDate(bill.date)} · <span className="capitalize">{bill.splitMode}</span>
                    </p>
                  </div>
                  <ArrowChevron />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function ArrowChevron() {
  return (
    <svg className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
