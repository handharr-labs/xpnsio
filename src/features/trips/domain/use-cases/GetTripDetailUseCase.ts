import type { TripDetail } from '../entities/TripDetail';
import type { TripRepository } from '../repositories/TripRepository';
import { ValidationError, NotFoundError } from '@handharr-labs/forge-core';

export interface GetTripDetailParams {
  tripId: string;
  userId: string;
}

export interface GetTripDetailUseCase {
  execute(params: GetTripDetailParams): Promise<TripDetail>;
}

export class GetTripDetailUseCaseImpl implements GetTripDetailUseCase {
  constructor(private readonly repository: TripRepository) {}

  async execute(params: GetTripDetailParams): Promise<TripDetail> {
    if (!params.tripId.trim()) {
      throw new ValidationError('Trip ID is required');
    }

    const detail = await this.repository.getDetail(params.tripId, params.userId);
    if (!detail) {
      throw new NotFoundError('trip');
    }

    return detail;
  }
}
