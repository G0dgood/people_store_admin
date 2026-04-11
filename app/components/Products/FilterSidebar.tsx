"use client";

import React, { useState } from "react";
import { Icon } from "../Icon";
import { Checkbox, Radio } from "../Form/SelectionControls";
import { RangeSlider } from "../Form/RangeSlider";
import { Rating } from "../Other/Rating";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-gray-200 py-4 first:border-t-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-4 group"
      >
        <h4 className="font-bold text-gray-900 text-sm group-hover:text-brand-blue transition-colors">{title}</h4>
        <Icon
          name="expand_more"
          size="xs"
          className={`text-gray-400 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && <div className="flex flex-col gap-2">{children}</div>}
    </div>
  );
};

const FilterSidebar = () => {
  const [priceRange, setPriceRange] = useState<[number, number]>([200, 800]);

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col gap-4">
      {/* Categories */}
      <FilterSection title="Category">
        <ul className="flex flex-col gap-2 text-sm text-gray-600">
          <li className="hover:text-brand-blue cursor-pointer">Mobile accessory</li>
          <li className="hover:text-brand-blue cursor-pointer">Electronics</li>
          <li className="hover:text-brand-blue cursor-pointer">Smartphones </li>
          <li className="hover:text-brand-blue cursor-pointer">Modern tech</li>
          <li className="text-brand-blue font-medium mt-2 cursor-pointer">See all</li>
        </ul>
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Brands">
        <Checkbox label="Samsung" defaultChecked />
        <Checkbox label="Apple" />
        <Checkbox label="Huawei" />
        <Checkbox label="Pocco" />
        <Checkbox label="Lenovo" />
        <span className="text-brand-blue text-sm font-medium mt-1 cursor-pointer">See all</span>
      </FilterSection>

      {/* Features */}
      <FilterSection title="Features">
        <Checkbox label="Metallic" defaultChecked />
        <Checkbox label="Plastic cover" />
        <Checkbox label="8GB RAM" />
        <Checkbox label="Super AMOLED" defaultChecked />
        <Checkbox label="Fingerprint" />
        <span className="text-brand-blue text-sm font-medium mt-1 cursor-pointer">See all</span>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price range">
        <div className="px-1 pt-2 pb-6">
          <RangeSlider
            min={0}
            max={1000}
            step={10}
            value={priceRange}
            onChange={setPriceRange}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-xs text-gray-400">Min</span>
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-brand-blue"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-xs text-gray-400">Max</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-brand-blue"
            />
          </div>
        </div>
        <button className="w-full mt-2 py-2 border border-blue-100 text-brand-blue text-sm font-bold rounded-md bg-white hover:bg-blue-50 transition-colors  cursor-pointer">
          Apply
        </button>
      </FilterSection>

      {/* Condition */}
      <FilterSection title="Condition">
        <Radio name="condition" label="Any" defaultChecked />
        <Radio name="condition" label="Refurbished" />
        <Radio name="condition" label="Brand new" />
        <Radio name="condition" label="Old items" />
      </FilterSection>

      {/* Ratings */}
      <FilterSection title="Ratings">
        {[5, 4, 3, 2].map((val) => (
          <div key={val} className="flex items-center gap-2 group cursor-pointer">
            <Checkbox />
            <Rating value={val} />
          </div>
        ))}
      </FilterSection>
    </aside>
  );
};

export { FilterSidebar };
