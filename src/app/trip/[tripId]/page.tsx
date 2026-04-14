import { TripPublicView } from '@/features/trips/presentation/views/TripPublicView';

// Public page — no authentication required
export default async function TripPublicPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  return <TripPublicView tripId={tripId} />;
}
