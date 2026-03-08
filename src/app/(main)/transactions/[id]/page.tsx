import { TransactionDetailView } from '@/presentation/features/transactions/TransactionDetailView';

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TransactionDetailView id={id} />;
}
