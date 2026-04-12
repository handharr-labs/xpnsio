import type { SplitBillParticipant } from '../entities/SplitBillParticipant';
import type { SplitBillRepository } from '../repositories/SplitBillRepository';

export interface UpdateParticipantStatusInput {
  participantId: string;
  status: 'approved' | 'rejected';
}

export interface UpdateParticipantStatusUseCase {
  execute(input: UpdateParticipantStatusInput): Promise<SplitBillParticipant>;
}

export class UpdateParticipantStatusUseCaseImpl implements UpdateParticipantStatusUseCase {
  constructor(private readonly repository: SplitBillRepository) {}

  async execute(input: UpdateParticipantStatusInput): Promise<SplitBillParticipant> {
    return this.repository.updateParticipantStatus(input.participantId, input.status);
  }
}
