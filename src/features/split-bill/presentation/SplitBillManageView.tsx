'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Luggage, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useSplitBillManageViewModel } from './useSplitBillManageViewModel';
import { ROUTES } from '@/shared/presentation/navigation/routes';
import { ShareLinkRow } from '@/shared/presentation/common/organisms/ShareLinkRow';
import { PaymentAccountList } from '@/shared/presentation/common/organisms/PaymentAccountList';
import { ProofImageModal } from '@/shared/presentation/common/organisms/ProofImageModal';
import { DeleteConfirmDialog } from '@/shared/presentation/common/organisms/DeleteConfirmDialog';
import { ManageParticipantCard } from '@/shared/presentation/common/organisms/ManageParticipantCard';

export function SplitBillManageView({ billId }: { billId: string }) {
  const router = useRouter();
  const { bill, isLoading, isUpdating, isDeleting, error, approveParticipant, rejectParticipant, deleteBillById } =
    useSplitBillManageViewModel(billId);
  const [proofModal, setProofModal] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const publicUrl = typeof window !== 'undefined'
    ? bill?.tripId
      ? `${window.location.origin}${ROUTES.tripPublic(bill.tripId)}`
      : `${window.location.origin}${ROUTES.splitBillPublic(billId)}`
    : '';
  const shareHref = bill?.tripId
    ? ROUTES.tripPublic(bill.tripId)
    : ROUTES.splitBillPublic(billId);

  if (isLoading) {
    return (
      <main className="px-4 pt-4 pb-8 max-w-lg mx-auto">
        <div className="h-8 w-48 bg-muted rounded-xl animate-pulse mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 w-full rounded-2xl bg-muted animate-pulse" />)}
        </div>
      </main>
    );
  }

  if (!bill) {
    return (
      <main className="min-h-screen px-4 pt-4 max-w-lg mx-auto flex items-center justify-center">
        <p className="text-muted-foreground">Bill not found.</p>
      </main>
    );
  }

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
            <h1 className="text-xl font-bold truncate">{bill.title}</h1>
            <p className="text-xs text-muted-foreground">{bill.date} · <span className="capitalize">{bill.splitMode}</span></p>
          </div>
          <button
            onClick={() => router.push(ROUTES.splitBillEdit(billId))}
            className="flex items-center justify-center w-11 h-11 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
            aria-label="Edit bill"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center justify-center w-11 h-11 rounded-xl bg-muted hover:bg-red-500/10 text-muted-foreground hover:text-red-600 transition-colors"
            aria-label="Delete bill"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </header>

        {error && (
          <div className="rounded-xl bg-red-500/10 ring-1 ring-red-500/20 p-3 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {bill.tripId && (
          <div className="flex items-center gap-3 rounded-xl ring-1 ring-border bg-muted px-4 py-3">
            <Luggage className="w-4 h-4 shrink-0 text-muted-foreground" />
            <p className="text-sm flex-1">Part of <span className="font-medium">{bill.tripName}</span></p>
            <Link
              href={ROUTES.tripDetail(bill.tripId)}
              className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-background ring-1 ring-border hover:bg-muted transition-colors shrink-0"
            >
              Go to trip
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* Share link */}
        <ShareLinkRow
          url={publicUrl}
          href={shareHref}
        />

        {/* Payment accounts */}
        <PaymentAccountList accounts={bill.accounts} />

        {/* Participants */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Participants</p>
          {bill.participants.map((p) => (
            <ManageParticipantCard
              key={p.id}
              name={p.name}
              amount={p.finalAmount}
              status={p.status}
              isCreator={p.isCreator}
              creatorBadgeLabel="Bill creator"
              proofImageUrl={p.proofImageUrl}
              isUpdating={isUpdating}
              onViewProof={p.proofImageUrl ? () => setProofModal(p.proofImageUrl!) : undefined}
              onApprove={() => approveParticipant(p.id)}
              onReject={() => rejectParticipant(p.id)}
            />
          ))}
        </div>
      </div>

      <ProofImageModal
        imageUrl={proofModal}
        onClose={() => setProofModal(null)}
      />

      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete bill?"
        description={
          <>
            This will permanently delete <span className="font-medium text-foreground">{bill?.title}</span> and all
            participant data. This cannot be undone.
          </>
        }
        warning={
          bill?.participants.some((p) => p.status === 'proof_uploaded' || p.status === 'approved')
            ? 'Some participants have already submitted or been approved. Their proof data will be lost.'
            : undefined
        }
        isDeleting={isDeleting}
        onConfirm={() => deleteBillById(() => router.push(ROUTES.splitBills))}
      />
    </main>
  );
}
