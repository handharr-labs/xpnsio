import type { TripRepository } from '../repositories/TripRepository';
import { DomainError } from '@/shared/domain/errors/DomainError';

export interface UploadTripSettlementProofParams {
  settlementId: string;
  proofImageUrl: string;
}

export interface UploadTripSettlementProofUseCase {
  execute(params: UploadTripSettlementProofParams): Promise<void>;
}

export class UploadTripSettlementProofUseCaseImpl implements UploadTripSettlementProofUseCase {
  constructor(private readonly repository: TripRepository) {}

  async execute(params: UploadTripSettlementProofParams): Promise<void> {
    if (!params.settlementId.trim()) {
      throw DomainError.validationFailed('settlementId', 'Settlement ID is required');
    }

    if (!params.proofImageUrl.trim()) {
      throw DomainError.validationFailed('proofImageUrl', 'Proof image URL is required');
    }

    return this.repository.uploadSettlementProof(params.settlementId, params.proofImageUrl);
  }
}
