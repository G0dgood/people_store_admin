"use client";

import React, { useState, useCallback } from "react";
import { Icon } from "../Icon";
import { Radio } from "@/app/components/Form";
import Checkbox from "@/app/components/Checkbox";
import { RangeSlider } from "../Form/RangeSlider";
import { Rating } from "../Other/Rating";
import { FilterState } from "@/app/types/products";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-gray-200 py-6 first:border-t-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-5 group"
      >
        <h4 className="font-outfit font-bold text-gray-900 text-xs uppercase tracking-widest group-hover:text-brand-gold transition-colors">{title}</h4>
        <Icon
          name="expand_more"
          size="md"
          className={`text-gray-300 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && <div className="flex flex-col gap-3">{children}</div>}
    </div>
  );
};

import { useFilter } from "@/app/context/FilterContext";

interface FilterSidebarProps {
  categories: any[];
  isLoadingCategories?: boolean;
  brands: any[];
  isLoadingBrands?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  isLoadingCategories,
  brands,
  isLoadingBrands,
  minPrice = 0,
  maxPrice = 500000
}) => {
  const { filters, setFilters } = useFilter();

  const handleCategoryClick = useCallback((category: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === category ? "" : category
    }));
  }, [setFilters]);

  const handleBrandToggle = useCallback((brand: string) => {
    setFilters(prev => ({
      ...prev,
      brand: prev.brand === brand ? "" : brand
    }));
  }, [setFilters]);

  const handleConditionChange = useCallback((status: string) => {
    setFilters(prev => ({ ...prev, status }));
  }, [setFilters]);

  const handlePriceRangeChange = useCallback((val: [number, number]) => {
    setFilters(prev => ({ ...prev, minPrice: val[0], maxPrice: val[1] }));
  }, [setFilters]);

  const handleMinPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) }));
  }, [setFilters]);

  const handleMaxPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }));
  }, [setFilters]);

  const handleRatingToggle = useCallback((val: number) => {
    setFilters(prev => ({
      ...prev,
      rating: prev.rating === val ? 0 : val
    }));
  }, [setFilters]);

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-4 max-h-[calc(100vh-120px)] overflow-y-auto overscroll-contain pr-2 scrollbar-none hover:scrollbar-thin transition-all">
      {/* Categories */}
      <FilterSection title="Category">
        <ul className="flex flex-col gap-3 text-[11px] uppercase tracking-widest font-bold">
          {isLoadingCategories ? (
            <div className="p-2 text-gray-400 italic font-medium">Syncing...</div>
          ) : (
            categories?.map((cat) => (
              <li
                key={cat?._id || cat?.name}
                onClick={() => handleCategoryClick(cat?.name)}
                className={`cursor-pointer transition-all duration-300 hover:tracking-[0.15em] ${filters.category === cat?.name ? "text-brand-gold" : "text-gray-500 hover:text-brand-gold"}`}
              >
                {cat.name}
              </li>
            ))
          )}
          <li
            onClick={() => setFilters(prev => ({ ...prev, category: "" }))}
            className="text-brand-gold font-bold mt-2 cursor-pointer hover:tracking-[0.15em] transition-all duration-300"
          >
            View all boutique
          </li>
        </ul>
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Artisanal Houses">
        {isLoadingBrands ? (
          <div className="p-2 text-gray-400 italic font-medium">Syncing...</div>
        ) : (
          brands.map((brand) => (
            <Checkbox
              key={brand._id || brand.name}
              label={brand.name}
              checked={filters.brand === brand.name}
              onChange={() => handleBrandToggle(brand.name)}
              size="lg"
              className="text-[11px] font-bold uppercase tracking-widest text-gray-600"
            />
          ))
        )}
        <span
          onClick={() => setFilters(prev => ({ ...prev, brand: "" }))}
          className="text-brand-gold text-[10px] font-bold uppercase tracking-widest mt-2 cursor-pointer hover:tracking-[0.15em] transition-all duration-300"
        >
          View all houses
        </span>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability">
        {["All", "In Stock", "Out of Stock"].map((status) => (
          <Radio
            key={status}
            name="availability"
            label={status}
            checked={filters.condition === status} // Reusing condition for now or I should add a new field
            onChange={() => handleConditionChange(status)}
          />
        ))}
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price range">
        <div className="px-1 pt-2 pb-6">
          <RangeSlider
            min={minPrice}
            max={maxPrice}
            step={100}
            value={[filters.minPrice ?? minPrice, filters.maxPrice ?? maxPrice]}
            onChange={handlePriceRangeChange}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Min Price</span>
            <input
              type="number"
              value={filters.minPrice ?? minPrice}
              onChange={handleMinPriceChange}
              className="w-full border border-gray-200 px-3 py-2 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-brand-gold bg-gray-50/50"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Max Price</span>
            <input
              type="number"
              value={filters.maxPrice ?? maxPrice}
              onChange={handleMaxPriceChange}
              className="w-full border border-gray-200 px-3 py-2 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-brand-gold bg-gray-50/50"
            />
          </div>
        </div>
      </FilterSection>

      {/* Ratings */}
      <FilterSection title="Ratings">
        {[5, 4, 3, 2].map((val) => (
          <div
            key={val}
            className="flex items-center justify-between group cursor-pointer py-1"
            onClick={() => handleRatingToggle(val)}
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${filters.rating === val ? "bg-brand-gold border-brand-gold" : "border-gray-200 group-hover:border-brand-gold"}`}>
                {filters.rating === val && <Icon name="check" size="xs" className="text-white" />}
              </div>
              <div className="flex items-center gap-2">
                <Rating value={val} />
                {val < 5 && (
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                    & Up
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <span
          onClick={() => setFilters(prev => ({ ...prev, rating: 0 }))}
          className="text-brand-gold text-[10px] font-bold uppercase tracking-widest mt-2 cursor-pointer hover:tracking-[0.15em] transition-all duration-300"
        >
          View all ratings
        </span>
      </FilterSection>
    </aside>
  );
};

export { FilterSidebar };
