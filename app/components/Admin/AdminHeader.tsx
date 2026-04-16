"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Icon } from "../Icon";
import { Input } from "../Form/Inputs";
import { AdminNotificationDropdown } from "./AdminNotificationDropdown";
import { AdminProfileDropdown } from "./AdminProfileDropdown";
import { AdminSearchDropdown } from "./AdminSearchDropdown";
import { useState, useRef, useEffect } from "react";

import { useUser } from "../../context/UserContext";
import { HiUser } from "react-icons/hi2";

export const AdminHeader: React.FC = () => {
  const { userImage } = useUser();
  const pathname = usePathname();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (notificationRef.current && !notificationRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }
      
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsSearchOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleNotifications = () => {
    setIsNotificationsOpen((prev) => !prev);
    setIsProfileOpen(false);
    setIsSearchOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
    setIsNotificationsOpen(false);
    setIsSearchOpen(false);
  };

  const handleSearchFocus = () => {
    setIsSearchOpen(true);
    setIsNotificationsOpen(false);
    setIsProfileOpen(false);
  };

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
    if (pathname.includes("/admin/notifications")) return "Notification Center";
    return "Admin Panel";
  };

  return (
    <header id="header" className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-12 sticky top-0 z-30">
      <div className="flex-shrink-0 mr-8">
        <h1 className="text-[20px] font-black text-[#1D3557] tracking-tight truncate max-w-[200px] xl:max-w-none">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right Actions Area */}
      <div className="flex-1 flex items-center justify-end gap-6 h-full">
        {/* Search Pill */}
        <div className="relative hidden lg:flex w-full max-w-[480px]" ref={searchRef}>
          <Input
            type="text"
            placeholder="Search data, users, or reports"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleSearchFocus}
            containerClassName="w-full"
            className={`bg-white border-gray-100 placeholder:text-gray-400 text-xs font-medium transition-all
              ${isSearchOpen ? "ring-4 ring-blue-50 border-brand-blue/30 shadow-sm" : ""}
            `}
            suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
          />

          {isSearchOpen && <AdminSearchDropdown query={searchQuery} />}
        </div>

        <div className="flex items-center gap-6">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              className={`relative p-2 transition-colors group rounded-lg
                ${isNotificationsOpen ? "bg-brand-blue-light text-brand-blue shadow-sm" : "text-gray-400 hover:text-brand-blue"}
              `}
              onClick={toggleNotifications}
            >
              <Icon name="Bell outline" folder="dashboardIcon" size="md" className={isNotificationsOpen ? "text-brand-blue" : "text-[#1D3557]"} />
              <span className="absolute top-2 right-2 w-[7px] h-[7px] bg-red-500 rounded-full border border-white"></span>
            </button>

            {isNotificationsOpen && <AdminNotificationDropdown />}
          </div>

          {/* Theme Toggle Switch */}
          <div className="flex items-center">
            <button className="w-12 h-7 bg-brand-blue-light rounded-full p-1 flex items-center relative transition-colors cursor-pointer">
              <div className="w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center transition-all transform">
                <Icon name="Group" folder="dashboardIcon" size="xs" className="text-gray-400 opacity-60" />
              </div>
            </button>
          </div>

          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <div 
              className={`w-11 h-11 rounded-full border-2 overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-all flex items-center justify-center bg-brand-blue-light
                ${isProfileOpen ? "border-brand-blue shadow-blue-100 scale-105" : "border-gray-200 hover:border-brand-blue/50"}
              `}
              onClick={toggleProfile}
            >
              {userImage ? (
                <img
                  src={userImage}
                  alt="Admin"
                  className="w-full h-full object-cover"
                />
              ) : (
                <HiUser className="text-brand-blue w-6 h-6" />
              )}
            </div>

            {isProfileOpen && <AdminProfileDropdown />}
          </div>
        </div>
      </div>
    </header>
  );
};
