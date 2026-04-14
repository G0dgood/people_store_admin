import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Icon } from "../Icon";
import { MessageDropdown } from "./MessageDropdown";

import { useAuthModal } from "@/app/context/AuthModalContext";
import { useCart } from "@/app/context/CartContext";

export const ActionIcons: React.FC = () => {
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const { openLogin } = useAuthModal();
  const { cartItems } = useCart();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  const cartCount = cartItems.length;

  return (
    <div className="flex items-center gap-4 md:gap-6">
      <div 
        onClick={openLogin}
        className="flex flex-col items-center cursor-pointer group text-gray-500 hover:text-brand-blue transition-colors"
      >
        <Icon name="profile" size="md" />
        <span className="text-[10px] font-medium mt-1 hidden md:block">Profile</span>
      </div>
      <div 
        className="relative flex flex-col items-center cursor-pointer group text-gray-500 hover:text-brand-blue transition-colors hidden md:flex"
        onMouseEnter={() => setIsMessagesOpen(true)}
        onMouseLeave={() => setIsMessagesOpen(false)}
      >
        <Icon name="message_header" size="md" />
        <span className="text-[10px] font-medium mt-1">Message</span>
        <AnimatePresence>
          {isMessagesOpen && <MessageDropdown />}
        </AnimatePresence>
      </div>
      <Link 
        href="/wishlist" 
        className={`flex flex-col items-center group transition-colors hidden md:flex ${
          isActive("/wishlist") ? "text-brand-blue font-bold" : "text-gray-500 hover:text-brand-blue"
        }`}
      >
        <Icon name="favorite" size="md" />
        <span className="text-[10px] font-medium mt-1">Wishlist</span>
      </Link>
      <Link 
        href="/orders" 
        className={`flex flex-col items-center group transition-colors hidden md:flex ${
          isActive("/orders") ? "text-brand-blue font-bold" : "text-gray-500 hover:text-brand-blue"
        }`}
      >
        <Icon name="inventory_2" size="md" />
        <span className="text-[10px] font-medium mt-1">Orders</span>
      </Link>
      <Link 
        href="/cart" 
        className={`relative flex flex-col items-center group transition-colors ${
          isActive("/cart") ? "text-brand-blue font-bold" : "text-gray-500 hover:text-brand-blue"
        }`}
      >
        <div className="relative">
          <Icon name="My_cart" size="md" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#EB001B] text-white text-[10px] font-bold min-w-[16px] h-[16px] flex items-center justify-center rounded-full px-1 border-2 border-white">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium mt-1 hidden md:block">My cart</span>
      </Link>
    </div>
  );
};
