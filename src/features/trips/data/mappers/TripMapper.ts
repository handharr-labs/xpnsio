import type { Trip } from '@/features/trips/domain/entities/Trip';
import type { TripDetail } from '@/features/trips/domain/entities/TripDetail';
import type { TripParticipantSettlement } from '@/features/trips/domain/entities/TripParticipantSettlement';
import type { TripRow, TripParticipantSettlementRow } from '@/lib/schema';
import type { TripDetailRecord } from '@/features/trips/data/data-sources/TripDbDataSource';
import type { SplitBillDetail } from '@/features/split-bill/domain/entities/SplitBillDetail';

export class TripMapper {
  toTrip(row: TripRow): Trip {
    return {
      id: row.id,
      userId: row.userId,
      name: row.name,
      startDate: new Date(row.startDate),
      endDate: row.endDate ? new Date(row.endDate) : null,
      description: row.description ?? null,
      createdAt: row.createdAt,
    };
  }

  toSettlement(row: TripParticipantSettlementRow): TripParticipantSettlement {
    return {
      id: row.id,
      tripId: row.tripId,
      participantName: row.participantName,
      participantEmail: row.participantEmail ?? null,
      totalNetAmount: row.totalNetAmount,
      proofImageUrl: row.proofImageUrl ?? null,
      status: row.status as 'pending' | 'proof_uploaded' | 'approved' | 'rejected',
      proofUploadedAt: row.proofUploadedAt ?? null,
      approvedAt: row.approvedAt ?? null,
      createdAt: row.createdAt,
    };
  }

  toDetail(record: TripDetailRecord, billDetails: SplitBillDetail[]): TripDetail {
    return {
      trip: this.toTrip(record),
      settlements: record.settlements.map((s) => this.toSettlement(s)),
      bills: billDetails,
    };
  }
}
