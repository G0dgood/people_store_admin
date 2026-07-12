"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "../Icon";
import { Input } from "../Form/Inputs";
import { AdminNotificationDropdown } from "./AdminNotificationDropdown";
import { AdminProfileDropdown } from "./AdminProfileDropdown";
import { AdminSearchDropdown } from "./AdminSearchDropdown";
import { useState, useRef, useEffect } from "react";
import { HiUser, HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import Modal from "../Modal/Modal";
import { NotificationList } from "./AdminNotificationDropdown";
import { motion } from "framer-motion";
import Image from "next/image";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectCurrentUser } from "@/lib/redux/features/authSlice";
import { useAdminTheme } from "@/app/context/AdminThemeContext";
import { useGetUnreadCountQuery } from "@/lib/redux/services/messageApi";
import { LuMessageSquare } from "react-icons/lu";

type HeaderProps = {
  onOpenMenu?: () => void;
  className?: string;
  isOpen?: boolean;
  role?: string;
};

export const AdminHeader: React.FC<HeaderProps> = ({ onOpenMenu, className, isOpen, role }) => {
  const user = useAppSelector(selectCurrentUser);
  const pathname = usePathname();
  const router = useRouter();
  const { isAdminDark, toggleAdminTheme } = useAdminTheme();
  const { data: unreadResponse } = useGetUnreadCountQuery();
  const unreadCount = unreadResponse?.data?.count || 0;
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
    if (pathname === "/dashboard") return "Dashboard Overview";
    if (pathname.includes("/orders")) return "Order Management";
    if (pathname === "/products") return "Product Inventory";
    if (pathname.includes("/products/media")) return "Media Library";
    if (pathname.includes("/products/drafts")) return "Product Drafts";
    if (pathname.includes("/products/new")) return "Add New Product";
    if (pathname.includes("/customers")) return "Customer Directory";
    if (pathname.includes("/users")) return "Staff Management";
    if (pathname.includes("/brands")) return "Brand Management";
    if (pathname.includes("/transactions")) return "Transaction History";
    if (pathname.includes("/refunds")) return "Refund Management";
    if (pathname.includes("/support")) return "Support Tickets";
    if (pathname.includes("/coupons")) return "Marketing Coupons";
    if (pathname.includes("/deals")) return "Deals & Offers";
    if (pathname.includes("/reviews")) return "Product Reviews";
    if (pathname.includes("/profile")) return "Personal Account";
    if (pathname.includes("/roles")) return "Governance & Roles";
    if (pathname.includes("/permissions")) return "Permissions";
    if (pathname.includes("/categories")) return "Category Management";
    if (pathname.includes("/notifications")) return "Notification Center";
    if (pathname.includes("/faq")) return "FAQ Library";
    if (pathname.includes("/offices")) return "Office Locations";
    return "Administrative Panel";
  };

  return (
    <header id="header" className={`bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-12 sticky top-0 z-30 ${className}`}>
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
          className="text-[16px] sm:text-[20px] font-black text-brand-charcoal tracking-tight truncate xl:max-w-none"
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
            shape="rounded-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleSearchFocus}
            containerClassName="w-full"
            className={`bg-white border-gray-200 placeholder:text-gray-400 text-xs font-medium transition-all
              ${isSearchOpen ? "ring-4 ring-gray-100 border-brand-charcoal/30  " : ""}
            `}
            suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
          />

          {isSearchOpen && <AdminSearchDropdown query={searchQuery} />}
        </div>

        <div className="flex items-center gap-6">
          {/* Messages */}
          <div className="relative">
            <button
              className="relative p-2 transition-colors group rounded-lg text-gray-400 hover:text-brand-charcoal cursor-pointer flex items-center justify-center"
              onClick={() => router.push('/customers')}
              title="Messages"
            >
              <LuMessageSquare size={20} className="text-brand-charcoal" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              className={`relative p-2 transition-colors group rounded-lg
                ${isNotificationsOpen ? "bg-brand-gold/10 text-brand-charcoal border border-brand-gold/20" : "text-gray-400 hover:text-brand-charcoal"}
              `}
              onClick={toggleNotifications}
            >
              <Icon name="Bell outline" folder="dashboardIcon" size="md" className={isNotificationsOpen ? "text-brand-charcoal" : "text-brand-charcoal"} />
              <span className="absolute top-2 right-2 w-[7px] h-[7px] bg-brand-gold rounded-full border border-white"></span>
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
            <button
              onClick={toggleAdminTheme}
              className={`w-12 h-7 rounded-full p-1 flex items-center relative transition-colors cursor-pointer ${isAdminDark ? 'bg-brand-charcoal' : 'bg-brand-gold/20'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full border border-[#1C1C1C1A] flex items-center justify-center transition-all transform ${isAdminDark ? 'translate-x-5' : 'translate-x-0'}`}>
                {isAdminDark ? (
                  <HiOutlineMoon className="text-gray-600 w-3 h-3" />
                ) : (
                  <HiOutlineSun className="text-gray-400 w-3 h-3" />
                )}
              </div>
            </button>
          </div>

          {/* User Profile */}
          <div
            className={`w-11 h-11 rounded-full border border-[#1C1C1C1A] overflow-hidden cursor-pointer transition-all flex items-center justify-center bg-brand-gold/10
                ${isProfileOpen ? "border-brand-gold scale-105" : "hover:border-brand-gold/50"}
              `}
            onClick={toggleProfile}
          >
            {user?.avatar ? (
              <div className="relative w-full h-full">
                <Image
                  src={user.avatar}
                  alt="Admin"
                  fill
                  className="object-cover"
                  priority
                  sizes="44px"
                />
              </div>
            ) : (
              <HiUser className="text-brand-gold w-6 h-6" />
            )}
          </div>
          {isProfileOpen && <AdminProfileDropdown />}
        </div>
      </div>
    </header>
  );
};
