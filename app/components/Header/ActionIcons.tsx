import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Icon } from "../Icon";

import { useAuthModal } from "@/app/context/AuthModalContext";
import { useCart } from "@/app/context/CartContext";

export const ActionIcons: React.FC = () => {
  const { openLogin, openRegister } = useAuthModal();
  const { cartItems } = useCart();
  const pathname = usePathname();
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const cartCount = cartItems.length;

  return (
    <div className="flex items-center gap-2 md:gap-8">
      {/* Account Section */}
      <div className="relative group">
        <div

          className="flex flex-col items-start cursor-pointer transition-all duration-300"
        >
          <div>
            <span className="text-[12px] lowercase text-gray-400 font-medium leading-none mb-1"
              onClick={() => openLogin()}>Login </span>
            <span className="text-[12px] lowercase text-gray-400 font-medium leading-none mb-1"
              onClick={() => openRegister()}>/ Signup</span>
          </div>

          <div className="flex items-center gap-1"
            onClick={() => setIsAccountOpen(!isAccountOpen)}>
            <span className="text-[14px] font-bold text-gray-900 leading-none">My account</span>
            <Icon name="expand_more" size="xs" className="text-gray-400 group-hover:text-brand-gold transition-colors" />
          </div>
        </div>

        {/* Account Dropdown */}
        <AnimatePresence>
          {isAccountOpen && (
            <div
              className="absolute top-full left-0 pt-4 w-52 z-[100]"
              onMouseLeave={() => setIsAccountOpen(false)}
            >
              <div
                className="bg-white border border-gray-200 shadow-2xl py-2 flex flex-col"
                onClick={() => setIsAccountOpen(false)}
              >
                <Link href="/profile" className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-600 hover:text-brand-gold hover:bg-gray-50/50 transition-all">
                  My Profile
                </Link>
                <Link href="/wishlist" className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-600 hover:text-brand-gold hover:bg-gray-50/50 transition-all border-t border-gray-50">
                  My Wishlist
                </Link>
                <Link href="/orders" className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-600 hover:text-brand-gold hover:bg-gray-50/50 transition-all border-t border-gray-50">
                  Order History
                </Link>
                <Link href="/admin" className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-600 hover:text-brand-gold hover:bg-gray-50/50 transition-all border-t border-gray-50">
                  Admin Dashboard
                </Link>
                <div className="mx-5 my-1 border-t border-gray-200" />
                <button
                  onClick={openLogin}
                  className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-red-600 hover:bg-red-50/30 transition-all text-left"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Vertical Divider */}
      <div className="h-10 w-px bg-gray-200 mx-2 hidden md:block" />

      {/* Cart Section */}
      <Link
        href="/cart"
        className="flex items-center gap-3 transition-all text-gray-900 hover:text-brand-gold group"
      >
        <div className="relative">
          <Icon
            name="shopping_cart"
            size="md"
            className="text-gray-900 group-hover:text-brand-gold transition-colors"
          />
          {cartCount >= 0 && (
            <span className="absolute -top-2.5 -right-2.5 bg-[#C30000] text-white text-[10px] font-bold min-w-[20px] h-[20px] flex items-center justify-center rounded-full border-2 border-white shadow-sm">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[15px] font-bold text-gray-900 group-hover:text-brand-gold transition-colors hidden md:block">Cart</span>
      </Link>
    </div>
  );
};
