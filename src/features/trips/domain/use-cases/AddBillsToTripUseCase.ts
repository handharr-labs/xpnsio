import type { TripRepository } from '../repositories/TripRepository';
import { ValidationError } from '@handharr-labs/forge-core';

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
      throw new ValidationError('Trip ID is required');
    }

    if (params.billIds.length === 0) {
      throw new ValidationError('At least one bill ID is required');
    }

    await this.repository.addBills(params.tripId, params.billIds, params.userId);
    await this.repository.syncSettlements(params.tripId);
  }
}
