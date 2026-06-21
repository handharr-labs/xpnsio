'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button, ShareLink, ImageModal, DeleteConfirmDialog, CopyRowList, StatusCard } from '@handharr-labs/ui-xpnsio';
import { formatCurrency } from '@handharr-labs/core';
import { ROUTES } from '@/shared/presentation/navigation/routes';
import { useTripDetailViewModel } from '../state/useTripDetailViewModel';
import { getStandaloneBillsAction } from '../actions/trips';

export function TripDetailView({ tripId }: { tripId: string }) {
  const router = useRouter();
  const {
    tripDetail,
    isLoading,
    isDeleting,
    isAddingBills,
    isUpdatingStatus,
    error,
    deleteTrip,
    addBills,
    updateSettlementStatus,
  } = useTripDetailViewModel(tripId);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddBills, setShowAddBills] = useState(false);
  const [standaloneBills, setStandaloneBills] = useState<{ id: string; title: string; date: string }[]>([]);
  const [selectedBillIds, setSelectedBillIds] = useState<string[]>([]);
  const [isFetchingBills, setIsFetchingBills] = useState(false);
  const [proofModal, setProofModal] = useState<string | null>(null);

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${ROUTES.tripPublic(tripId)}`
    : ROUTES.tripPublic(tripId);

  const totalAmount = tripDetail
    ? tripDetail.bills.reduce(
        (sum, bill) => sum + bill.participants.reduce((s, p) => s + p.finalAmount, 0),
        0
      )
    : 0;

  useEffect(() => {
    if (!showAddBills) {
      setStandaloneBills([]);
      setSelectedBillIds([]);
      return;
    }
    setIsFetchingBills(true);
    getStandaloneBillsAction({})
      .then((res) => {
        setStandaloneBills(res?.data ?? []);
        setIsFetchingBills(false);
      })
      .catch(() => setIsFetchingBills(false));
  }, [showAddBills]);

  const toggleBill = (id: string) => {
    setSelectedBillIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAddBillsSubmit = async () => {
    if (selectedBillIds.length === 0) return;
    await addBills(selectedBillIds);
    setShowAddBills(false);
    setSelectedBillIds([]);
  };

  if (isLoading) {
    return (
      <main className="px-4 pt-4 pb-8 max-w-lg mx-auto">
        <div style={{ height: '2rem' }} className="w-48 bg-muted rounded-xl animate-pulse mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: '6rem' }} className="w-full rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

  if (!tripDetail) {
    return (
      <main className="min-h-screen px-4 pt-4 max-w-lg mx-auto flex items-center justify-center">
        <p className="text-muted-foreground">Trip not found.</p>
      </main>
    );
  }

  const { trip, settlements, bills } = tripDetail;

  const startDateLabel = trip.startDate.toISOString().split('T')[0];
  const endDateLabel = trip.endDate ? trip.endDate.toISOString().split('T')[0] : null;
  const dateLabel = endDateLabel ? `${startDateLabel} → ${endDateLabel}` : startDateLabel;

  // Deduplicate payment accounts across all bills by bankName-accountNumber
  const seen = new Set<string>();
  const uniqueAccounts = bills.flatMap((bill) => bill.accounts).filter((acc) => {
    const key = `${acc.bankName}-${acc.accountNumber}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <main className="min-h-screen">
      <div className="px-4 pt-4 pb-8 md:px-6 md:pt-6 max-w-lg mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center gap-3">
          <button
            onClick={() => router.push(ROUTES.splitBills)}
            className="flex items-center justify-center w-11 h-11 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold truncate">{trip.name}</h1>
            <p className="text-xs text-muted-foreground">{dateLabel}</p>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center justify-center w-11 h-11 rounded-xl bg-muted hover:bg-red-500/10 text-muted-foreground hover:text-red-600 transition-colors"
            aria-label="Delete trip"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </header>

        {error && (
          <div className="rounded-xl bg-red-500/10 ring-1 ring-red-500/20 p-3 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Trip summary */}
        <div className="rounded-2xl bg-muted/50 ring-1 ring-border p-4 space-y-2">
          {trip.description && (
            <p className="text-sm text-muted-foreground">{trip.description}</p>
          )}
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Total across all bills</p>
            <p className="text-lg font-bold text-primary">{formatCurrency(totalAmount, 'IDR')}</p>
          </div>
          <p className="text-xs text-muted-foreground">{bills.length} bill{bills.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Public share link */}
        <ShareLink
          url={publicUrl}
          href={ROUTES.tripPublic(tripId)}
        />

        {/* Payment accounts */}
        {uniqueAccounts.length > 0 && (
          <CopyRowList accounts={uniqueAccounts} />
        )}

        {/* Bills breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Bills</p>
            <Button
              size="sm"
              variant="ghost"
              className="rounded-xl gap-1.5 h-8 text-xs"
              onClick={() => setShowAddBills(true)}
            >
              <Plus className="w-3.5 h-3.5" /> Add Bills
            </Button>
          </div>

          {bills.length === 0 && (
            <div className="rounded-xl ring-1 ring-border p-4 text-center text-sm text-muted-foreground">
              No bills yet. Add standalone bills to this trip.
            </div>
          )}

          {bills.map((bill) => {
            const billTotal = bill.participants.reduce((s, p) => s + p.finalAmount, 0);
            return (
              <button
                key={bill.id}
                onClick={() => router.push(ROUTES.splitBillManage(bill.id))}
                className="w-full text-left rounded-xl ring-1 ring-border p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{bill.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{bill.date}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatCurrency(billTotal, 'IDR')}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Settlements */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Settlements</p>

          {settlements.length === 0 && (
            <div className="rounded-xl ring-1 ring-border p-4 text-center text-sm text-muted-foreground">
              Settlements will appear once bills are added.
            </div>
          )}

          {settlements.map((s) => (
            <StatusCard
              key={s.id}
              name={s.participantName}
              formattedAmount={formatCurrency(s.totalNetAmount, 'IDR')}
              variant={s.participantName.toLowerCase() === 'you' || s.status === 'approved' ? 'success' : s.status === 'proof_uploaded' ? 'warning' : s.status === 'rejected' ? 'danger' : 'default'}
              statusLabel={s.participantName.toLowerCase() === 'you' ? 'Approved' : s.status === 'pending' ? 'Pending' : s.status === 'proof_uploaded' ? 'Proof uploaded' : s.status === 'approved' ? 'Approved' : 'Rejected'}
              badge={s.participantName.toLowerCase() === 'you' ? 'Trip creator' : undefined}
              imageUrl={s.proofImageUrl}
              onViewImage={s.proofImageUrl ? () => setProofModal(s.proofImageUrl!) : undefined}
              isUpdating={isUpdatingStatus}
              onApprove={s.status === 'proof_uploaded' && s.participantName.toLowerCase() !== 'you' ? () => updateSettlementStatus(s.id, 'approved') : undefined}
              onReject={s.status === 'proof_uploaded' && s.participantName.toLowerCase() !== 'you' ? () => updateSettlementStatus(s.id, 'rejected') : undefined}
            />
          ))}
        </div>
      </div>

      <ImageModal
        imageUrl={proofModal}
        onClose={() => setProofModal(null)}
      />

      {/* Add Bills dialog */}
      {showAddBills && (
        <div
          className='fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4'
          onClick={() => setShowAddBills(false)}
        >
          <div
            className='bg-background w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5 space-y-4'
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className='font-bold text-lg'>Add Bills to Trip</h2>
            <p className='text-sm text-muted-foreground'>
              Select standalone bills to add to this trip.
            </p>
            <div className='max-h-72 overflow-y-auto space-y-2'>
              {isFetchingBills && (
                <p className='text-sm text-muted-foreground text-center py-4'>Loading...</p>
              )}
              {!isFetchingBills && standaloneBills.length === 0 && (
                <p className='text-sm text-muted-foreground text-center py-4'>No standalone bills available.</p>
              )}
              {!isFetchingBills && standaloneBills.map((bill) => {
                const isSelected = selectedBillIds.includes(bill.id);
                return (
                  <div
                    key={bill.id}
                    onClick={() => toggleBill(bill.id)}
                    className={`cursor-pointer flex items-center gap-3 p-3 rounded-xl ring-1 hover:bg-muted/50 transition-colors ${isSelected ? 'ring-primary/50 bg-primary/5' : 'ring-border'}`}
                  >
                    <input
                      type='checkbox'
                      readOnly
                      checked={isSelected}
                      className='w-4 h-4 accent-primary'
                    />
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium truncate'>{bill.title}</p>
                      <p className='text-xs text-muted-foreground'>{bill.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                className='flex-1 rounded-xl'
                onClick={() => setShowAddBills(false)}
              >
                Cancel
              </Button>
              <Button
                className='flex-1 rounded-xl'
                disabled={isAddingBills || selectedBillIds.length === 0}
                onClick={handleAddBillsSubmit}
              >
                {isAddingBills ? 'Adding...' : `Add ${selectedBillIds.length > 0 ? selectedBillIds.length + ' ' : ''}Bill${selectedBillIds.length !== 1 ? 's' : ''}`}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete trip?"
        description={
          <>
            This will permanently delete{' '}
            <span className="font-medium text-foreground">{trip.name}</span> and all
            settlement data. Bills will become standalone again. This cannot be undone.
          </>
        }
        isDeleting={isDeleting}
        onConfirm={() => deleteTrip(() => router.push(ROUTES.splitBills))}
      />
    </main>
  );
}
