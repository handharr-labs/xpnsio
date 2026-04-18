'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';
import { useState, useEffect } from 'react';
import { listTripsAction, createTripAction, deleteTripAction } from '../actions/trips';

export function useTripListViewModel() {
  const { executeAsync: fetchTrips } = useAction(listTripsAction);
  const { executeAsync: createTrip, isExecuting: isCreating } = useAction(createTripAction);
  const { executeAsync: deleteTrip, isExecuting: isDeleting } = useAction(deleteTripAction);
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data: trips = [], status } = useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
      console.log(`[TripList][${new Date().toISOString()}] queryFn called`);
      const res = await fetchTrips({});
      console.log(`[TripList][${new Date().toISOString()}] queryFn resolved, trips:`, res?.data?.length ?? 0);
      return res?.data ?? [];
    },
  });

  const [isLoading, setIsLoading] = useState(status === 'pending');

  console.log(`[TripList][${new Date().toISOString()}] render — status:`, status, '| isLoading:', isLoading, '| trips:', trips.length);

  useEffect(() => {
    if (status !== 'pending') setIsLoading(false);
  }, [status]);

  const handleCreateTrip = async (params: {
    name: string;
    startDate: string;
    endDate: string | null;
    description: string | null;
  }) => {
    setError(null);
    try {
      const res = await createTrip(params);
      if (!res?.data) throw new Error('Failed to create trip');
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      return res.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create trip';
      setError(message);
      throw err;
    }
  };

  const handleDeleteTrip = async (tripId: string, onSuccess?: () => void) => {
    setError(null);
    try {
      await deleteTrip({ tripId });
      queryClient.removeQueries({ queryKey: ['trip', tripId] });
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      onSuccess?.();
    } catch {
      setError('Failed to delete trip');
    }
  };

  return {
    trips,
    isLoading,
    isCreating,
    isDeleting,
    error,
    createTrip: handleCreateTrip,
    deleteTrip: handleDeleteTrip,
  };
}
