import React from "react";
import { Icon } from "../Icon";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  showSizeChanger?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems = 0,
  onPageChange,
  showSizeChanger = false,
  pageSize = 12,
  pageSizeOptions = [12, 24, 48, 96],
  onPageSizeChange,
  className = "",
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Helper to generate page range
  const getPageRange = () => {
    const delta = 2;
    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) range.unshift("...");
    if (currentPage + delta < totalPages - 1) range.push("...");

    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);

    return range;
  };

  const pages = getPageRange();

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-6 ${className}`}>
      {totalItems > 0 && (
        <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
          Showing <span className="text-gray-900">{startItem}</span> – <span className="text-gray-900">{endItem}</span> of <span className="text-gray-900">{totalItems}</span> results
        </div>
      )}

      <div className="flex items-center gap-3">
        {showSizeChanger && (
          <div className="relative group mr-4">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              className="appearance-none bg-white border border-gray-200 pl-4 pr-10 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:border-brand-gold focus:outline-none transition-all cursor-pointer rounded-none"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option} Per Page
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 group-hover:text-brand-gold transition-colors">
              <Icon name="expand_more" size="xs" />
            </div>
          </div>
        )}

        <div className="flex items-center">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition-all group"
          >
            <Icon name="chevron_left" size="sm" className="text-gray-900 group-hover:text-brand-gold" />
          </button>

          <div className="flex -mx-px">
            {pages.map((page, idx) => {
              if (page === "...") {
                return (
                  <span key={`dots-${idx}`} className="w-10 h-10 flex items-center justify-center text-gray-400 text-xs font-bold border-t border-b border-gray-200">
                    ...
                  </span>
                );
              }

              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page as number)}
                  className={`w-10 h-10 text-[11px] font-black tracking-widest transition-all border border-gray-200 -mx-px flex items-center justify-center ${
                    isActive
                      ? "bg-brand-gold text-white border-brand-gold z-10 scale-105 shadow-md"
                      : "text-gray-500 hover:bg-gray-50 hover:text-brand-gold"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex items-center justify-center border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition-all group"
          >
            <Icon name="chevron_right" size="sm" className="text-gray-900 group-hover:text-brand-gold" />
          </button>
        </div>
      </div>
    </div>
  );
};

export { Pagination };
