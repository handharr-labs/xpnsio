import type { TripDetail } from '../entities/TripDetail';
import type { TripRepository } from '../repositories/TripRepository';
import { ValidationError } from '@handharr-labs/core';

export interface GetPublicTripDetailUseCase {
  execute(tripId: string): Promise<TripDetail | null>;
}

export class GetPublicTripDetailUseCaseImpl implements GetPublicTripDetailUseCase {
  constructor(private readonly repository: TripRepository) {}

  async execute(tripId: string): Promise<TripDetail | null> {
    if (!tripId.trim()) {
      throw new ValidationError('Trip ID is required');
    }

    return this.repository.getPublicDetail(tripId);
  }
}
