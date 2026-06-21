import { SplitBillPublicView } from '@/features/split-bill/presentation/views/SplitBillPublicView';

// Public page — no authentication required
export default async function BillPublicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SplitBillPublicView billId={id} />;
}
