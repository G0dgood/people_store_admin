"use client";

import React, { useMemo } from "react";
import { Icon } from "../Icon";
import { FilterState, ViewMode, SORT_OPTIONS, DEFAULT_FILTERS } from "@/app/types/products";

interface ListingControlBarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  count: number;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onFilterClick?: () => void;
}

/**
 * ViewSwitcher Sub-component
 */
const ViewSwitcher = ({ mode, onChange }: { mode: ViewMode; onChange: (mode: ViewMode) => void }) => (
  <div className="flex items-center border border-gray-100 bg-white">
    <button
      onClick={() => onChange("grid")}
      className={`w-10 h-10 flex items-center justify-center transition-all duration-300 ${
        mode === "grid" ? "bg-gray-50 text-brand-gold" : "text-gray-400 hover:text-gray-900"
      }`}
      aria-label="Grid View"
    >
      <Icon name="grid_view" size="sm" />
    </button>
    <button
      onClick={() => onChange("list")}
      className={`w-10 h-10 flex items-center justify-center border-l border-gray-100 transition-all duration-300 ${
        mode === "list" ? "bg-gray-50 text-brand-gold" : "text-gray-400 hover:text-gray-900"
      }`}
      aria-label="List View"
    >
      <Icon name="list" size="sm" />
    </button>
  </div>
);

/**
 * SortSelector Sub-component
 */
const SortSelector = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center border border-gray-100 px-4 h-10 bg-white cursor-pointer hover:bg-gray-50 transition-colors group ${className}`}>
    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 group-hover:text-gray-900">Sort: Featured</span>
    <Icon name="expand_more" size="xs" className="text-gray-300 ml-8 group-hover:text-brand-gold transition-colors" />
  </div>
);

/**
 * FilterTag Sub-component
 */
const FilterTag = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <div
    onClick={onRemove}
    className="flex items-center gap-3 px-4 py-2 border border-gray-100 bg-white cursor-pointer hover:border-brand-gold transition-all duration-300 group"
  >
    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 group-hover:text-gray-900">{label}</span>
    <Icon name="close" size="xs" className="text-gray-300 group-hover:text-brand-gold" />
  </div>
);

const ListingControlBar: React.FC<ListingControlBarProps> = ({
  viewMode,
  onViewModeChange,
  count,
  filters,
  onFiltersChange,
  onFilterClick,
}) => {
  // Memoize active tags to avoid unnecessary recalcs
  const activeTags = useMemo(() => {
    const tags: { id: string; label: string; onRemove: () => void }[] = [];

    if (filters.category) {
      tags.push({
        id: `cat-${filters.category}`,
        label: filters.category,
        onRemove: () => onFiltersChange({ ...filters, category: null }),
      });
    }

    filters.brands.forEach((brand) => {
      tags.push({
        id: `brand-${brand}`,
        label: brand,
        onRemove: () => onFiltersChange({ ...filters, brands: filters.brands.filter((b) => b !== brand) }),
      });
    } );

    filters.ratings.forEach((rating) => {
      tags.push({
        id: `rating-${rating}`,
        label: `${rating} Stars`,
        onRemove: () => onFiltersChange({ ...filters, ratings: filters.ratings.filter((r) => r !== rating) }),
      });
    });

    return tags;
  }, [filters, onFiltersChange]);

  const handleClearAll = () => onFiltersChange(DEFAULT_FILTERS);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Desktop Bar */}
      <div className="hidden md:flex w-full bg-white border border-gray-100 h-20 items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-1">Curation</span>
            <span className="text-xs font-outfit text-gray-900">
              <span className="font-bold text-brand-gold">{count.toLocaleString()}</span> masterpieces found
              {filters.category && <span> in <span className="font-bold">{filters.category}</span></span>}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SortSelector />
          <ViewSwitcher mode={viewMode} onChange={onViewModeChange} />
        </div>
      </div>

      {/* Mobile Bar */}
      <div className="flex md:hidden flex-col gap-3 px-1">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Discovering</span>
            <span className="text-[11px] font-outfit font-bold">{count} PRODUCTS</span>
          </div>
          <ViewSwitcher mode={viewMode} onChange={onViewModeChange} />
        </div>
        
        <div className="flex items-center gap-2">
          {/* Mobile Sort/Filter Buttons */}
          <button className="flex-1 flex items-center justify-between px-4 py-3 bg-white border border-gray-100 group hover:border-brand-gold transition-colors">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Sort</span>
            <Icon name="expand_more" size="xs" className="text-gray-300 group-hover:text-brand-gold" />
          </button>

          <button
            onClick={onFilterClick}
            className="flex-1 flex items-center justify-between px-4 py-3 bg-white border border-gray-100 group hover:border-brand-gold transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Filter</span>
              {activeTags.length > 0 && (
                <span className="bg-brand-gold text-white text-[9px] w-4 h-4 flex items-center justify-center font-bold">
                  {activeTags.length}
                </span>
              )}
            </div>
            <Icon name="filter_alt" size="xs" className="text-gray-300 group-hover:text-brand-gold" />
          </button>
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mr-2">Refining by:</span>
          {activeTags.map((tag) => (
            <FilterTag key={tag.id} label={tag.label} onRemove={tag.onRemove} />
          ))}
          <button
            onClick={handleClearAll}
            className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.15em] ml-2 hover:tracking-[0.2em] transition-all duration-300 border-b border-brand-gold/0 hover:border-brand-gold"
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  );
};

export { ListingControlBar };
