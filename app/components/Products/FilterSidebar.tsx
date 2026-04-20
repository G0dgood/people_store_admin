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

const FilterSection: React.FC<FilterSectionProps> = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-gray-100 py-6 first:border-t-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-5 group"
      >
        <h4 className="font-outfit font-bold text-gray-900 text-xs uppercase tracking-widest group-hover:text-brand-gold transition-colors">{title}</h4>
        <Icon
          name="expand_more"
          size="xs"
          className={`text-gray-300 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && <div className="flex flex-col gap-3">{children}</div>}
    </div>
  );
};

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, setFilters }) => {
  const handleCategoryClick = useCallback((category: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === category ? null : category
    }));
  }, [setFilters]);

  const handleBrandToggle = useCallback((brand: string) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
  }, [setFilters]);

  const handleConditionChange = useCallback((condition: string) => {
    setFilters(prev => ({ ...prev, condition }));
  }, [setFilters]);

  const handleRatingToggle = useCallback((val: number) => {
    setFilters(prev => ({
      ...prev,
      ratings: prev.ratings.includes(val)
        ? prev.ratings.filter(r => r !== val)
        : [...prev.ratings, val]
    }));
  }, [setFilters]);

  const handlePriceRangeChange = useCallback((val: [number, number]) => {
    setFilters(prev => ({ ...prev, priceRange: val }));
  }, [setFilters]);

  const handleMinPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, priceRange: [Number(e.target.value), prev.priceRange[1]] }));
  }, [setFilters]);

  const handleMaxPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], Number(e.target.value)] }));
  }, [setFilters]);

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col gap-4">
      {/* Categories */}
      <FilterSection title="Category">
        <ul className="flex flex-col gap-3 text-[11px] uppercase tracking-widest font-bold">
          {["Signature Fragrance", "Luxury Skincare", "Boutique Gift Sets", "Body & Bath", "Home Fragrance"].map((cat) => (
            <li
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`cursor-pointer transition-all duration-300 hover:tracking-[0.15em] ${filters.category === cat ? "text-brand-gold" : "text-gray-500 hover:text-brand-gold"}`}
            >
              {cat}
            </li>
          ))}
          <li className="text-brand-gold font-bold mt-2 cursor-pointer hover:tracking-[0.15em] transition-all duration-300">View all boutique</li>
        </ul>
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Artisanal Houses">
        {["Bloom & Mist", "Prada", "Versace", "Gucci", "Dior"].map((brand) => (
          <Checkbox
            key={brand}
            label={brand}
            checked={filters.brands.includes(brand)}
            onChange={() => handleBrandToggle(brand)}
            size="lg"
            className="text-[11px] font-bold uppercase tracking-widest text-gray-600"
          />
        ))}
        <span className="text-brand-gold text-[10px] font-bold uppercase tracking-widest mt-2 cursor-pointer hover:tracking-[0.15em] transition-all duration-300">View all houses</span>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price range">
        <div className="px-1 pt-2 pb-6">
          <RangeSlider
            min={0}
            max={2000}
            step={10}
            value={filters.priceRange}
            onChange={handlePriceRangeChange}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-xs text-gray-400">Min</span>
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={handleMinPriceChange}
              className="w-full border border-gray-100 px-3 py-2 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-brand-gold bg-gray-50/50"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Max</span>
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={handleMaxPriceChange}
              className="w-full border border-gray-100 px-3 py-2 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-brand-gold bg-gray-50/50"
            />
          </div>
        </div>
      </FilterSection>

      {/* Collection */}
      <FilterSection title="Collection Type">
        {["Any", "Intense", "Discovery", "Essential", "Seasonal"].map((cond) => (
          <Radio
            key={cond}
            name="condition"
            label={cond}
            checked={filters.condition === cond}
            onChange={() => handleConditionChange(cond)}
          />
        ))}
      </FilterSection>

      {/* Ratings */}
      <FilterSection title="Ratings">
        {[5, 4, 3, 2].map((val) => (
          <div key={val} className="flex items-center gap-2 group cursor-pointer" onClick={() => handleRatingToggle(val)}>
            <Checkbox
              checked={filters.ratings.includes(val)}
              onChange={() => handleRatingToggle(val)}
              size="lg"
            />
            <Rating value={val} />
          </div>
        ))}
      </FilterSection>
    </aside>
  );
};

export { FilterSidebar };
