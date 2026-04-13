export type AdjustmentType = 'percentage' | 'fixed';
export type AdjustmentDistribution = 'proportional' | 'equal';

export interface SplitBillAdjustment {
  readonly id: string;
  readonly billId: string;
  readonly label: string;
  readonly type: AdjustmentType;
  readonly value: number; // percentage × 100 (e.g. 1100 = 11%) or fixed IDR amount
  readonly distribution: AdjustmentDistribution;
  readonly orderIndex: number;
}
