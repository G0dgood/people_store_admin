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

  const activeCategory = useMemo(() => {
    if (!activeMenu || activeMenu === "ALL BRANDS") return null;
    return allCategories.find((cat: any) => cat.name.toUpperCase() === activeMenu);
  }, [activeMenu, allCategories]);

  const activeCategoryGroups = useMemo(() => {
    if (!activeCategory) return [];
    const groups: { title: string; items: string[]; type: "subcategory" | "attribute" | "all" }[] = [];

    // 1. Subcategories Group
    const subs = activeCategory.subCategories || [];
    const uniqueSubs = Array.from(new Set(
      (Array.isArray(subs) ? subs.map((s: any) => typeof s === 'string' ? s : s.name) : [])
      .filter(Boolean)
    ));

    groups.push({
      title: `ALL ${activeCategory.name.toUpperCase()}`,
      items: [
        `All ${activeCategory.name}`,
        ...uniqueSubs
      ],
      type: "subcategory"
    });

    // 2. Custom Attributes Group
    if (activeCategory.customAttributes && Array.isArray(activeCategory.customAttributes)) {
      activeCategory.customAttributes.forEach((attr: any) => {
        if (attr.name && attr.subAttributes && attr.subAttributes.length > 0) {
          groups.push({
            title: attr.name.toUpperCase(),
            items: attr.subAttributes,
            type: "attribute"
          });
        }
      });
    }

    return groups;
  }, [activeCategory]);

  const navItems = useMemo(() => {
    const items = [
      { label: "ALL BRANDS", hasDropdown: true, type: "brands" }
    ];

    allCategories.forEach((cat: any) => {
      const hasDropdown = 
        (cat.subCategories && cat.subCategories.length > 0) || 
        (cat.customAttributes && cat.customAttributes.length > 0);

      items.push({
        label: cat.name.toUpperCase(),
        hasDropdown: !!hasDropdown,
        type: "category"
      });
    });

    return items;
  }, [allCategories]);

  const currentItem = navItems.find(item => item.label === activeMenu);

  const getUrl = (params: { brand?: string; category?: string; subCategory?: string; search?: string }) => {
    const baseUrl = getShopUrl("/products", storeContext.subdomain, storeContext.officeId);
    const hasOrigin = baseUrl.startsWith("http://") || baseUrl.startsWith("https://");
    const urlObj = new URL(baseUrl, hasOrigin ? undefined : window.location.origin);
    Object.entries(params).forEach(([key, val]) => {
      if (val) urlObj.searchParams.set(key, val);
    });
    return hasOrigin ? urlObj.toString() : `${urlObj.pathname}${urlObj.search}`;
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
              <div 
                className="grid gap-12"
                style={{
                  gridTemplateColumns: `repeat(${activeMenu === "ALL BRANDS" ? 3 : activeCategoryGroups.length || 1}, minmax(0, 1fr))`
                }}
              >
                {(activeMenu === "ALL BRANDS" ? dynamicBrandsGroups : activeCategoryGroups).map((group) => (
                  <div key={group.title} className="flex flex-col gap-8">
                    <h3 className="text-[14px] font-black text-black uppercase tracking-widest">
                      {group.title}
                    </h3>
                    <ul className="flex flex-col gap-4">
                      {group.items.length > 0 ? group.items.map((link: string) => {
                        let href = "#";
                        if (activeMenu === "ALL BRANDS") {
                          href = getUrl({ brand: link });
                        } else if (activeCategory) {
                          if ('type' in group && group.type === "subcategory") {
                            if (link === `All ${activeCategory.name}`) {
                              href = getUrl({ category: activeCategory.name });
                            } else {
                              href = getUrl({ category: activeCategory.name, subCategory: link });
                            }
                          } else {
                            href = getUrl({ category: activeCategory.name, search: link });
                          }
                        }
                        return (
                          <li key={link}>
                            <Link
                              href={href}
                              className="text-[15px] text-gray-500 hover:text-brand-gold transition-colors block font-medium tracking-tight"
                            >
                              {link}
                            </Link>
                          </li>
                        );
                      }) : (
                        <li className="text-[13px] text-gray-400 italic">No items found</li>
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
