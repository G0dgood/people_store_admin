import React, { useMemo, useState, useRef, useEffect } from "react";
import { Icon } from "../Icon";
import { FilterState, ViewMode, SORT_OPTIONS, DEFAULT_FILTERS } from "@/app/types/products";
import { AnimatePresence, motion } from "framer-motion";
import { DropdownMenu, DropdownItem } from "../Dropdown/DropdownMenu";
import { ListingSearch } from "../ui/ListingSearch";
import { FilterTag } from "../ui/FilterTag";

interface ListingControlBarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  count: number;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onFilterClick?: () => void;
}

/**
 * ViewSwitcher Sub-component
 */
const ViewSwitcher = ({ mode, onChange }: { mode: ViewMode; onChange: (mode: ViewMode) => void }) => (
  <div className="flex items-center border border-gray-200 bg-white">
    <button
      onClick={() => onChange("grid")}
      className={`w-10 h-10 flex items-center justify-center transition-all duration-300 ${mode === "grid" ? "bg-gray-50 text-brand-gold" : "text-gray-400 hover:text-gray-900"
        }`}
      aria-label="Grid View"
    >
      <Icon name="grid_view" size="sm" />
    </button>
    <button
      onClick={() => onChange("list")}
      className={`w-10 h-10 flex items-center justify-center border-l border-gray-200 transition-all duration-300 ${mode === "list" ? "bg-gray-50 text-brand-gold" : "text-gray-400 hover:text-gray-900"
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
const SortSelector = ({ currentSort, onSortChange, className = "" }: { currentSort: string; onSortChange: (id: string) => void; className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = SORT_OPTIONS.find(opt => opt.id === currentSort) || SORT_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center border px-4 h-10 cursor-pointer transition-colors group min-w-[180px] justify-between ${isOpen || currentSort !== "featured" ? "border-brand-gold bg-white" : "border-gray-200 bg-white hover:bg-gray-50"
          }`}
      >
        <span className={`text-[10px] font-bold tracking-[0.15em] ${isOpen || currentSort !== "featured" ? "text-brand-gold" : "text-gray-500 group-hover:text-gray-900"
          }`}>
          Sort: {currentOption.label}
        </span>
        <Icon
          name="expand_more"
          size="sm"
          className={`ml-4 transition-transform duration-300 ${isOpen || currentSort !== "featured" ? "text-brand-gold rotate-180" : "text-gray-300 group-hover:text-brand-gold"
            }`}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 z-50 w-64">
            <DropdownMenu width="100%" className="border border-gray-200 shadow-xl overflow-hidden">
              <div>
                {SORT_OPTIONS.map((option) => (
                  <DropdownItem
                    key={option.id}
                    label={option.label}
                    isActive={currentSort === option.id}
                    onSelect={() => {
                      onSortChange(option.id);
                      setIsOpen(false);
                    }}
                    className="text-[10px] tracking-widest font-bold py-3"
                  />
                ))}
              </div>
            </DropdownMenu>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};



const ListingControlBar: React.FC<ListingControlBarProps> = ({
  viewMode,
  onViewModeChange,
  count,
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  onFilterClick,
}) => {
  // Memoize active tags to avoid unnecessary recalcs
  const activeTags = useMemo(() => {
    const tags: { id: string; label: string; onRemove: () => void }[] = [];

    if (filters.category) {
      tags.push({
        id: `cat-${filters.category}`,
        label: filters.category,
        onRemove: () => onFiltersChange({ ...filters, category: "", subCategory: "" }),
      });
    }

    if (filters.subCategory) {
      tags.push({
        id: `subcat-${filters.subCategory}`,
        label: filters.subCategory,
        onRemove: () => onFiltersChange({ ...filters, subCategory: "" }),
      });
    }

    if (filters.brand) {
      tags.push({
        id: `brand-${filters.brand}`,
        label: filters.brand,
        onRemove: () => onFiltersChange({ ...filters, brand: "" }),
      });
    }

    if (filters.status && filters.status !== "All") {
      tags.push({
        id: `status-${filters.status}`,
        label: filters.status,
        onRemove: () => onFiltersChange({ ...filters, status: "All" }),
      });
    }

    if (filters.search) {
      tags.push({
        id: `search-${filters.search}`,
        label: `Search: ${filters.search}`,
        onRemove: () => onFiltersChange({ ...filters, search: "" }),
      });
    }

    return tags;
  }, [filters, onFiltersChange]);

  const handleClearAll = () => onFiltersChange(DEFAULT_FILTERS);

  return (
    <div className="w-full flex flex-col">
      {/* Desktop Bar */}
      <div className="hidden md:flex w-full bg-white border border-gray-200 h-20 items-center justify-between px-8 relative z-10">
        <div className="flex items-center gap-12">
          <div className="flex flex-col">
            <span className="text-[10px] tracking-[0.2em] font-bold text-gray-400 mb-1">Curation</span>
            <span className="text-md font-outfit text-gray-900">
              <span className="font-bold text-brand-gold">{count.toLocaleString()}</span> masterpieces found
              {filters.category && (
                <span> in <span className="font-bold">{filters.category}</span></span>
              )}
              {filters.subCategory && (
                <span> &gt; <span className="font-bold text-brand-gold">{filters.subCategory}</span></span>
              )}
            </span>
          </div>

          {/* <ListingSearch
            value={filters.search || ""}
            onChange={(val) => onFiltersChange({ ...filters, search: val })}
          /> */}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onFilterClick}
            className="flex lg:hidden items-center gap-3 px-6 h-10 border border-gray-200 bg-white hover:bg-gray-50 transition-colors group"
          >
            <span className="text-[10px] font-bold tracking-widest text-gray-500 group-hover:text-gray-900">Filter</span>
            <Icon name="filter_alt" size="xs" className="text-gray-300 group-hover:text-brand-gold" />
          </button>
          {/* <SortSelector currentSort={sortBy} onSortChange={onSortChange} /> */}
          <ViewSwitcher mode={viewMode} onChange={onViewModeChange} />
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeTags.length > 0 && (
        <div className="hidden md:flex flex-wrap items-center gap-3 py-4 px-8 bg-white border-x border-b border-gray-200 -mt-px relative z-0">
          <span className="text-[10px] tracking-[0.2em] font-bold text-gray-400 mr-2 uppercase">Refining by:</span>
          <div className="flex flex-wrap items-center gap-2">
            {activeTags.map((tag) => (
              <FilterTag key={tag.id} label={tag.label} onRemove={tag.onRemove} />
            ))}
          </div>
          <button
            onClick={handleClearAll}
            className="text-brand-gold text-[10px] font-bold tracking-[0.15em] ml-4 hover:tracking-[0.2em] transition-all duration-300 border-b border-brand-gold/0 hover:border-brand-gold uppercase"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Mobile Bar */}
      <div className="flex md:hidden flex-col gap-4">
        <div className="bg-white border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-bold text-gray-400">Discovering</span>
              <span className="text-[11px] font-outfit font-bold">{count} PRODUCTS</span>
            </div>
            <ViewSwitcher mode={viewMode} onChange={onViewModeChange} />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <SortSelector
                currentSort={sortBy}
                onSortChange={onSortChange}
                className="w-full h-full"
              />
            </div>

            <button
              onClick={onFilterClick}
              className="flex-1 flex items-center justify-between px-4 py-3 bg-white border border-gray-200 group hover:border-brand-gold transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold tracking-widest text-gray-600">Filter</span>
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

        {/* Mobile Filter Tags */}
        {activeTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 px-1 py-1">
            {activeTags.map((tag) => (
              <FilterTag key={tag.id} label={tag.label} onRemove={tag.onRemove} />
            ))}
            <button
              onClick={handleClearAll}
              className="text-brand-gold text-[10px] font-bold tracking-[0.15em] ml-1 uppercase"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export { ListingControlBar };
