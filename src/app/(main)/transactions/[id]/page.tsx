import { TransactionDetailView } from '@/features/transactions/presentation/views/TransactionDetailView';

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TransactionDetailView id={id} />;
}
