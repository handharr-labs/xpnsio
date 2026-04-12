export type SplitMode = 'equal' | 'custom' | 'itemized';

export interface SplitBill {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly description: string | null;
  readonly date: string; // YYYY-MM-DD
  readonly splitMode: SplitMode;
  readonly createdAt: Date;
}
