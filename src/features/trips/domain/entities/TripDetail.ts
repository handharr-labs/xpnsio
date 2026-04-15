import type { Trip } from './Trip';
import type { TripParticipantSettlement } from './TripParticipantSettlement';
import type { SplitBillDetail } from '@/features/split-bill/domain/entities/SplitBillDetail';

export interface TripDetail {
  readonly trip: Trip;
  readonly settlements: TripParticipantSettlement[];
  readonly bills: SplitBillDetail[];
}
