export function orZero(value: number | null | undefined): number {
  return value ?? 0;
}

export function orEmpty(value: string | null | undefined): string {
  return value ?? '';
}

export function orEmptyArray<T>(value: T[] | null | undefined): T[] {
  return value ?? [];
}

export function orDefault<T>(value: T | null | undefined, defaultValue: T): T {
  return value ?? defaultValue;
}

export function compact<T>(array: (T | null | undefined)[]): T[] {
  return array.filter((item): item is T => item != null);
}

export function firstNonNull<T>(...values: (T | null | undefined)[]): T | null {
  return values.find((v) => v != null) ?? null;
}
