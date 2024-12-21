export interface Pagination {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export type SortOrder = "asc" | "desc";