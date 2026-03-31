import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cm } from "@lib/utils";
import type {
  PageBtnProps,
  PaginationProps,
} from "./pagination-interfaces.types";
// import type { Pagination } from "@types/index";

const PER_PAGE_OPTIONS = [5, 10, 25, 50, 100];

export default function PaginationControl({
  pagination,
  onPageChange,
  onPerPageChange,
  perPageOptions = PER_PAGE_OPTIONS,
  className,
}: PaginationProps) {
  const { currentPage, lastPage, limit, total } = pagination;

  const start = Math.min((currentPage - 1) * limit + 1, total);
  const end = Math.min(currentPage * limit, total);

  // Build visible page numbers with ellipsis
  const getPageNumbers = (): (number | "...")[] => {
    if (lastPage <= 7) return Array.from({ length: lastPage }, (_, i) => i + 1);

    const pages: (number | "...")[] = [1];

    if (currentPage > 3) pages.push("...");

    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(lastPage - 1, currentPage + 1);

    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);

    if (currentPage < lastPage - 2) pages.push("...");

    pages.push(lastPage);
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={cm(
        "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1",
        className,
      )}
    >
      {/* Info & per-page selector */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-ink-tertiary whitespace-nowrap">
          {total > 0 ? `${start}–${end} dari ${total} data` : "Tidak ada data"}
        </span>

        {onPerPageChange && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-ink-tertiary">Tampilkan</span>
            <select
              value={limit}
              onChange={(e) => onPerPageChange(Number(e.target.value))}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-ink focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
            >
              {perPageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Page buttons */}
      {lastPage > 1 && (
        <div className="flex items-center gap-1">
          {/* First */}
          <PageBtn
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            aria-label="Halaman pertama"
          >
            <ChevronsLeft size={14} />
          </PageBtn>
          {/* Prev */}
          <PageBtn
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft size={14} />
          </PageBtn>

          {/* Numbers */}
          {pageNumbers.map((page, idx) =>
            page === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="w-8 text-center text-xs text-ink-tertiary"
              >
                …
              </span>
            ) : (
              <PageBtn
                key={page}
                onClick={() => onPageChange(page)}
                active={page === currentPage}
              >
                {page}
              </PageBtn>
            ),
          )}

          {/* Next */}
          <PageBtn
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === lastPage}
            aria-label="Halaman berikutnya"
          >
            <ChevronRight size={14} />
          </PageBtn>
          {/* Last */}
          <PageBtn
            onClick={() => onPageChange(lastPage)}
            disabled={currentPage === lastPage}
            aria-label="Halaman terakhir"
          >
            <ChevronsRight size={14} />
          </PageBtn>
        </div>
      )}
    </div>
  );
}

function PageBtn({
  onClick,
  disabled,
  active,
  children,
  "aria-label": ariaLabel,
}: PageBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cm(
        "min-w-8 h-8 px-2 flex items-center justify-center rounded-lg text-xs font-medium transition-all duration-150",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        active
          ? "bg-primary-600 text-white shadow-sm"
          : "text-ink-secondary hover:bg-slate-100 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
