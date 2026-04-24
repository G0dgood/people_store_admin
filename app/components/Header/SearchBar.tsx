"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Icon } from "../Icon";
import { DropdownMenu, DropdownItem } from "../Dropdown/DropdownMenu";
import { SearchAutocomplete } from "./SearchAutocomplete";

export const SearchBar = () => {
  const router = useRouter();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchFocused(false);
    }
  };

  return (
    <div className="flex-1 w-full md:w-[660px]  z-50">
      <div className="flex w-full bg-gray-50/50 rounded-full border border-neutral-200 h-11">
        <div className="flex-1 flex items-center px-5 relative" ref={searchRef}>
          <Icon name="search" size="sm" className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search fragrances, skincare, body spray, brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="w-full text-sm outline-none text-gray-700 bg-transparent focus:outline-none placeholder:text-gray-400 font-medium"
          />
          {/* Search Autocomplete Dropdown */}
          <SearchAutocomplete searchQuery={searchQuery} isVisible={isSearchFocused} />
        </div>

        {/* Category Selector */}
        <div className="relative flex items-stretch border-l border-neutral-200" ref={categoryRef}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setIsCategoryOpen(prev => !prev);
            }}
            className="w-36 h-full flex items-center justify-between px-4 bg-transparent cursor-pointer hover:bg-gray-100 transition-colors border-r border-neutral-200"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600 truncate">Categories</span>
            <Icon name="expand_more" size="xs" className={`text-gray-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Category Dropdown */}
          <AnimatePresence>
            {isCategoryOpen && (
              <div className="absolute top-full right-0 pt-3 w-56 z-[100]" onClick={() => setIsCategoryOpen(false)}>
                <DropdownMenu width="100%" className="shadow-2xl border border-gray-200 rounded-xl">
                  <DropdownItem label="All categories" isActive />
                  <DropdownItem label="Signature Fragrance" />
                  <DropdownItem label="Luxury Skincare" />
                  <DropdownItem label="Boutique Gift Sets" />
                  <DropdownItem label="Body & Bath" />
                  <DropdownItem label="Home Fragrance" />
                </DropdownMenu>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Gold Search Action Button */}
        <div className="flex items-center px-1">
          <button
            onClick={handleSearch}
            className="h-9 w-9 flex items-center justify-center bg-brand-gold text-white rounded-tr-full rounded-br-full hover:bg-brand-gold/80 transition-all active:scale-95 shadow-sm"
          >
            <Icon name="search" size="sm" className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
