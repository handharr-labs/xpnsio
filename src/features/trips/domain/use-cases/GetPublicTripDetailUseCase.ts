import type { TripDetail } from '../entities/TripDetail';
import type { TripRepository } from '../repositories/TripRepository';
import { DomainError } from '@/shared/domain/errors/DomainError';

export interface GetPublicTripDetailUseCase {
  execute(tripId: string): Promise<TripDetail | null>;
}

export class GetPublicTripDetailUseCaseImpl implements GetPublicTripDetailUseCase {
  constructor(private readonly repository: TripRepository) {}

  async execute(tripId: string): Promise<TripDetail | null> {
    if (!tripId.trim()) {
      throw DomainError.validationFailed('tripId', 'Trip ID is required');
    }

    return this.repository.getPublicDetail(tripId);
  }
}
