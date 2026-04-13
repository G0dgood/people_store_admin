import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "../Icon";
import { DropdownMenu, DropdownItem } from "../Dropdown/DropdownMenu";

export const SecondaryNavbar: React.FC = () => {
  const [isSecondaryCategoryOpen, setIsSecondaryCategoryOpen] = useState(false);
  const secondaryCategoryRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (secondaryCategoryRef.current && !secondaryCategoryRef.current.contains(event.target as Node)) {
        setIsSecondaryCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { label: "Hot deals", href: "/products" },
    { label: "Gift boxes", href: "/gift-boxes" },
    { label: "Projects", href: "/projects" },
    { label: "Menu item", href: "/menu" },
  ];

  return (
    <div className="w-full bg-white border-t border-gray-100 hidden lg:block">
      <div className="max-w-[1440px] mx-auto px-6 h-10 flex items-center justify-between">
        <div className="flex items-center gap-6 h-full">
          <div className="relative h-full z-40" ref={secondaryCategoryRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsSecondaryCategoryOpen(prev => !prev);
              }}
              className="flex items-center gap-2 h-full font-bold text-sm text-gray-900 border-r border-gray-100 pr-6 hover:text-brand-blue transition-colors outline-none focus:outline-none"
              aria-expanded={isSecondaryCategoryOpen}
            >
              <Icon name="menu" size="sm" />
              All categories
            </button>

            <AnimatePresence>
              {isSecondaryCategoryOpen && (
                <div className="absolute top-full left-0 pt-2 w-56 z-[100]" onClick={() => setIsSecondaryCategoryOpen(false)}>
                  <DropdownMenu width="100%" className="shadow-lg">
                    <DropdownItem label="Smartphones & Tablets" />
                    <DropdownItem label="Computers & Laptops" />
                    <DropdownItem label="Home Appliances" />
                    <DropdownItem label="Furniture" />
                    <DropdownItem label="Men's Fashion" />
                    <DropdownItem label="Women's Fashion" />
                  </DropdownMenu>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link 
                key={link.label}
                href={link.href} 
                className={`transition-colors ${
                  isActive(link.href) ? "text-brand-blue font-bold" : "text-gray-900 hover:text-brand-blue"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-1 cursor-pointer text-gray-900 hover:text-brand-blue transition-colors">
              Help
              <Icon name="expand_more" size="xs" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm font-bold text-gray-900">
          <div className="flex items-center gap-2 cursor-pointer">
            <span>English, USD</span>
            <Icon name="expand_more" size="xs" />
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <span>Ship to</span>
            <div className="w-5 h-4 bg-gray-200 rounded-sm overflow-hidden border border-gray-300">
              <Image src="/country/Property 1=AE.png" alt="Country" width={20} height={16} className="w-full h-full object-cover" />
            </div>
            <Icon name="expand_more" size="xs" />
          </div>
        </div>
      </div>
    </div>
  );
};
