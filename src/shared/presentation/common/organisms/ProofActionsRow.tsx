'use client';

import { Button } from '@/components/ui/button';

interface ProofActionsRowProps {
  isUpdating: boolean;
  onApprove: () => void;
  onReject: () => void;
}

export function ProofActionsRow({ isUpdating, onApprove, onReject }: ProofActionsRowProps) {
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        className="flex-1 rounded-xl bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/25"
        disabled={isUpdating}
        onClick={onApprove}
      >
        Approve
      </Button>
      <Button
        size="sm"
        className="flex-1 rounded-xl bg-red-500/15 text-red-700 dark:text-red-400 hover:bg-red-500/25"
        disabled={isUpdating}
        onClick={onReject}
      >
        Reject
      </Button>
    </div>
  );
}
