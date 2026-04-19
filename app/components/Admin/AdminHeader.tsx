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
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import Modal from "../Modal/Modal";
import { NotificationList } from "./AdminNotificationDropdown";
import { motion } from "framer-motion";

type HeaderProps = {
  onOpenMenu?: () => void;
  className?: string;
  isOpen?: boolean;
  role?: string;
};

export const AdminHeader: React.FC<HeaderProps> = ({ onOpenMenu, className, isOpen, role }) => {
  const { userImage } = useUser();
  const pathname = usePathname();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

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

  // Responsive check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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
    if (pathname.includes("/admin/orders")) return "Order Management";
    if (pathname === "/admin/products") return "Product Inventory";
    if (pathname.includes("/admin/products/media")) return "Media Library";
    if (pathname.includes("/admin/products/new")) return "Add New Product";
    if (pathname.includes("/admin/customers")) return "Customer Directory";
    if (pathname.includes("/admin/users")) return "Staff Management";
    if (pathname.includes("/admin/brands")) return "Brand Management";
    if (pathname.includes("/admin/transactions")) return "Transaction History";
    if (pathname.includes("/admin/refunds")) return "Refund Management";
    if (pathname.includes("/admin/support")) return "Support Tickets";
    if (pathname.includes("/admin/coupons")) return "Marketing Coupons";
    if (pathname.includes("/admin/deals")) return "Deals & Offers";
    if (pathname.includes("/admin/reviews")) return "Product Reviews";
    if (pathname.includes("/admin/profile")) return "Personal Account";
    if (pathname.includes("/admin/roles")) return "Governance & Roles";
    if (pathname.includes("/admin/permissions")) return "Permissions";
    if (pathname.includes("/admin/categories")) return "Category Management";
    if (pathname.includes("/admin/notifications")) return "Notification Center";
    if (pathname.includes("/admin/faq")) return "FAQ Library";
    return "Administrative Panel";
  };

  return (
    <header id="header" className={`  bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-12 sticky top-0 z-30 ${className}`}>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="sm:hidden text-neutral-900 relative flex items-center justify-center w-8 h-8"
          onClick={onOpenMenu}
        >
          <div className={`absolute inset-0 transition-all duration-300 ease-in-out flex items-center justify-center ${isOpen ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'}`}>
            <RxHamburgerMenu size={20} />
          </div>
          <div className={`absolute inset-0 transition-all duration-300 ease-in-out flex items-center justify-center ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-0'}`}>
            <IoMdClose size={20} />
          </div>
        </button>

      </div>
      <div className="flex-shrink-0 mr-4 sm:mr-8 min-w-[140px] sm:min-w-[200px]">
        <motion.h1
          key={pathname}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-[16px] sm:text-[20px] font-black text-[#1D3557] tracking-tight truncate xl:max-w-none"
        >
          {getPageTitle()}
        </motion.h1>
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
            className={`bg-white border-gray-200 placeholder:text-gray-400 text-xs font-medium transition-all
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
                ${isNotificationsOpen ? "bg-brand-blue-light text-brand-blue border border-[#1C1C1C1A]" : "text-gray-400 hover:text-brand-blue"}
              `}
              onClick={toggleNotifications}
            >
              <Icon name="Bell outline" folder="dashboardIcon" size="md" className={isNotificationsOpen ? "text-brand-blue" : "text-[#1D3557]"} />
              <span className="absolute top-2 right-2 w-[7px] h-[7px] bg-red-500 rounded-full border border-white"></span>
            </button>

            {isNotificationsOpen && !isMobile && <AdminNotificationDropdown />}

            {isMobile && (
              <Modal
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                hideHeaderBorder={true}
                className="p-0"
                size="md"
              >
                <NotificationList onAction={() => setIsNotificationsOpen(false)} />
              </Modal>
            )}
          </div>

          {/* Theme Toggle Switch */}
          <div className="flex items-center">
            <button className="w-12 h-7 bg-brand-blue-light rounded-full p-1 flex items-center relative transition-colors cursor-pointer">
              <div className="w-5 h-5 bg-white rounded-full border border-[#1C1C1C1A] flex items-center justify-center transition-all transform">
                <Icon name="Group" folder="dashboardIcon" size="xs" className="text-gray-400 opacity-60" />
              </div>
            </button>
          </div>

          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <div
              className={`w-11 h-11 rounded-full border border-[#1C1C1C1A] overflow-hidden cursor-pointer transition-all flex items-center justify-center bg-brand-blue-light
                ${isProfileOpen ? "border-brand-blue scale-105" : "hover:border-brand-blue/50"}
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
