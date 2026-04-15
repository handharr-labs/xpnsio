import type { PaymentAccountRepository } from '../repositories/PaymentAccountRepository';

export interface SavePaymentAccountsParams {
  userId: string;
  accounts: { bankName: string; accountNumber: string }[];
}

export interface SavePaymentAccountsUseCase {
  execute(params: SavePaymentAccountsParams): Promise<void>;
}

export class SavePaymentAccountsUseCaseImpl implements SavePaymentAccountsUseCase {
  constructor(private readonly repository: PaymentAccountRepository) {}

  async execute(params: SavePaymentAccountsParams): Promise<void> {
    return this.repository.upsertMany(params.userId, params.accounts);
  }
}
