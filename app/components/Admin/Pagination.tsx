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
    <div className={`admin-pagination-footer ${className}`}>
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="admin-pagination-btn group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icon
          name="arrow_back"
          folder="icon"
          size="md"
          className="transition-transform group-hover:-translate-x-0.5"
        />
        Previous
      </button>

      <div className="flex items-center gap-2">
        {pages.map((page, i) => (
          <button
            key={i}
            onClick={() => typeof page === "number" && onPageChange(page)}
            className={`cursor-pointer w-9 h-9 rounded-[6px] flex items-center justify-center text-[12px] font-bold transition-all ${
              page === currentPage
                ? "bg-brand-blue text-white shadow-lg shadow-blue-100"
                : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
            } ${page === "..." ? "cursor-default" : ""}`}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="admin-pagination-btn group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
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
