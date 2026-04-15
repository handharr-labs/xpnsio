import type { Trip } from '../entities/Trip';
import type { TripRepository } from '../repositories/TripRepository';

export interface ListTripsParams {
  userId: string;
}

export interface ListTripsUseCase {
  execute(params: ListTripsParams): Promise<Trip[]>;
}

export class ListTripsUseCaseImpl implements ListTripsUseCase {
  constructor(private readonly repository: TripRepository) {}

  async execute(params: ListTripsParams): Promise<Trip[]> {
    return this.repository.list(params.userId);
  }
}
