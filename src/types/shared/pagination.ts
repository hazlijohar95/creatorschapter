
/**
 * Pagination related types
 */

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}
