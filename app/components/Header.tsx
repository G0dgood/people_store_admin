"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "./Icon";
import { DropdownMenu, DropdownItem } from "./Dropdown/DropdownMenu";
import { Logo } from "./Logo";
import { useMobileMenu } from "@/app/context/MobileMenuContext";
import { SearchBar } from "./Header/SearchBar";
import { ActionIcons } from "./Header/ActionIcons";
import { SecondaryNavbar } from "./Header/SecondaryNavbar";

const Header = () => {
  const { toggleMenu } = useMobileMenu();

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
          <Link href="/" className="flex-shrink-0">
            <Logo size="sm" variant="on-light" />
          </Link>
        </div>

        {/* Desktop Logo */}
        <Link href="/" className="flex-shrink-0 hidden lg:flex">
          <Logo size="md" variant="on-light" />
        </Link>

        {/* Search Bar (Desktop: inline, Mobile: hidden or secondary) */}
        <div className="md:block hidden">
          <SearchBar />
        </div>

        {/* Action Icons */}
        <ActionIcons />
      </div>

      {/* Mobile Search Input (Visible only on mobile header row 2) */}
      <div className="md:hidden px-4 pb-4">
        <SearchBar />
        {/* <div className="w-full h-10 bg-white flex items-center px-3 gap-2 border border-gray-200">
          <Icon name="search" size="sm" className="text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent text-sm w-full outline-none"
          />
        </div> */}
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
