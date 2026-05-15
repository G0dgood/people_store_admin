"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { HiChevronDown } from "react-icons/hi2";
import { useGetPublicBrandsQuery, useGetPublicCategoriesQuery } from "@/lib/redux/services/boutiqueApi";
import { useOfficeLocationInfo } from "@/app/context/OfficeLocationContext";
import { getShopUrl } from "../utils/storeUtils";

export const OfficeLocationSecondaryNavbar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [triangleLeft, setTriangleLeft] = useState<number>(0);
  const navRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const { storeContext } = useOfficeLocationInfo();

  const { data: brandsResponse } = useGetPublicBrandsQuery();
  const { data: categoriesResponse } = useGetPublicCategoriesQuery();

  const allBrands = brandsResponse?.data && 'brands' in brandsResponse.data 
    ? brandsResponse.data.brands 
    : (Array.isArray(brandsResponse?.data) ? brandsResponse.data : []);

  const allCategories = categoriesResponse?.data && 'categories' in categoriesResponse.data 
    ? categoriesResponse.data.categories 
    : (Array.isArray(categoriesResponse?.data) ? categoriesResponse.data : []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = (label: string) => {
    const button = buttonRefs.current[label];
    if (button) {
      const rect = button.getBoundingClientRect();
      const navRect = navRef.current?.getBoundingClientRect();
      if (navRect) {
        setTriangleLeft(rect.left - navRect.left + rect.width / 2);
      }
    }
    setActiveMenu(label);
  };

  const dynamicBrandsGroups = useMemo(() => {
    if (!allBrands.length) return [];
    const groups: { title: string; items: string[] }[] = [];
    const featured = [...allBrands].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 6).map(b => b.name);
    groups.push({ title: "Featured Brands", items: featured });

    const alphabetGroups = [
      { title: "A-M", range: /[A-M]/i },
      { title: "N-Z", range: /[N-Z]/i },
    ];

    alphabetGroups.forEach(group => {
      const brandsInGroup = allBrands.filter(b => group.range.test(b.name[0])).map(b => b.name).sort();
      if (brandsInGroup.length > 0) groups.push({ title: group.title, items: brandsInGroup.slice(0, 10) });
    });
    return groups;
  }, [allBrands]);

  const navItems = [
    { label: "ALL BRANDS", hasDropdown: true, type: "brands" },
    { label: "PERFUME", hasDropdown: true, type: "category" },
    { label: "SKINCARE", hasDropdown: true, type: "category" },
    { label: "GIFT", hasDropdown: true, type: "category" },
  ];

  const currentItem = navItems.find(item => item.label === activeMenu);

  const getUrl = (type: string, value: string) => {
    const baseUrl = getShopUrl("/products", storeContext.subdomain, storeContext.officeId);
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}${type}=${encodeURIComponent(value)}`;
  };

  return (
    <div className="w-full bg-white border-b border-gray-100 hidden lg:block relative" ref={navRef}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        <nav className="flex items-center gap-10 h-14">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="h-full relative flex items-center"
              onMouseEnter={() => handleMouseEnter(item.label)}
            >
              <button
                ref={(el) => { buttonRefs.current[item.label] = el; }}
                onClick={() => handleMouseEnter(item.label)}
                className={`relative flex items-center gap-2 text-[11px] font-black tracking-[0.15em] transition-colors outline-none ${activeMenu === item.label ? "text-black" : "text-gray-500 hover:text-black"
                  }`}
              >
                {item.label}
                {item.hasDropdown && (
                  <HiChevronDown className={`transition-transform duration-200 text-gray-400 ${activeMenu === item.label ? "rotate-180" : ""}`} size={12} />
                )}
              </button>
            </div>
          ))}
        </nav>
      </div>

      <AnimatePresence>
        {activeMenu && currentItem?.hasDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] z-[100] pb-16 pt-10"
            onMouseLeave={() => setActiveMenu(null)}
          >
            <div className="absolute -top-2 left-0 w-full overflow-hidden h-2">
              <div
                className="absolute top-1 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45"
                style={{ left: `${triangleLeft}px`, marginLeft: '-8px' }}
              />
            </div>
            <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
              <div className={`grid grid-cols-4 gap-12`}>
                {(activeMenu === "ALL BRANDS" ? dynamicBrandsGroups : [
                  { 
                    title: activeMenu, 
                    items: allCategories.filter(c => c.name.toUpperCase().includes(activeMenu)).map(c => c.name) 
                  }
                ]).map((group) => (
                  <div key={group.title} className="flex flex-col gap-8">
                    <h3 className="text-[14px] font-black text-black uppercase tracking-widest">
                      {group.title}
                    </h3>
                    <ul className="flex flex-col gap-4">
                      {group.items.length > 0 ? group.items.map((link: string) => (
                        <li key={link}>
                          <Link
                            href={getUrl(activeMenu === "ALL BRANDS" ? "brand" : "category", link)}
                            className="text-[15px] text-gray-500 hover:text-brand-gold transition-colors block font-medium tracking-tight"
                          >
                            {link}
                          </Link>
                        </li>
                      )) : (
                        <li className="text-[13px] text-gray-400 italic">No specific subcategories</li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
