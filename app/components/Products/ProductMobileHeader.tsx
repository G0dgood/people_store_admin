"use client";

import React from "react";
import { Icon } from "../Icon";
import { useRouter } from "next/navigation";

interface ProductMobileHeaderProps {
  title: string;
}

export const ProductMobileHeader: React.FC<ProductMobileHeaderProps> = ({ title }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3 bg-white px-4 py-3 md:hidden">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Icon name="arrow_back" size="md" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <Icon name="shopping_cart" size="md" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <Icon name="person" size="md" />
          </button>
        </div>
      </div>

      {/* Search row */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Icon name="search" size="sm" className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search"
          className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 text-sm outline-none focus:border-brand-blue focus:bg-white transition-all"
        />
      </div>
    </div>
  );
};
