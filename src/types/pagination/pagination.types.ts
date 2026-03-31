export interface Pagination {
  total: number;
  currentPage: number;
  limit: number;
  lastPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}
