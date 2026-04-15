import type { TripRepository } from '../repositories/TripRepository';

export interface DeleteTripParams {
  tripId: string;
  userId: string;
}

export interface DeleteTripUseCase {
  execute(params: DeleteTripParams): Promise<void>;
}

export class DeleteTripUseCaseImpl implements DeleteTripUseCase {
  constructor(private readonly repository: TripRepository) {}

  async execute(params: DeleteTripParams): Promise<void> {
    return this.repository.delete(params.tripId, params.userId);
  }
}
