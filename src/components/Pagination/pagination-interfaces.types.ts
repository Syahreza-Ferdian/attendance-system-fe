import type { Pagination } from "@/types/pagination/pagination.types";

export interface PaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  perPageOptions?: number[];
  className?: string;
}

export interface PageBtnProps {
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
  "aria-label"?: string;
}
