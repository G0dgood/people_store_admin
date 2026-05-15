"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineShoppingBag, HiOutlineUser, HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { useCart } from "@/app/officelocation/context/CartContext";
import { useOfficeLocationInfo } from "@/app/context/OfficeLocationContext";

interface CustomerHeaderProps {
  businessName?: string;
  businessDescription?: string;
  logoUrl?: string;
  showSearch?: boolean;
}

export const CustomerHeader = ({
  businessName,
  businessDescription,
  logoUrl,
  showSearch = false
}: CustomerHeaderProps) => {
  const { totalItems } = useCart();
  const { storeContext } = useOfficeLocationInfo();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="flex h-20 items-center justify-between gap-8">
          {/* Logo & Info */}
          <div className="flex items-center gap-4">
            <Link href={`/officelocation?subdomain=${storeContext?.subdomain}`} className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={businessName || "Logo"}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-[#156BB6]">{businessName?.[0] || "B"}</span>
              )}
            </Link>
            <div className="hidden flex-col md:flex">
              <h1 className="text-lg font-bold tracking-tight text-gray-900">{businessName || "Bloom & Mist"}</h1>
              {businessDescription && (
                <p className="text-xs text-gray-500 font-medium">{businessDescription}</p>
              )}
            </div>
          </div>

          {/* Search Placeholder if needed */}
          {showSearch && (
            <div className="hidden max-w-md flex-1 md:block">
              <div className="relative">
                <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="h-10 w-full rounded-full bg-gray-50 pl-10 pr-4 text-sm outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#156BB6]/20"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-6">
            <Link 
              href={`/officelocation/profile?subdomain=${storeContext?.subdomain}`}
              className="group flex flex-col items-center gap-1 text-gray-600 transition-colors hover:text-[#156BB6]"
            >
              <HiOutlineUser className="h-6 w-6" />
              <span className="hidden text-[10px] font-bold uppercase tracking-widest md:block">Profile</span>
            </Link>
            
            <Link 
              href={`/officelocation/cart?subdomain=${storeContext?.subdomain}`}
              className="group relative flex flex-col items-center gap-1 text-gray-600 transition-colors hover:text-[#156BB6]"
            >
              <div className="relative">
                <HiOutlineShoppingBag className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#156BB6] text-[10px] font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden text-[10px] font-bold uppercase tracking-widest md:block">Cart</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
