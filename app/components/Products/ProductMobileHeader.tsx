"use client";

import React, { useState } from "react";
import { Icon } from "../Icon";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { useMobileMenu } from "../../context/MobileMenuContext";
import Link from "next/link";

interface ProductMobileHeaderProps {
  title: string;
}

export const ProductMobileHeader: React.FC<ProductMobileHeaderProps> = ({ title }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems } = useCart();
  const { isAuthenticated, customer } = useCustomerAuth();
  const { setIsCartOpen } = useMobileMenu();
  
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex flex-col gap-3 bg-white px-4 py-3 md:hidden sticky top-0 z-[80] shadow-sm">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-1 hover:bg-gray-100 transition-colors"
          >
            <Icon name="arrow_back" size="md" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 truncate max-w-[150px]">
            {title || "Products"}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="p-1 hover:bg-gray-100 transition-colors relative"
          >
            <Icon name="shopping_cart" size="md" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-gold text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <Link 
            href={isAuthenticated ? "/profile" : "/login"}
            className="p-1 hover:bg-gray-100 transition-colors"
          >
            {isAuthenticated && customer?.avatar ? (
              <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200">
                <img src={customer.avatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
            ) : (
              <Icon name="person" size="md" />
            )}
          </Link>
        </div>
      </div>

      {/* Search row */}
      <form onSubmit={handleSearch} className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Icon name="search" size="sm" className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search artisanal pieces..."
          className="w-full h-10 bg-gray-50 border border-gray-100 rounded-lg pl-10 pr-4 text-sm outline-none focus:border-brand-gold focus:bg-white transition-all"
        />
      </form>
    </div>
  );
};
