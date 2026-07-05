import type { SettlementStatus } from '../entities/TripParticipantSettlement';
import type { TripRepository } from '../repositories/TripRepository';
import { ValidationError } from '@handharr-labs/forge-core';

export interface UpdateTripSettlementStatusParams {
  settlementId: string;
  status: Exclude<SettlementStatus, 'pending'>;
  userId: string;
}

export interface UpdateTripSettlementStatusUseCase {
  execute(params: UpdateTripSettlementStatusParams): Promise<void>;
}

export class UpdateTripSettlementStatusUseCaseImpl implements UpdateTripSettlementStatusUseCase {
  constructor(private readonly repository: TripRepository) {}

  async execute(params: UpdateTripSettlementStatusParams): Promise<void> {
    if (!params.settlementId.trim()) {
      throw new ValidationError('Settlement ID is required');
    }

    const validStatuses: Exclude<SettlementStatus, 'pending'>[] = ['proof_uploaded', 'approved', 'rejected'];
    if (!validStatuses.includes(params.status)) {
      throw new ValidationError(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    return this.repository.updateSettlementStatus(params.settlementId, params.status, params.userId);
  }
}
