'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Copy, Check, ExternalLink, ImageIcon, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSplitBillManageViewModel } from './useSplitBillManageViewModel';
import { formatCurrency } from '@/shared/presentation/utils/formatCurrency';
import { ROUTES } from '@/shared/presentation/navigation/routes';
import type { ParticipantStatus } from '../domain/entities/SplitBillParticipant';

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
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [proofModal, setProofModal] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${ROUTES.splitBillPublic(billId)}`
    : '';

  const copyAccount = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(id);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen px-4 pt-4 max-w-lg mx-auto">
        <div className="h-8 w-48 bg-muted rounded-xl animate-pulse mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />)}
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
        <div className="rounded-2xl bg-muted/50 ring-1 ring-border p-4 space-y-2">
          <p className="text-sm font-medium">Share with participants</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={publicUrl}
              className="flex-1 h-10 px-3 rounded-xl bg-background ring-1 ring-border text-sm text-muted-foreground focus:outline-none"
            />
            <button
              onClick={copyLink}
              className="h-10 px-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedLink ? 'Copied' : 'Copy'}
            </button>
            <a
              href={ROUTES.splitBillPublic(billId)}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center ring-1 ring-border"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Payment accounts */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Payment accounts</p>
          {bill.accounts.map((acc) => (
            <div key={acc.id} className="flex items-center justify-between rounded-xl bg-muted/50 ring-1 ring-border px-4 py-3">
              <div>
                <p className="text-sm font-semibold">{acc.bankName}</p>
                <p className="text-xs text-muted-foreground font-mono">{acc.accountNumber}</p>
              </div>
              <button
                onClick={() => copyAccount(acc.accountNumber, acc.id)}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
              >
                {copiedAccount === acc.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedAccount === acc.id ? 'Copied' : 'Copy'}
              </button>
            </div>
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
                    {p.isCreator ? 'You' : p.name}
                    {p.isCreator && (
                      <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-medium">You</span>
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
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white"
                    disabled={isUpdating}
                    onClick={() => approveParticipant(p.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 rounded-xl text-red-600 border-red-200 hover:bg-red-50"
                    disabled={isUpdating}
                    onClick={() => rejectParticipant(p.id)}
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
          <img src={proofModal} alt="Payment proof" className="max-w-full max-h-full rounded-xl object-contain" />
        </div>
      )}

      {/* Delete confirmation dialog */}
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
              <h2 className="text-base font-semibold">Delete bill?</h2>
              <p className="text-sm text-muted-foreground">
                This will permanently delete <span className="font-medium text-foreground">{bill?.title}</span> and all
                participant data. This cannot be undone.
              </p>
              {bill?.participants.some((p) => p.status === 'proof_uploaded' || p.status === 'approved') && (
                <p className="text-sm text-yellow-700 dark:text-yellow-400 bg-yellow-500/10 rounded-xl px-3 py-2">
                  Some participants have already submitted or been approved. Their proof data will be lost.
                </p>
              )}
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
                onClick={() => deleteBillById(() => router.push(ROUTES.splitBills))}
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
