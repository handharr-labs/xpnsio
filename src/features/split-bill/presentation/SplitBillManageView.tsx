'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ImageIcon, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useSplitBillManageViewModel } from './useSplitBillManageViewModel';
import { formatCurrency } from '@/shared/presentation/utils/formatCurrency';
import { ROUTES } from '@/shared/presentation/navigation/routes';
import type { ParticipantStatus } from '../domain/entities/SplitBillParticipant';
import { ShareLinkRow } from '@/shared/presentation/common/organisms/ShareLinkRow';
import { PaymentAccountItem } from '@/shared/presentation/common/organisms/PaymentAccountItem';
import { ProofImageModal } from '@/shared/presentation/common/organisms/ProofImageModal';
import { DeleteConfirmDialog } from '@/shared/presentation/common/organisms/DeleteConfirmDialog';
import { ProofActionsRow } from '@/shared/presentation/common/organisms/ProofActionsRow';

const STATUS_STYLES: Record<ParticipantStatus, string> = {
  pending: 'bg-muted text-muted-foreground',
  proof_uploaded: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  approved: 'bg-green-500/10 text-green-700 dark:text-green-400',
  rejected: 'bg-red-500/10 text-red-700 dark:text-red-400',
};

const STATUS_LABEL: Record<ParticipantStatus, string> = {
  pending: 'Pending',
  proof_uploaded: 'Proof uploaded',
  approved: 'Approved',
  rejected: 'Rejected',
};

export function SplitBillManageView({ billId }: { billId: string }) {
  const router = useRouter();
  const { bill, isLoading, isUpdating, isDeleting, error, approveParticipant, rejectParticipant, deleteBillById } =
    useSplitBillManageViewModel(billId);
  const [proofModal, setProofModal] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${ROUTES.splitBillPublic(billId)}`
    : '';

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

        {/* Share link */}
        <ShareLinkRow
          url={publicUrl}
          href={ROUTES.splitBillPublic(billId)}
        />

        {/* Payment accounts */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Payment accounts</p>
          {bill.accounts.map((acc) => (
            <PaymentAccountItem
              key={acc.id}
              id={acc.id}
              bankName={acc.bankName}
              accountNumber={acc.accountNumber}
            />
          ))}
        </div>

        {/* Participants */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Participants</p>
          {bill.participants.map((p) => (
            <div key={p.id} className="rounded-xl ring-1 ring-border p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    {p.name}
                    {p.isCreator && (
                      <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-medium">Me</span>
                    )}
                  </p>
                  <p className="text-sm font-medium text-primary">{formatCurrency(p.finalAmount, 'IDR')}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[p.status]}`}>
                  {STATUS_LABEL[p.status]}
                </span>
              </div>

              {p.proofImageUrl && (
                <button
                  onClick={() => setProofModal(p.proofImageUrl!)}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ImageIcon className="w-4 h-4" /> View proof
                </button>
              )}

              {p.status === 'proof_uploaded' && (
                <ProofActionsRow
                  isUpdating={isUpdating}
                  onApprove={() => approveParticipant(p.id)}
                  onReject={() => rejectParticipant(p.id)}
                />
              )}
            </div>
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
