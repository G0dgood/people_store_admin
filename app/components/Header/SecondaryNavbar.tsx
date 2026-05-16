import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { HiChevronDown } from "react-icons/hi2";
import { useGetPublicBrandsQuery, useGetPublicCategoriesQuery } from "@/lib/redux/services/boutiqueApi";

export const SecondaryNavbar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [triangleLeft, setTriangleLeft] = useState<number>(0);
  const [itemOffset, setItemOffset] = useState<number>(0);
  const pathname = usePathname();
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

  const dynamicSkincareGroups = useMemo(() => {
    return [
      {
        title: "ALL SKINCARE",
        items: [
          "All Skincare",
          "Clarins",
          "Clinique",
          "Elizabeth Arden",
          "Estee Lauder",
          "Fenty Skin",
          "Lancome",
          "Loccitane",
          "M·A·C"
        ]
      },
      {
        title: "Face",
        items: [
          "Cleansers & Toners",
          "Moisturizers",
          "Treatments & Masks",
          "Sun Care",
          "Make-Up Remover",
          "Exfoliators"
        ]
      },
      {
        title: "Body",
        items: [
          "Body Wash",
          "Body Moisturizer",
          "Body Exfoliator",
          "Body Oil",
          "Specific Care"
        ]
      },
      {
        title: "Men",
        items: [
          "Cleansers & Exfoliators",
          "Moisturizer",
          "Shaving Accessories"
        ]
      },
      {
        title: "Shop by Concern",
        items: [
          "Acne/Blemish",
          "Anti-Aging",
          "Dark Spots/Pigmentation",
          "Dryness",
          "Fine Lines/Wrinkles",
          "Pores",
          "Redness",
          "Dullness/Uneven Texture"
        ]
      }
    ];
  }, []);

  const perfumeGroups = [
    {
      title: "SHOP BY GENDER",
      items: ["Women's Perfume", "Men's Perfume", "Unisex"]
    },
    {
      title: "SHOP BY SCENT FAMILY",
      items: ["Floral", "Woody", "Oriental", "Fresh", "Citrus", "Spicy"]
    },
    {
      title: "COLLECTIONS",
      items: ["Best Sellers", "New Arrivals", "Niche Perfumes", "Designer Classics"]
    },
    {
      title: "GIFTING",
      items: ["Perfume Gift Sets", "Travel Size", "Discovery Sets"]
    }
  ];

  const giftGroups = [
    {
      title: "SHOP BY RECIPIENT",
      items: ["For Her", "For Him", "For Them", "For Kids"]
    },
    {
      title: "SHOP BY OCCASION",
      items: ["Birthday", "Anniversary", "Wedding", "Corporate", "Thank You"]
    },
    {
      title: "GIFT TYPE",
      items: ["Gift Boxes", "Gift Cards", "Luxury Sets", "Personalized Gifts"]
    },
    {
      title: "PRICE RANGE",
      items: ["Under ₦20,000", "₦20,000 - ₦50,000", "₦50,000 - ₦100,000", "Above ₦100,000"]
    }
  ];

  const navItems = [
    { label: "ALL BRANDS", hasDropdown: true, type: "brands" },
    { label: "PERFUME", hasDropdown: true, type: "category" },
    { label: "SKINCARE", hasDropdown: true, type: "category" },
    { label: "GIFT", hasDropdown: true, type: "category" },
  ];

  const currentItem = navItems.find(item => item.label === activeMenu);

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
                    window.location.href = "/brands";
                  }
                }}
              >
                <Link
                  href={item.label === "ALL BRANDS" ? "/brands" : "#"}
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
                      <div className={`grid ${activeMenu === "ALL BRANDS" ? "grid-cols-8" : activeMenu === "SKINCARE" ? "grid-cols-5" : "grid-cols-4"} gap-12`}>
                        {(
                          activeMenu === "ALL BRANDS" ? dynamicBrandsGroups :
                            activeMenu === "SKINCARE" ? dynamicSkincareGroups :
                              activeMenu === "PERFUME" ? perfumeGroups :
                                giftGroups
                        ).map((group) => (
                          <div key={group.title} className="flex flex-col gap-8">
                            <h3 className="text-[14px] font-black text-black uppercase tracking-widest">
                              {group.title}
                            </h3>
                            <ul className="flex flex-col gap-4">
                              {group.items.map((link: string) => (
                                <li key={link}>
                                  <Link
                                    href={`/products?${activeMenu === "ALL BRANDS" ? "brand" : "category"}=${encodeURIComponent(link)}`}
                                    className="text-[15px] text-gray-500 hover:text-brand-gold transition-colors block font-medium tracking-tight"
                                  >
                                    {link}
                                  </Link>
                                </li>
                              ))}
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
