"use client";

import React from "react";

interface CategoryChipsProps {
  categories: string[];
  selectedCategory: string | null;
  onSelect: (category: string) => void;
  className?: string;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedCategory,
  onSelect,
  className = "",
}) => {
  return (
    <div className={`w-full overflow-x-auto scrollbar-none flex items-center gap-2 px-4 py-2 bg-white ${className}`}>
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`
              px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors
              ${isSelected 
                ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/20" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent"}
            `}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};
