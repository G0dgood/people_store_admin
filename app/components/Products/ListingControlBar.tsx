"use client";

import React from "react";
import { Icon } from "../Icon";

interface ListingControlBarProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  count: number;
  filters: {
    category: string | null;
    brands: string[];
    priceRange: [number, number];
    condition: string;
    ratings: number[];
  };
  onFiltersChange: (filters: any) => void;
  onFilterClick?: () => void;
}

const ListingControlBar: React.FC<ListingControlBarProps> = ({
  viewMode,
  onViewModeChange,
  count,
  filters,
  onFiltersChange,
  onFilterClick,
}) => {
  const activeFilterTags = React.useMemo(() => {
    const tags: { id: string; label: string; type: string; value: any }[] = [];

    if (filters.category) {
      tags.push({ id: `cat-${filters.category}`, label: filters.category, type: 'category', value: filters.category });
    }

    filters.brands.forEach(brand => {
      tags.push({ id: `brand-${brand}`, label: brand, type: 'brand', value: brand });
    });

    filters.ratings.forEach(rating => {
      tags.push({ id: `rating-${rating}`, label: `${rating} Stars`, type: 'rating', value: rating });
    });

    return tags;
  }, [filters]);

  const handleRemoveTag = (tag: { type: string; value: any }) => {
    const nextFilters = { ...filters };
    if (tag.type === 'category') nextFilters.category = null;
    if (tag.type === 'brand') nextFilters.brands = nextFilters.brands.filter(b => b !== tag.value);
    if (tag.type === 'rating') nextFilters.ratings = nextFilters.ratings.filter(r => r !== tag.value);
    onFiltersChange(nextFilters);
  };

  const handleClearAll = () => {
    onFiltersChange({
      category: null,
      brands: [],
      priceRange: [0, 2000],
      condition: "Any",
      ratings: [],
    });
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top Bar Desktop */}
      <div className="hidden md:flex w-full bg-white border border-gray-200 h-16 items-center justify-between px-5">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">
            <span className="font-bold">{count.toLocaleString()}</span> products found
            {filters.category && <span> in <span className="font-bold">{filters.category}</span></span>}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <div className="flex items-center border border-gray-200 px-3 py-1.5 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-sm text-gray-700 font-medium">Featured</span>
            <Icon name="expand_more" size="xs" className="text-gray-400 ml-6" />
          </div>

          {/* View Switcher */}
          <div className="flex items-center border border-gray-200 overflow-hidden">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`w-9 h-9 flex items-center justify-center transition-colors cursor-pointer ${viewMode === "grid" ? "bg-gray-100" : "bg-white hover:bg-gray-50"}`}
            >
              <Icon name="grid_view" size="sm" className={viewMode === "grid" ? "text-brand-blue" : "text-gray-900"} />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`w-9 h-9 flex items-center justify-center border-l border-gray-200 transition-colors cursor-pointer ${viewMode === "list" ? "bg-gray-100" : "bg-white hover:bg-gray-50"}`}
            >
              <Icon name="list" size="sm" className={viewMode === "list" ? "text-brand-blue" : "text-gray-900"} />
            </button>
          </div>
        </div>
      </div>

      {/* Top Bar Mobile (as per design image) */}
      <div className="flex md:hidden items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2 flex-1">
          {/* Sort Button */}
          <button className="flex-1 flex items-center justify-between px-3 py-2 bg-white border border-gray-200 text-sm font-medium">
            <span>Sort: Newest</span>
            <Icon name="sort" size="xs" className="text-gray-400 ml-2" />
          </button>

          {/* Filter Button */}
          <button
            onClick={onFilterClick}
            className="flex-1 flex items-center justify-between px-3 py-2 bg-white border border-gray-200 text-sm font-medium"
          >
            <div className="flex items-center gap-2">
              <span>Filter</span>
              {activeFilterTags.length > 0 && (
                <span className="bg-brand-blue text-white text-[10px] w-4 h-4 flex items-center justify-center">
                  {activeFilterTags.length}
                </span>
              )}
            </div>
            <Icon name="filter_alt" size="xs" className="text-gray-400" />
          </button>
        </div>

        {/* Mobile View Toggles */}
        <div className="flex items-center bg-white border border-gray-200 overflow-hidden">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`w-10 h-10 flex items-center justify-center transition-colors ${viewMode === "grid" ? "bg-gray-100" : "bg-white"}`}
          >
            <Icon name="grid_view" size="sm" className={viewMode === "grid" ? "text-gray-900" : "text-gray-400"} />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`w-10 h-10 flex items-center justify-center border-l border-gray-200 transition-colors ${viewMode === "list" ? "bg-gray-100" : "bg-white"}`}
          >
            <Icon name="list" size="sm" className={viewMode === "list" ? "text-gray-900" : "text-gray-400"} />
          </button>
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeFilterTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilterTags.map((tag) => (
            <div
              key={tag.id}
              onClick={() => handleRemoveTag(tag)}
              className="flex items-center gap-2 px-3 py-1.5 border border-brand-blue h-8 bg-white cursor-pointer hover:bg-brand-blue-light transition-colors group"
            >
              <span className="text-sm text-gray-700">{tag.label}</span>
              <Icon name="clear" size="xs" className="text-gray-400 group-hover:text-brand-blue transition-colors" />
            </div>
          ))}
          <button
            onClick={handleClearAll}
            className="text-brand-blue text-sm font-medium ml-2 hover:underline cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export { ListingControlBar };
