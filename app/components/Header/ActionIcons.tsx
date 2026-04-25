import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Icon } from "../Icon";

import { useAuthModal } from "@/app/context/AuthModalContext";
import { useCart } from "@/app/context/CartContext";
import { useCustomerAuth } from "@/app/context/CustomerAuthContext";
import Image from "next/image";
import { LogoutConfirmationModal } from "../Modal/LogoutConfirmationModal";

export const ActionIcons: React.FC = () => {
  const { openLogin, openRegister } = useAuthModal();
  const { cartItems } = useCart();
  const { customer, isAuthenticated, logout, isLoggingOut } = useCustomerAuth();
  const pathname = usePathname();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const cartCount = cartItems.length;

  return (
    <div className="flex items-center gap-2 md:gap-8">
      {/* Account Section */}
      <div className="relative group">
        <div

          className="flex flex-col items-start cursor-pointer transition-all duration-300"
        >
          {!isAuthenticated ? (
            <div>
              <span className="text-[12px] lowercase text-gray-400 font-medium leading-none mb-1 hover:text-brand-gold"
                onClick={() => openLogin()}>Login </span>
              <span className="text-[12px] lowercase text-gray-400 font-medium leading-none mb-1 hover:text-brand-gold"
                onClick={() => openRegister()}>/ Signup</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-5 h-5 rounded-full overflow-hidden border border-gray-200">
                <Image 
                  src={customer?.avatar || "/avatars/avatar=pic1.jpg"} 
                  alt="Avatar" 
                  width={20} 
                  height={20} 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[11px] font-bold text-brand-gold truncate max-w-[80px]">
                {customer?.fullName.split(' ')[0]}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1"
            onClick={() => setIsAccountOpen(!isAccountOpen)}>
            <span className="text-[14px] font-bold text-gray-900 leading-none">
              {isAuthenticated ? "Dashboard" : "My account"}
            </span>
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
                {isAuthenticated && (
                  <>
                    <Link href="/profile" className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-600 hover:text-brand-gold hover:bg-gray-50/50 transition-all">
                      My Profile
                    </Link>
                    <Link href="/wishlist" className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-600 hover:text-brand-gold hover:bg-gray-50/50 transition-all border-t border-gray-50">
                      My Wishlist
                    </Link>
                    <Link href="/orders" className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-600 hover:text-brand-gold hover:bg-gray-50/50 transition-all border-t border-gray-50">
                      Order History
                    </Link>
                  </>
                )}
                <Link href="/admin" className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-600 hover:text-brand-gold hover:bg-gray-50/50 transition-all border-t border-gray-50">
                  Admin Dashboard
                </Link>
                {isAuthenticated && (
                  <>
                    <div className="mx-5 my-1 border-t border-gray-200" />
                    <button
                      onClick={() => {
                        setIsAccountOpen(false);
                        setIsLogoutModalOpen(true);
                      }}
                      className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-red-600 hover:bg-red-50/30 transition-all text-left"
                    >
                      Sign Out
                    </button>
                  </>
                )}
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

      <LogoutConfirmationModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        isLoading={isLoggingOut}
        onConfirm={async () => {
          await logout();
          setIsLogoutModalOpen(false);
          // Optional: redirect to home if not already there
        }}
      />
    </div>
  );
};
