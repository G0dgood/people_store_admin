"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "./Icon";
import { DropdownMenu, DropdownItem } from "./Dropdown/DropdownMenu";
import { useMobileMenu } from "@/app/context/MobileMenuContext";
import { SearchAutocomplete } from "./Header/SearchAutocomplete";
import { ActionIcons } from "./Header/ActionIcons";
import { SecondaryNavbar } from "./Header/SecondaryNavbar";

const Header = () => {
  const { toggleMenu } = useMobileMenu();
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

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-[80]">
      {/* Top Main Header */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 h-16 md:h-20 flex items-center justify-between gap-4 md:gap-12">
        {/* Mobile: Hamburger & Logo Group */}
        <div className="flex items-center gap-4 lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-900 p-1"
          >
            <Icon name="menu" size="md" />
          </button>
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="h-8 overflow-hidden">
              <img src="/brand_logo/logo-symbol.svg" alt="Bloom & Mist" className="h-full object-contain" />
            </div>
            <span className="font-black text-xl tracking-tighter text-neutral-900 font-inter whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-500">
              Bloom & Mist
            </span>
          </Link>
        </div>

        {/* Desktop Logo */}
        <Link href="/" className="flex-shrink-0 hidden lg:flex items-center gap-2">
          <div className="h-10 overflow-hidden brightness-0">
            <img src="/brand_logo/logo-symbol.svg" alt="Bloom & Mist" className="h-full object-contain" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-neutral-900 font-inter whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-500">
            Bloom & Mist
          </span>
        </Link>

        {/* Search Bar (Desktop: inline, Mobile: hidden or secondary) */}
        <div className="flex-1 max-w-[660px] h-11 border-2 border-neutral-900 hidden md:flex relative z-50">
          <div className="flex-1 flex items-center px-3 bg-white border-r border-neutral-200 relative" ref={searchRef}>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="w-full text-sm outline-none text-gray-700 bg-transparent focus:outline-none"
            />
            {/* Search Autocomplete Dropdown */}
            <SearchAutocomplete searchQuery={searchQuery} isVisible={isSearchFocused} />
          </div>
          <div className="relative z-50 flex items-stretch" ref={categoryRef}>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsCategoryOpen(prev => !prev);
              }}
              className="w-32 h-full flex items-center justify-between px-3 bg-white cursor-pointer border-r border-neutral-200 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm text-gray-700 truncate pr-2">All category</span>
              <Icon name="expand_more" size="xs" className={`text-gray-400 flex-shrink-0 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Category Dropdown */}
            <AnimatePresence>
              {isCategoryOpen && (
                <div className="absolute top-full left-0 pt-3 w-48 z-[100]" onClick={() => setIsCategoryOpen(false)}>
                  <DropdownMenu width="100%" className="shadow-lg border border-gray-200">
                    <DropdownItem label="All categories" isActive />
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
          <Link href="/products" className="bg-neutral-900 px-6 text-white text-sm font-bold hover:bg-black transition-colors flex items-center justify-center">
            Search
          </Link>
        </div>

        {/* Action Icons */}
        <ActionIcons />
      </div>

      {/* Mobile Search Input (Visible only on mobile header row 2) */}
      <div className="md:hidden px-4 pb-4">
        <div className="w-full h-10 bg-white flex items-center px-3 gap-2 border border-gray-200">
          <Icon name="search" size="sm" className="text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent text-sm w-full outline-none"
          />
        </div>
      </div>

      {/* Secondary Navbar (Desktop only) */}
      <SecondaryNavbar />

      {/* Mobile Breadcrumb-like nav (Home page specifics etc.) */}
      <div className="w-full overflow-x-auto bg-white border-t border-gray-200 md:hidden flex items-center gap-4 px-4 h-11 scrollbar-none whitespace-nowrap">
        {["All category", "Perfume", "Serum", "Cleansers", "Gift Box"].map((item, idx) => (
          <span key={idx} className="bg-white text-neutral-900 border border-gray-200 text-sm px-3 py-1.5 flex-shrink-0 font-bold uppercase text-[10px] tracking-wider">
            {item}
          </span>
        ))}
      </div>
    </header>
  );
};

export { Header };
