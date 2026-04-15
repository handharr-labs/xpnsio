'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import {
  listTripsAction,
  createTripAction,
  deleteTripAction,
  getTripDetailAction,
  addBillsToTripAction,
  updateTripSettlementStatusAction,
} from '../actions/trips';
import type { SettlementStatus } from '../../domain/entities/TripParticipantSettlement';

// ─── Trip List State ──────────────────────────────────────────────────────────

export function useTripListState() {
  const { executeAsync: fetchTrips } = useAction(listTripsAction);
  const { executeAsync: createTrip, isExecuting: isCreating } = useAction(createTripAction);
  const { executeAsync: deleteTrip, isExecuting: isDeleting } = useAction(deleteTripAction);
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data: trips = [], isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
      const res = await fetchTrips({});
      return res?.data ?? [];
    },
  });

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

// ─── Trip Detail State ────────────────────────────────────────────────────────

export function useTripDetailState(tripId: string) {
  const { executeAsync: fetchDetail } = useAction(getTripDetailAction);
  const { executeAsync: deleteTrip, isExecuting: isDeleting } = useAction(deleteTripAction);
  const { executeAsync: addBills, isExecuting: isAddingBills } = useAction(addBillsToTripAction);
  const { executeAsync: updateStatus, isExecuting: isUpdatingStatus } = useAction(
    updateTripSettlementStatusAction
  );
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data: tripDetail, isLoading } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: async () => {
      const res = await fetchDetail({ tripId });
      return res?.data ?? null;
    },
  });

  const handleDeleteTrip = async (onSuccess: () => void) => {
    setError(null);
    try {
      await deleteTrip({ tripId });
      queryClient.removeQueries({ queryKey: ['trip', tripId] });
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      onSuccess();
    } catch {
      setError('Failed to delete trip');
    }
  };

  const handleAddBills = async (billIds: string[]) => {
    setError(null);
    try {
      await addBills({ tripId, billIds });
      queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
    } catch {
      setError('Failed to add bills to trip');
    }
  };

  const handleUpdateSettlementStatus = async (
    settlementId: string,
    status: Exclude<SettlementStatus, 'pending'>
  ) => {
    setError(null);
    try {
      await updateStatus({ settlementId, status });
      queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
    } catch {
      setError('Failed to update settlement status');
    }
  };

  return {
    tripDetail,
    isLoading,
    isDeleting,
    isAddingBills,
    isUpdatingStatus,
    error,
    deleteTrip: handleDeleteTrip,
    addBills: handleAddBills,
    updateSettlementStatus: handleUpdateSettlementStatus,
  };
}
