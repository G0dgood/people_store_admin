"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "./Icon";
import { useMobileMenu } from "@/app/context/MobileMenuContext";

const Header = () => {
  const { toggleMenu } = useMobileMenu();

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-[80]">
      {/* Top Main Header */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between gap-4 md:gap-12">
        {/* Mobile: Hamburger & Logo Group */}
        <div className="flex items-center gap-4 lg:hidden">
           <button 
             onClick={toggleMenu}
             className="text-gray-900 p-1"
           >
              <Icon name="menu" size="md" />
           </button>
           <Link href="/" className="flex-shrink-0">
             <Image
               src="/brand_logo/logo-colored.svg"
               alt="Brand Logo"
               width={120}
               height={36}
               className="h-8 w-auto"
             />
           </Link>
        </div>

        {/* Desktop Logo */}
        <Link href="/" className="flex-shrink-0 hidden lg:block">
          <Image
            src="/brand_logo/logo-colored.svg"
            alt="Brand Logo"
            width={150}
            height={46}
            className="h-10 w-auto"
          />
        </Link>

        {/* Search Bar (Desktop: inline, Mobile: hidden or secondary) */}
        <div className="flex-1 max-w-[660px] h-11 border-2 border-brand-blue rounded-lg overflow-hidden hidden md:flex">
          <div className="flex-1 flex items-center px-3 bg-white border-r border-brand-blue">
            <input
              type="text"
              placeholder="Search"
              className="w-full text-sm outline-none text-gray-700 bg-transparent"
            />
          </div>
          <div className="w-32 flex items-center justify-between px-3 bg-white cursor-pointer border-r border-brand-blue hover:bg-gray-50 transition-colors">
            <span className="text-sm text-gray-700">All category</span>
            <Icon name="expand_more" size="xs" className="text-gray-400" />
          </div>
          <Link href="/products" className="bg-brand-blue px-6 text-white text-sm font-bold hover:bg-brand-blue/90 transition-colors flex items-center justify-center">
            Search
          </Link>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex flex-col items-center cursor-pointer group text-gray-500 hover:text-brand-blue transition-colors">
            <Icon name="profile" size="md" />
            <span className="text-[10px] font-medium mt-1 hidden md:block">Profile</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer group text-gray-500 hover:text-brand-blue transition-colors hidden md:flex">
            <Icon name="message_header" size="md" />
            <span className="text-[10px] font-medium mt-1">Message</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer group text-gray-500 hover:text-brand-blue transition-colors hidden md:flex">
            <Icon name="favorite" size="md" />
            <span className="text-[10px] font-medium mt-1">Orders</span>
          </div>
          <Link href="/cart" className="flex flex-col items-center group text-gray-500 hover:text-brand-blue transition-colors">
            <Icon name="My_cart" size="md" />
            <span className="text-[10px] font-medium mt-1 hidden md:block">My cart</span>
          </Link>
        </div>
      </div>

      {/* Mobile Search Input (Visible only on mobile header row 2) */}
      <div className="md:hidden px-4 pb-4">
         <div className="w-full h-10 bg-gray-100 rounded-lg flex items-center px-3 gap-2 border border-gray-200">
            <Icon name="search" size="sm" className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-transparent text-sm w-full outline-none"
            />
         </div>
      </div>

      {/* Secondary Navbar (Desktop only) */}
      <div className="w-full bg-white border-t border-gray-100 hidden lg:block">
        <div className="max-w-[1440px] mx-auto px-6 h-10 flex items-center justify-between">
          <div className="flex items-center gap-6 h-full">
            <button className="flex items-center gap-2 h-full font-bold text-sm text-gray-900 border-r border-gray-100 pr-6">
              <Icon name="menu" size="sm" />
              All categories
            </button>
            <div className="flex items-center gap-6 text-sm font-medium text-gray-900">
              <Link href="/products" className="hover:text-brand-blue">Hot deals</Link>
              <Link href="#" className="hover:text-brand-blue">Gift boxes</Link>
              <Link href="#" className="hover:text-brand-blue">Projects</Link>
              <Link href="#" className="hover:text-brand-blue">Menu item</Link>
              <div className="flex items-center gap-1 cursor-pointer hover:text-brand-blue">
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

      {/* Mobile Breadcrumb-like nav (Home page specifics etc.) */}
      <div className="w-full overflow-x-auto bg-white border-t border-gray-100 md:hidden flex items-center gap-4 px-4 h-11 scrollbar-none whitespace-nowrap">
         {["All category", "Gadgets", "Cloathing", "Accessory", "Home"].map((item, idx) => (
           <span key={idx} className="bg-gray-100 text-[#0D6EFD] text-sm px-3 py-1.5 rounded flex-shrink-0 font-medium">
             {item}
           </span>
         ))}
      </div>
    </header>
  );
};

export { Header };
