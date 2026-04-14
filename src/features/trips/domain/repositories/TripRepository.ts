import type { Trip } from '../entities/Trip';
import type { TripDetail } from '../entities/TripDetail';
import type { SettlementStatus } from '../entities/TripParticipantSettlement';

export interface CreateTripParams {
  userId: string;
  name: string;
  startDate: Date;
  endDate: Date | null;
  description: string | null;
}

export interface TripRepository {
  create(params: CreateTripParams): Promise<Trip>;
  getDetail(tripId: string, userId: string): Promise<TripDetail | null>;
  getPublicDetail(tripId: string): Promise<TripDetail | null>;
  list(userId: string): Promise<Trip[]>;
  delete(tripId: string, userId: string): Promise<void>;
  addBills(tripId: string, billIds: string[], userId: string): Promise<void>;
  syncSettlements(tripId: string): Promise<void>;
  uploadSettlementProof(settlementId: string, proofImageUrl: string): Promise<void>;
  updateSettlementStatus(settlementId: string, status: SettlementStatus, userId: string): Promise<void>;
}
