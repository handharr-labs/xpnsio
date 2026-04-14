import { TripDetailView } from '@/features/trips/presentation/views/TripDetailView';

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  return <TripDetailView tripId={tripId} />;
}
