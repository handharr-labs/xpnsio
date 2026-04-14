export interface Trip {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly startDate: Date;
  readonly endDate: Date | null;
  readonly description: string | null;
  readonly createdAt: Date;
}
