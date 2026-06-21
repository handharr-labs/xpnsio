import type {
  TripRepository,
  CreateTripParams,
} from '@/features/trips/domain/repositories/TripRepository';
import type { Trip } from '@/features/trips/domain/entities/Trip';
import type { TripDetail } from '@/features/trips/domain/entities/TripDetail';
import type { SettlementStatus } from '@/features/trips/domain/entities/TripParticipantSettlement';
import type { TripDbDataSource } from '@/features/trips/data/data-sources/TripDbDataSource';
import type { SplitBillDbDataSource } from '@/features/split-bill/data/data-sources/SplitBillDbDataSource';
import { TripMapper } from '@/features/trips/data/mappers/TripMapper';
import { SplitBillMapper } from '@/features/split-bill/data/mappers/SplitBillMapper';
import { DomainError, UnexpectedError } from '@handharr-labs/core';

export class TripRepositoryImpl implements TripRepository {
  private readonly tripMapper = new TripMapper();
  private readonly billMapper = new SplitBillMapper();

  constructor(
    private readonly tripDataSource: TripDbDataSource,
    private readonly billDataSource: SplitBillDbDataSource
  ) {}

  async create(params: CreateTripParams): Promise<Trip> {
    try {
      const row = await this.tripDataSource.create({
        userId: params.userId,
        name: params.name,
        startDate: params.startDate.toISOString().split('T')[0],
        endDate: params.endDate ? params.endDate.toISOString().split('T')[0] : null,
        description: params.description,
      });
      return this.tripMapper.toTrip(row);
    } catch (error) {
      throw new UnexpectedError(error);
    }
  }

  async getDetail(tripId: string, userId: string): Promise<TripDetail | null> {
    try {
      const record = await this.tripDataSource.findById(tripId, userId);
      if (!record) return null;

      // Fetch full bill details
      const billDetails = [];
      for (const billId of record.billIds) {
        const billDetail = await this.billDataSource.findById(billId);
        if (billDetail) {
          billDetails.push(this.billMapper.toDetail(billDetail));
        }
      }

      return this.tripMapper.toDetail(record, billDetails);
    } catch (error) {
      throw new UnexpectedError(error);
    }
  }

  async getPublicDetail(tripId: string): Promise<TripDetail | null> {
    try {
      const record = await this.tripDataSource.findPublicById(tripId);
      if (!record) return null;

      const billDetails = [];
      for (const billId of record.billIds) {
        const billDetail = await this.billDataSource.findById(billId);
        if (billDetail) {
          billDetails.push(this.billMapper.toDetail(billDetail));
        }
      }

      return this.tripMapper.toDetail(record, billDetails);
    } catch (error) {
      throw new UnexpectedError(error);
    }
  }

  async list(userId: string): Promise<Trip[]> {
    try {
      const rows = await this.tripDataSource.findByUserId(userId);
      return rows.map((r) => this.tripMapper.toTrip(r));
    } catch (error) {
      throw new UnexpectedError(error);
    }
  }

  async delete(tripId: string, userId: string): Promise<void> {
    try {
      await this.tripDataSource.delete(tripId, userId);
    } catch (error) {
      throw new UnexpectedError(error);
    }
  }

  async addBills(tripId: string, billIds: string[], userId: string): Promise<void> {
    try {
      await this.tripDataSource.addBills(tripId, billIds, userId);
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }
      throw new UnexpectedError(error);
    }
  }

  async syncSettlements(tripId: string): Promise<void> {
    try {
      await this.tripDataSource.syncSettlements(tripId);
    } catch (error) {
      throw new UnexpectedError(error);
    }
  }

  async uploadSettlementProof(settlementId: string, proofImageUrl: string): Promise<void> {
    try {
      await this.tripDataSource.updateSettlementProof(settlementId, proofImageUrl);
    } catch (error) {
      throw new UnexpectedError(error);
    }
  }

  async updateSettlementStatus(
    settlementId: string,
    status: SettlementStatus,
    userId: string
  ): Promise<void> {
    try {
      // Note: userId is accepted for authorization check in the use case layer
      // The data source would need to verify ownership if needed, but for now
      // we trust the use case to have done authorization
      await this.tripDataSource.updateSettlementStatus(
        settlementId,
        status as 'pending' | 'proof_uploaded' | 'approved' | 'rejected'
      );
    } catch (error) {
      throw new UnexpectedError(error);
    }
  }
}
