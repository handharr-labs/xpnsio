import type { SplitBillParticipant } from '../entities/SplitBillParticipant';
import type { SplitBillRepository } from '../repositories/SplitBillRepository';
import { DomainError } from '@/shared/domain/errors/DomainError';

export interface UploadPaymentProofInput {
  participantId: string;
  imageUrl: string;
}

export interface UploadPaymentProofUseCase {
  execute(input: UploadPaymentProofInput): Promise<SplitBillParticipant>;
}

export class UploadPaymentProofUseCaseImpl implements UploadPaymentProofUseCase {
  constructor(private readonly repository: SplitBillRepository) {}

  async execute(input: UploadPaymentProofInput): Promise<SplitBillParticipant> {
    if (!input.imageUrl) {
      throw DomainError.validationFailed('imageUrl', 'Proof image URL is required');
    }
    return this.repository.uploadProof(input.participantId, input.imageUrl);
  }
}
