'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import {
  getTripDetailAction,
  deleteTripAction,
  addBillsToTripAction,
  updateTripSettlementStatusAction,
} from '../actions/trips';
import type { SettlementStatus } from '../../domain/entities/TripParticipantSettlement';

export function useTripDetailViewModel(tripId: string) {
  const { executeAsync: fetchDetail } = useAction(getTripDetailAction);
  const { executeAsync: deleteTrip, isExecuting: isDeleting } = useAction(deleteTripAction);
  const { executeAsync: addBills, isExecuting: isAddingBills } = useAction(addBillsToTripAction);
  const { executeAsync: updateStatus, isExecuting: isUpdatingStatus } = useAction(
    updateTripSettlementStatusAction
  );
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data: tripDetail, isPending: isLoading } = useQuery({
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
