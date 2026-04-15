export interface PaymentAccount {
  readonly id: string;
  readonly userId: string;
  readonly bankName: string;
  readonly accountNumber: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
