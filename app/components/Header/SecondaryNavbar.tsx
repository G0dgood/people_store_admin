import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { HiChevronDown } from "react-icons/hi2";
import { useGetPublicBrandsQuery, useGetPublicCategoriesQuery } from "@/lib/redux/services/boutiqueApi";

export const SecondaryNavbar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [triangleLeft, setTriangleLeft] = useState<number>(0);
  const [itemOffset, setItemOffset] = useState<number>(0);
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

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
        setItemOffset(-(rect.left - navRect.left));
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
      { title: "A-B", range: /[A-B]/i },
      { title: "C-E", range: /[C-E]/i },
      { title: "E-H", range: /[E-H]/i },
      { title: "I-L", range: /[I-L]/i },
      { title: "L-M", range: /[L-M]/i },
      { title: "M-R", range: /[M-R]/i },
      { title: "R-Z", range: /[R-Z]/i },
    ];

    alphabetGroups.forEach(group => {
      const brandsInGroup = allBrands.filter(b => group.range.test(b.name[0])).map(b => b.name).sort();
      if (brandsInGroup.length > 0) groups.push({ title: group.title, items: brandsInGroup });
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
        if (attr.name && attr.name.toUpperCase() !== "VOLUME" && attr.subAttributes && attr.subAttributes.length > 0) {
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
        (cat.customAttributes && cat.customAttributes.length > 0) ||
        cat.hasGender || cat.hasScentFamily || cat.hasCollection || cat.hasGifting || cat.hasSize || cat.hasML || cat.hasSex;

      items.push({
        label: cat.name.toUpperCase(),
        hasDropdown: !!hasDropdown,
        type: "category"
      });
    });

    return items;
  }, [allCategories]);



  return (
    <div className="w-full bg-white border-b border-gray-100 hidden lg:block relative" ref={navRef}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        <nav className="flex items-center gap-10 h-14">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="h-full relative flex items-center"
              onMouseEnter={() => handleMouseEnter(item.label)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div
                className="flex items-center gap-2"
                onClick={() => {
                  if (item.label === "ALL BRANDS") {
                    router.push("/brands");
                  } else {
                    router.push(`/products?category=${encodeURIComponent(item.label)}`);
                  }
                }}
              >
                <Link
                  href={item.label === "ALL BRANDS" ? "/brands" : `/products?category=${encodeURIComponent(item.label)}`}
                  ref={(el) => { buttonRefs.current[item.label] = el as any; }}
                  className={`relative flex items-center gap-2 text-[11px] font-black tracking-[0.15em] transition-colors outline-none cursor-pointer ${activeMenu === item.label ? "text-black" : "text-gray-500 hover:text-black"
                    }`}
                >
                  {item.label}
                </Link>
                {item.hasDropdown && (
                  <HiChevronDown className={`transition-transform duration-200 text-gray-400 ${activeMenu === item.label ? "rotate-180" : ""}`} size={12} />
                )}
              </div>

              <AnimatePresence>
                {activeMenu === item.label && item.hasDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full bg-white border-b border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] z-[100] pb-16 pt-10"
                    style={{
                      left: `${itemOffset}px`,
                      width: navRef.current?.offsetWidth || '100vw'
                    }}
                  >
                    {/* Triangle Indicator */}
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
                          gridTemplateColumns: `repeat(${activeMenu === "ALL BRANDS" ? 8 : activeCategoryGroups.length || 1}, minmax(0, 1fr))`
                        }}
                      >
                        {(activeMenu === "ALL BRANDS" ? dynamicBrandsGroups : activeCategoryGroups).map((group) => (
                          <div key={group.title} className="flex flex-col gap-8">
                            <h3 className="text-[14px] font-black text-black uppercase tracking-widest">
                              {group.title}
                            </h3>
                            <ul className="flex flex-col gap-4">
                              {group.items.map((link: string) => {
                                let href = "#";
                                if (activeMenu === "ALL BRANDS") {
                                  href = `/products?brand=${encodeURIComponent(link)}`;
                                } else if (activeCategory) {
                                  if ('type' in group && group.type === "subcategory") {
                                    if (link === `All ${activeCategory.name}`) {
                                      href = `/products?category=${encodeURIComponent(activeCategory.name)}`;
                                    } else {
                                      href = `/products?category=${encodeURIComponent(activeCategory.name)}&subCategory=${encodeURIComponent(link)}`;
                                    }
                                  } else {
                                    // It's a product attribute/tag selection
                                    href = `/products?category=${encodeURIComponent(activeCategory.name)}&search=${encodeURIComponent(link)}`;
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
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};
