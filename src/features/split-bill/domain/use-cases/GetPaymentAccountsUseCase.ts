import type { PaymentAccount } from '../entities/PaymentAccount';
import type { PaymentAccountRepository } from '../repositories/PaymentAccountRepository';

export interface GetPaymentAccountsUseCase {
  execute(userId: string): Promise<PaymentAccount[]>;
}

export class GetPaymentAccountsUseCaseImpl implements GetPaymentAccountsUseCase {
  constructor(private readonly repository: PaymentAccountRepository) {}

  async execute(userId: string): Promise<PaymentAccount[]> {
    return this.repository.getByUserId(userId);
  }
}
