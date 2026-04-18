'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTripListViewModel } from '../state/useTripListViewModel';
import { TripCardComponent } from './TripCardComponent';

export function TripListView() {
  const router = useRouter();
  const { trips, isLoading, isCreating, error, createTrip } = useTripListViewModel();
  const [showDialog, setShowDialog] = useState(false);
  const [formName, setFormName] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const openDialog = () => {
    setFormName('');
    setFormStartDate('');
    setFormEndDate('');
    setFormDescription('');
    setFormError(null);
    setShowDialog(true);
  };

  const closeDialog = () => setShowDialog(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formName.trim() || !formStartDate) {
      setFormError('Name and start date are required.');
      return;
    }
    try {
      const trip = await createTrip({
        name: formName.trim(),
        startDate: formStartDate,
        endDate: formEndDate || null,
        description: formDescription.trim() || null,
      });
      closeDialog();
      router.push(`/split-bill/trips/${trip.id}`);
    } catch {
      setFormError(error ?? 'Failed to create trip');
    }
  };

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Trips
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Group multiple bills from one trip. Participants pay one net settlement.
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="rounded-xl gap-1.5 h-8 text-xs flex-shrink-0"
            onClick={openDialog}
          >
            <Plus className="w-3.5 h-3.5" /> New Trip
          </Button>
        </div>

        {isLoading && (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} style={{ backgroundColor: 'var(--muted)' }} className="h-16 w-full rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && trips.length === 0 && (
          <button
            onClick={openDialog}
            className="w-full rounded-2xl border-2 border-dashed border-border p-4 text-center text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <Plus className="w-4 h-4 mx-auto mb-1" />
            Create your first trip
          </button>
        )}

        {!isLoading && trips.length > 0 && (
          <div className="space-y-2">
            {trips.map((trip) => (
              <TripCardComponent key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>

      {/* Create Trip dialog */}
      {showDialog && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={closeDialog}
        >
          <div
            className="bg-background w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">New Trip</h2>
              <button
                onClick={closeDialog}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                  Trip name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Bali 2025"
                  className="w-full h-11 px-4 rounded-xl bg-muted/50 ring-1 ring-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                    Start date <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-muted/50 ring-1 ring-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                    End date
                  </label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-muted/50 ring-1 ring-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Optional notes"
                  className="w-full h-11 px-4 rounded-xl bg-muted/50 ring-1 ring-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              {formError && (
                <p className="text-sm text-destructive">{formError}</p>
              )}

              <Button
                type="submit"
                className="w-full h-11 rounded-xl"
                disabled={isCreating}
              >
                {isCreating ? 'Creating…' : 'Create Trip'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
