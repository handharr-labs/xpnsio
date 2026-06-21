import { SplitBillEditView } from '@/features/split-bill/presentation/views/SplitBillEditView';

export default async function SplitBillEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SplitBillEditView billId={id} />;
}
