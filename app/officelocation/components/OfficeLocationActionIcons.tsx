"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Icon } from "@/app/components/Icon";
import Image from "next/image";
import { useOfficeLocationInfo } from "@/app/context/OfficeLocationContext";
import { useCart } from "@/app/officelocation/context/CartContext";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectCurrentUser } from "@/lib/redux/features/authSlice";
import { getShopUrl } from "../utils/storeUtils";

export const OfficeLocationActionIcons: React.FC = () => {
  const { storeContext, officelocation, logoutAll } = useOfficeLocationInfo();
  const { totalItems } = useCart();
  const staff = useAppSelector(selectCurrentUser);
  const pathname = usePathname();
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const isAuthenticated = !!officelocation || !!staff;
  const userDisplay = officelocation || staff;

  return (
    <div className="flex items-center gap-2 md:gap-8">
      {/* Account Section */}
      <div className="relative group">
        <div className="flex flex-col items-start cursor-pointer transition-all duration-300">
          {!isAuthenticated ? (
            <Link 
              href={getShopUrl("/signin", storeContext.subdomain, storeContext.officeId)}
              className="text-[12px] lowercase text-gray-400 font-medium leading-none mb-1 hover:text-brand-gold"
            >
              Sign In
            </Link>
          ) : (
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-5 h-5 rounded-full overflow-hidden border border-gray-200">
                <Image
                  src={userDisplay?.avatar || "/avatars/avatar=pic1.jpg"}
                  alt="Avatar"
                  width={20}
                  height={20}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[11px] font-bold text-brand-gold truncate max-w-[80px]">
                {userDisplay?.fullName?.split(' ')[0] || "User"}
              </span>
            </div>
          )}

          <div 
            className="flex items-center gap-1"
            onClick={() => setIsAccountOpen(!isAccountOpen)}
          >
            <span className="text-[14px] font-bold text-gray-900 leading-none">
              {isAuthenticated ? "Dashboard" : "Account"}
            </span>
            <Icon name="expand_more" size="sm" className="text-gray-400 group-hover:text-brand-gold transition-colors" />
          </div>
        </div>

        {/* Account Dropdown */}
        <AnimatePresence>
          {isAccountOpen && (
            <div
              className="absolute top-full left-0 pt-4 w-52 z-[100]"
              onMouseLeave={() => setIsAccountOpen(false)}
            >
              <div className="bg-white border border-gray-200 shadow-2xl py-2 flex flex-col" onClick={() => setIsAccountOpen(false)}>
                {isAuthenticated && (
                  <>
                    <Link href={getShopUrl("/profile", storeContext.subdomain, storeContext.officeId)} className="px-5 py-2.5 text-[11px] font-bold tracking-wider text-gray-600 hover:text-brand-gold hover:bg-gray-50/50 transition-all">
                      My Profile
                    </Link>
                    <Link href={getShopUrl("/orders", storeContext.subdomain, storeContext.officeId)} className="px-5 py-2.5 text-[11px] font-bold tracking-wider text-gray-600 hover:text-brand-gold hover:bg-gray-50/50 transition-all border-t border-gray-50">
                      Order History
                    </Link>
                    <button 
                      onClick={() => {
                        logoutAll();
                        setIsAccountOpen(false);
                      }}
                      className="px-5 py-2.5 text-[11px] font-bold tracking-wider text-rose-600 text-left hover:bg-rose-50 transition-all border-t border-gray-50"
                    >
                      Logout
                    </button>
                  </>
                )}
                {!staff && (
                  <Link href="/staff-portal" className="px-5 py-2.5 text-[11px] font-bold tracking-wider text-gray-600 hover:text-brand-gold hover:bg-gray-50/50 transition-all border-t border-gray-50">
                    Staff Portal
                  </Link>
                )}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-10 w-px bg-gray-200 mx-2 hidden md:block" />

      {/* Cart Section */}
      <Link
        href={getShopUrl("/cart", storeContext.subdomain, storeContext.officeId)}
        className="flex items-center gap-3 transition-all text-gray-900 hover:text-brand-gold group"
      >
        <div className="relative">
          <Icon
            name="shopping_cart"
            size="md"
            className="text-gray-900 group-hover:text-brand-gold transition-colors"
          />
          {totalItems > 0 && (
            <span className="absolute -top-2.5 -right-2.5 bg-[#C30000] text-white text-[10px] font-bold min-w-[20px] h-[20px] flex items-center justify-center rounded-full border-2 border-white">
              {totalItems}
            </span>
          )}
        </div>
        <span className="text-[15px] font-bold text-gray-900 group-hover:text-brand-gold transition-colors hidden md:block">Cart</span>
      </Link>
    </div>
  );
};
