import type { TripRepository } from '../repositories/TripRepository';
import { DomainError } from '@/shared/domain/errors/DomainError';

export interface AddBillsToTripParams {
  tripId: string;
  billIds: string[];
  userId: string;
}

export interface AddBillsToTripUseCase {
  execute(params: AddBillsToTripParams): Promise<void>;
}

export class AddBillsToTripUseCaseImpl implements AddBillsToTripUseCase {
  constructor(private readonly repository: TripRepository) {}

  async execute(params: AddBillsToTripParams): Promise<void> {
    if (!params.tripId.trim()) {
      throw DomainError.validationFailed('tripId', 'Trip ID is required');
    }

    if (params.billIds.length === 0) {
      throw DomainError.validationFailed('billIds', 'At least one bill ID is required');
    }

    await this.repository.addBills(params.tripId, params.billIds, params.userId);
    await this.repository.syncSettlements(params.tripId);
  }
}
