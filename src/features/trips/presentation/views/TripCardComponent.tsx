'use client';

import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { formatRelativeDate } from '@handharr-labs/core';
import { ROUTES } from '@/shared/presentation/navigation/routes';
import type { Trip } from '../../domain/entities/Trip';

interface TripCardComponentProps {
  trip: Trip;
}

function ChevronRight() {
  return (
    <svg className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function TripCardComponent({ trip }: TripCardComponentProps) {
  const router = useRouter();

  const dateLabel = trip.endDate
    ? `${formatRelativeDate(trip.startDate.toISOString().split('T')[0])} → ${trip.endDate.toISOString().split('T')[0]}`
    : formatRelativeDate(trip.startDate.toISOString().split('T')[0]);

  return (
    <button
      onClick={() => router.push(ROUTES.tripDetail(trip.id))}
      className="w-full text-left rounded-2xl bg-primary/5 ring-1 ring-primary/20 hover:bg-primary/10 transition-colors p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="mt-0.5 w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{trip.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{dateLabel}</p>
            {trip.description && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{trip.description}</p>
            )}
          </div>
        </div>
        <ChevronRight />
      </div>
    </button>
  );
}
