'use client';

interface ProofImageModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export function ProofImageModal({ imageUrl, onClose }: ProofImageModalProps) {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <img
        src={imageUrl}
        alt="Payment proof"
        className="max-w-full max-h-full rounded-xl object-contain"
      />
    </div>
  );
}
