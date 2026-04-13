export interface SplitBillItem {
  readonly id: string;
  readonly billId: string;
  readonly name: string;
  readonly price: number; // IDR integer
  readonly orderIndex: number;
  readonly assignedParticipantIds: string[];
}
