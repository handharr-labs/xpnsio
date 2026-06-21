import { SplitBillManageView } from '@/features/split-bill/presentation/views/SplitBillManageView';

export default async function SplitBillManagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SplitBillManageView billId={id} />;
}
