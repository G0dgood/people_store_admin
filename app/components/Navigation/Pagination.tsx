import React from "react";
import { Icon } from "../Icon";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
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
  onPageChange,
  showSizeChanger = false,
  pageSize = 10,
  pageSizeOptions = [10, 15, 20, 50],
  onPageSizeChange,
  className = "",
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex border border-gray-200 overflow-hidden bg-white">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 flex items-center justify-center border-r border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none"
        >
          <Icon name="chevron_left" size="sm" className="text-brand-blue" />
        </button>

        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-r border-gray-200 last:border-r-0 ${
                isActive
                  ? "bg-brand-blue-light text-brand-blue"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none"
        >
          <Icon name="chevron_right" size="sm" className="text-brand-blue" />
        </button>
      </div>

      {showSizeChanger && (
        <div className="relative">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            className="appearance-none bg-white border border-gray-200 pl-4 pr-10 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                Show {option}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Icon name="expand_more" size="xs" className="text-gray-400" />
          </div>
        </div>
      )}
    </div>
  );
};

export { Pagination };
