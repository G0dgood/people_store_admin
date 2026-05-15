"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/app/components/Icon";
import { Logo } from "@/app/components/Logo";
import { useMobileMenu } from "@/app/context/MobileMenuContext";
import { useOfficeLocationInfo } from "@/app/context/OfficeLocationContext";
import { useGetPublicCategoriesQuery } from "@/lib/redux/services/boutiqueApi";
import { OfficeLocationSearchBar } from "./OfficeLocationSearchBar";
import { OfficeLocationActionIcons } from "./OfficeLocationActionIcons";
import { OfficeLocationSecondaryNavbar } from "./OfficeLocationSecondaryNavbar";
import { getShopUrl } from "../utils/storeUtils";

export const OfficeLocationHeader = () => {
  const { toggleMenu } = useMobileMenu();
  const { storeContext } = useOfficeLocationInfo();
  const { data: categoriesResponse } = useGetPublicCategoriesQuery();

  const categories = categoriesResponse?.data && 'categories' in categoriesResponse.data
    ? categoriesResponse.data.categories
    : (Array.isArray(categoriesResponse?.data) ? categoriesResponse.data : []);

  const homeUrl = getShopUrl("/", storeContext.subdomain, storeContext.officeId);

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
          <Link href={homeUrl} className="flex-shrink-0">
            <Logo size="sm" variant="on-light" />
          </Link>
        </div>

        {/* Desktop Logo */}
        <Link href={homeUrl} className="flex-shrink-0 hidden lg:flex text-center">
          <Logo size="md" variant="on-light" />
          {/* <span className="block text-[10px] font-black uppercase tracking-widest text-brand-gold -mt-1">
            {storeContext.officeName || "Local Office"}
          </span> */}
        </Link>

        {/* Search Bar */}
        <div className="md:block hidden">
          <OfficeLocationSearchBar />
        </div>

        {/* Action Icons */}
        <OfficeLocationActionIcons />
      </div>

      {/* Mobile Search Input */}
      <div className="md:hidden px-4 pb-4">
        <OfficeLocationSearchBar />
      </div>

      {/* Secondary Navbar (Desktop Sublinks) */}
      <OfficeLocationSecondaryNavbar />

      {/* Mobile Categories Nav */}
      <div className="w-full overflow-x-auto bg-white border-t border-gray-200 md:hidden flex items-center gap-4 px-4 h-11 scrollbar-none whitespace-nowrap">
        <Link
          href={homeUrl}
          className="bg-white text-neutral-900 border border-gray-200 text-sm px-3 py-1.5 flex-shrink-0 font-bold uppercase text-[10px] tracking-wider"
        >
          All products
        </Link>
        {categories.map((item: any) => (
          <Link
            key={item._id}
            href={`${homeUrl}&category=${encodeURIComponent(item.name)}`}
            className="bg-white text-neutral-900 border border-gray-200 text-sm px-3 py-1.5 flex-shrink-0 font-bold uppercase text-[10px] tracking-wider"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </header>
  );
};
