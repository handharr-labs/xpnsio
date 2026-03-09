export interface PaginatedResult<T> {
  readonly items: T[];
  readonly totalCount: number;
  readonly currentPage: number;
  readonly totalPages: number;
}
