"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "./Icon";
import { DropdownMenu, DropdownItem, DropdownFooterAction } from "./Dropdown/DropdownMenu";
import { useMobileMenu } from "@/app/context/MobileMenuContext";

const Header = () => {
  const { toggleMenu } = useMobileMenu();
  const router = useRouter();

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
          <div className="relative flex flex-col items-center cursor-pointer group text-gray-500 hover:text-brand-blue transition-colors hidden md:flex">
            <Icon name="message_header" size="md" />
            <span className="text-[10px] font-medium mt-1">Message</span>
            
            {/* Message Dropdown */}
            <div className="absolute top-full right-1/2 translate-x-1/2 pt-4 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-2 duration-200 cursor-default" onClick={e => e.preventDefault()}>
               <DropdownMenu width={320} className="shadow-2xl border-gray-200 p-0">
                  <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                     <span className="font-bold text-gray-900 text-sm">Messages</span>
                     <span className="text-[10px] text-brand-blue bg-brand-blue-light px-2 py-0.5 rounded-full font-bold">2 New</span>
                  </div>
                  
                  <div className="flex flex-col max-h-[320px] overflow-y-auto">
                     {/* Notification 1 (Unread) */}
                     <div className="px-4 py-3 hover:bg-gray-50 flex gap-3 cursor-pointer transition-colors border-b border-gray-50 last:border-0 relative">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-100 bg-white">
                           <Image src="/avatars/avatar=pic1.jpg" alt="Avatar" width={40} height={40} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col min-w-0 pr-4">
                           <div className="flex justify-between items-start gap-2">
                              <span className="text-sm font-bold text-gray-900 truncate">Alex (Supplier)</span>
                              <span className="text-[10px] text-gray-400 whitespace-nowrap">2m ago</span>
                           </div>
                           <p className="text-xs text-brand-blue font-medium truncate mt-0.5">Can you confirm all dimensions...</p>
                        </div>
                        <div className="w-2 h-2 bg-brand-blue rounded-full absolute top-5 right-4 shadow-sm"></div>
                     </div>

                     {/* Notification 2 (Unread) */}
                     <div className="px-4 py-3 hover:bg-gray-50 flex gap-3 cursor-pointer transition-colors border-b border-gray-50 last:border-0 relative">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-100 bg-white">
                           <Image src="/avatars/avatar=pic2.png" alt="Avatar" width={40} height={40} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col min-w-0 pr-4">
                           <div className="flex justify-between items-start gap-2">
                              <span className="text-sm font-bold text-gray-900 truncate">TechStore Inc.</span>
                              <span className="text-[10px] text-gray-400 whitespace-nowrap">1h ago</span>
                           </div>
                           <p className="text-xs text-brand-blue font-medium truncate mt-0.5">Your tracking number is #9034...</p>
                        </div>
                        <div className="w-2 h-2 bg-brand-blue rounded-full absolute top-5 right-4 shadow-sm"></div>
                     </div>

                     {/* Notification 3 (Read) */}
                     <div className="px-4 py-3 hover:bg-gray-50 flex gap-3 cursor-pointer transition-colors border-b border-gray-50 last:border-0 opacity-75">
                        <div className="w-10 h-10 rounded-full bg-brand-blue-light flex items-center justify-center flex-shrink-0 text-brand-blue shadow-inner">
                           <Icon name="message_header" size="sm" />
                        </div>
                        <div className="flex-1 flex flex-col min-w-0">
                           <div className="flex justify-between items-start gap-2">
                              <span className="text-sm font-bold text-gray-900 truncate">System</span>
                              <span className="text-[10px] text-gray-400 whitespace-nowrap">Yesterday</span>
                           </div>
                           <p className="text-xs text-gray-500 font-medium truncate mt-0.5">Welcome to the marketplace!</p>
                        </div>
                     </div>
                  </div>
                  
                  <DropdownFooterAction label="View all messages" onClick={() => router.push('/messages')} icon="arrow_forward" />
               </DropdownMenu>
            </div>
          </div>
          <Link href="/orders" className="flex flex-col items-center group text-gray-500 hover:text-brand-blue transition-colors hidden md:flex">
            <Icon name="favorite" size="md" />
            <span className="text-[10px] font-medium mt-1">Orders</span>
          </Link>
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
