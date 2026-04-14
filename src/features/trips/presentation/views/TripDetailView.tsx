'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Copy, Check, ExternalLink, ImageIcon, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTripDetailViewModel } from '../state/useTripDetailViewModel';
import { formatCurrency } from '@/shared/presentation/utils/formatCurrency';
import { ROUTES } from '@/shared/presentation/navigation/routes';
import type { SettlementStatus } from '../../domain/entities/TripParticipantSettlement';

const STATUS_STYLES: Record<SettlementStatus, string> = {
  pending: 'bg-muted text-muted-foreground',
  proof_uploaded: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  approved: 'bg-green-500/10 text-green-700 dark:text-green-400',
  rejected: 'bg-red-500/10 text-red-700 dark:text-red-400',
};

const STATUS_LABEL: Record<SettlementStatus, string> = {
  pending: 'Pending',
  proof_uploaded: 'Proof uploaded',
  approved: 'Approved',
  rejected: 'Rejected',
};

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
  const [addBillIdsInput, setAddBillIdsInput] = useState('');
  const [proofModal, setProofModal] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${ROUTES.tripPublic(tripId)}`
    : ROUTES.tripPublic(tripId);

  const copyPublicLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const totalAmount = tripDetail
    ? tripDetail.bills.reduce(
        (sum, bill) => sum + bill.participants.reduce((s, p) => s + p.finalAmount, 0),
        0
      )
    : 0;

  const handleAddBillsSubmit = async () => {
    const ids = addBillIdsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (ids.length === 0) return;
    await addBills(ids);
    setShowAddBills(false);
    setAddBillIdsInput('');
  };

  if (isLoading) {
    return (
      <main className="min-h-screen px-4 pt-4 max-w-lg mx-auto">
        <div className="h-8 w-48 bg-muted rounded-xl animate-pulse mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />
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
        <div className="rounded-2xl bg-muted/50 ring-1 ring-border p-4 space-y-2">
          <p className="text-sm font-medium">Share with participants</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={publicUrl}
              className="flex-1 h-10 px-3 rounded-xl bg-background ring-1 ring-border text-sm text-muted-foreground focus:outline-none"
            />
            <button
              onClick={copyPublicLink}
              className="h-10 px-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedLink ? 'Copied' : 'Copy'}
            </button>
            <a
              href={ROUTES.tripPublic(tripId)}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center ring-1 ring-border"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

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
            <div key={s.id} className="rounded-xl ring-1 ring-border p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold capitalize">{s.participantName}</p>
                  {s.participantEmail && (
                    <p className="text-xs text-muted-foreground">{s.participantEmail}</p>
                  )}
                  <p className="text-sm font-medium text-primary">
                    {formatCurrency(s.totalNetAmount, 'IDR')}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[s.status]}`}>
                  {STATUS_LABEL[s.status]}
                </span>
              </div>

              {s.proofImageUrl && (
                <button
                  onClick={() => setProofModal(s.proofImageUrl!)}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ImageIcon className="w-4 h-4" /> View proof
                </button>
              )}

              {s.status === 'proof_uploaded' && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white"
                    disabled={isUpdatingStatus}
                    onClick={() => updateSettlementStatus(s.id, 'approved')}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 rounded-xl text-red-600 border-red-200 hover:bg-red-50"
                    disabled={isUpdatingStatus}
                    onClick={() => updateSettlementStatus(s.id, 'rejected')}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Proof image modal */}
      {proofModal && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setProofModal(null)}
        >
          <img src={proofModal} alt="Settlement proof" className="max-w-full max-h-full rounded-xl object-contain" />
        </div>
      )}

      {/* Add Bills dialog */}
      {showAddBills && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowAddBills(false)}
        >
          <div
            className="bg-background w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold text-lg">Add Bills to Trip</h2>
            <p className="text-sm text-muted-foreground">
              Enter the bill IDs (comma-separated) of standalone bills to add to this trip.
            </p>
            <textarea
              className="w-full h-24 px-4 py-3 rounded-xl bg-muted/50 ring-1 ring-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              placeholder="bill-uuid-1, bill-uuid-2"
              value={addBillIdsInput}
              onChange={(e) => setAddBillIdsInput(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setShowAddBills(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 rounded-xl"
                disabled={isAddingBills || !addBillIdsInput.trim()}
                onClick={handleAddBillsSubmit}
              >
                {isAddingBills ? 'Adding…' : 'Add Bills'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-background rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1.5">
              <h2 className="text-base font-semibold">Delete trip?</h2>
              <p className="text-sm text-muted-foreground">
                This will permanently delete{' '}
                <span className="font-medium text-foreground">{trip.name}</span> and all
                settlement data. Bills will become standalone again. This cannot be undone.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white"
                disabled={isDeleting}
                onClick={() => deleteTrip(() => router.push(ROUTES.splitBills))}
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
