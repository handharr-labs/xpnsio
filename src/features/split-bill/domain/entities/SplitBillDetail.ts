import type { SplitBill } from './SplitBill';
import type { SplitBillAccount } from './SplitBillAccount';
import type { SplitBillParticipant } from './SplitBillParticipant';
import type { SplitBillItem } from './SplitBillItem';
import type { SplitBillAdjustment } from './SplitBillAdjustment';

export interface SplitBillDetail extends SplitBill {
  readonly accounts: SplitBillAccount[];
  readonly participants: SplitBillParticipant[];
  readonly items: SplitBillItem[];
  readonly adjustments: SplitBillAdjustment[];
}
