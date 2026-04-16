export type SplitMode = 'equal' | 'custom' | 'itemized';

export interface SplitBill {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly description: string | null;
  readonly date: string; // YYYY-MM-DD
  readonly splitMode: SplitMode;
  readonly tripId: string | null;
  readonly tripName: string | null;
  readonly createdAt: Date;
}
