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
  // Generate page numbers to display
  // For now, mirroring the [1, 2, 3, 4, 5, "...", total] pattern from the designs
  const pages = [1, 2, 3, 4, 5, "...", totalPages];

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
                ? "bg-brand-blue text-white shadow-lg shadow-blue-100"
                : "text-gray-400 hover:text-gray-900 hover:bg-gray-50 border border-transparent sm:border-gray-100"
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
