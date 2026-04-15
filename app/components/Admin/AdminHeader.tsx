"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Icon } from "../Icon";
import { Input } from "../Form/Inputs";

export const AdminHeader: React.FC = () => {
  const pathname = usePathname();

  // Dynamic title based on pathname
  const getPageTitle = () => {
    if (pathname === "/admin") return "Dashboard Overview";
    if (pathname.includes("/admin/orders")) return "Order List";
    if (pathname === "/admin/products") return "Product List";
    if (pathname.includes("/admin/products/media")) return "Product Media";
    if (pathname.includes("/admin/products/new")) return "Add New Product";
    if (pathname.includes("/admin/customers")) return "Customer List";
    if (pathname.includes("/admin/brands")) return "Brand List";
    if (pathname.includes("/admin/transactions")) return "Transactions";
    if (pathname.includes("/admin/coupons")) return "Coupon Code";
    if (pathname.includes("/admin/reviews")) return "Product Reviews";
    if (pathname.includes("/admin/permissions")) return "Permissions";
    if (pathname.includes("/admin/categories")) return "Categories";
    return "Admin Panel";
  };

  return (
    <header id="header" className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-12 sticky top-0 z-30">
      <div className="flex-1">
        <h1 className="text-[20px] font-black text-[#1D3557] tracking-tight">{getPageTitle()}</h1>
      </div>

      {/* Right Actions Area */}
      <div className="flex items-center gap-8">
        {/* Search Pill */}
        <Input
          type="text"
          placeholder="Search data, users, or reports"
          containerClassName="hidden md:flex w-[380px]"
          className="bg-white border-gray-100 placeholder:text-gray-400 text-xs font-medium"
          suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
        />

        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-brand-blue transition-colors group">
            <Icon name="Bell outline" folder="dashboardIcon" size="md" className="text-[#1D3557]" />
            <span className="absolute top-2 right-2 w-[7px] h-[7px] bg-red-500 rounded-full border border-white"></span>
          </button>

          {/* Theme Toggle Switch */}
          <div className="flex items-center">
            <button className="w-12 h-7 bg-brand-blue-light rounded-full p-1 flex items-center relative transition-colors cursor-pointer">
              <div className="w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center transition-all transform">
                <Icon name="Group" folder="dashboardIcon" size="xs" className="text-gray-400 opacity-60" />
              </div>
            </button>
          </div>

          {/* User Profile */}
          <div className="w-11 h-11 rounded-full border border-gray-200 overflow-hidden shadow-sm cursor-pointer hover:border-brand-blue/50 transition-all">
            <img
              src="/dashboardImage/Picture.png"
              alt="Admin"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop";
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
