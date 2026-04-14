import type { TripDetail } from '../entities/TripDetail';
import type { TripRepository } from '../repositories/TripRepository';
import { DomainError } from '@/shared/domain/errors/DomainError';

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
      throw DomainError.validationFailed('tripId', 'Trip ID is required');
    }

    const detail = await this.repository.getDetail(params.tripId, params.userId);
    if (!detail) {
      throw DomainError.notFound('trip', params.tripId);
    }

    return detail;
  }
}
