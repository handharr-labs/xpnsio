import type { Trip } from '../entities/Trip';
import type { TripRepository, CreateTripParams } from '../repositories/TripRepository';
import { ValidationError } from '@handharr-labs/forge-core';

export interface CreateTripUseCase {
  execute(params: CreateTripParams): Promise<Trip>;
}

export class CreateTripUseCaseImpl implements CreateTripUseCase {
  constructor(private readonly repository: TripRepository) {}

  async execute(params: CreateTripParams): Promise<Trip> {
    if (!params.name.trim()) {
      throw new ValidationError('Trip name is required');
    }

    if (params.endDate && params.endDate < params.startDate) {
      throw new ValidationError('End date must be on or after start date');
    }

    return this.repository.create(params);
  }
}
