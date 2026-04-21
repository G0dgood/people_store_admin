"use client";

import React from "react";
import { Icon } from "../Icon";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  // Generate page numbers dynamically to avoid showing non-existent pages
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show neighbors of current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        if (!pages.includes("...")) {
          pages.push("...");
        }
      }

      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className={`admin-pagination-footer !p-4 sm:!p-8 flex-col sm:flex-row gap-4 sm:gap-0 ${className}`}>
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="admin-pagination-btn group disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center sm:justify-start py-2 sm:py-2.5"
      >
        <Icon
          name="arrow_back"
          folder="icon"
          size="md"
          className="transition-transform group-hover:-translate-x-0.5"
        />
        <span className="hidden sm:inline">Previous</span>
      </button>

      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
        {pages.map((page, i) => (
          <button
            key={i}
            onClick={() => typeof page === "number" && onPageChange(page)}
            className={`cursor-pointer min-w-[32px] sm:min-w-[36px] w-8 h-8 sm:w-9 sm:h-9 rounded-[6px] flex items-center justify-center text-[12px] font-bold transition-all shrink-0 ${
              page === currentPage
                ? "bg-brand-charcoal text-white shadow-lg shadow-gray-200"
                : "text-gray-400 hover:text-gray-900 hover:bg-gray-50 border border-transparent sm:border-gray-200"
            } ${page === "..." ? "cursor-default border-none" : ""}`}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="admin-pagination-btn group disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center sm:justify-end py-2 sm:py-2.5"
      >
        <span className="hidden sm:inline">Next</span>
        <Icon
          name="arrow_forward"
          folder="icon"
          size="md"
          className="transition-transform group-hover:translate-x-0.5"
        />
      </button>
    </div>
  );
};
