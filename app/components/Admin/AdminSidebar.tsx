"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "../Icon";
import { ConfirmationModal } from "./ConfirmationModal";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown, HiOutlineQuestionMarkCircle, HiShieldCheck, HiXMark, HiBars3BottomLeft } from "react-icons/hi2";
import { RiPercentLine } from "react-icons/ri";
import { useLogoutMutation } from "@/lib/redux/services/authApi";
import { logOut, selectCurrentUser } from "@/lib/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface NavGroup {
  title: string;
  items: {
    name: string;
    href: string;
    icon: string | React.ReactNode;
  }[];
}

interface SidenavProps {
  activeItem?: string;
  isOpen?: boolean;
  onClose?: () => void;
  role?: string;
}

const navGroups: NavGroup[] = [
  {
    title: "",
    items: [
      { name: "Dashboard", href: "/admin", icon: "Frame" },
      { name: "Order Management", href: "/admin/orders", icon: "Cart" },
    ],
  },
  {
    title: "Product",
    items: [
      { name: "Add Products", href: "/admin/products/new", icon: "circle-plus" },
      { name: "Product Media", href: "/admin/products/media", icon: "material-symbols_image-outline" },
      { name: "Product List", href: "/admin/products", icon: "fluent-mdl2_product-list" },
      { name: "Product Reviews", href: "/admin/reviews", icon: "material-symbols_reviews-outline" },
    ],
  },
  {
    title: "Operations",
    items: [
      { name: "Customers", href: "/admin/customers", icon: "users" },
      { name: "Coupon Code", href: "/admin/coupons", icon: "ticket" },
      { name: "Categories", href: "/admin/categories", icon: "circle-square" },
      { name: "Transaction", href: "/admin/transactions", icon: "famicons_card-outline" },
      { name: "Refund", href: "/admin/refunds", icon: "arrow-refresh-06" },
      { name: "Support", href: "/admin/support", icon: "tabler_message" },
      { name: "FAQ Management", href: "/admin/faq", icon: <HiOutlineQuestionMarkCircle size={14} /> },
      { name: "Brand", href: "/admin/brands", icon: "star" },
      { name: "Deals and Offers", href: "/admin/deals", icon: <RiPercentLine size={14} /> },
      { name: "Advert Manager", href: "/admin/advert", icon: "Frame" },
      { name: "Notifications", href: "/admin/notifications", icon: "Bell outline" },
    ],
  },
  {
    title: "Admin",
    items: [
      { name: "Users", href: "/admin/users", icon: "users" },
      { name: "View Profile", href: "/admin/profile", icon: "user-profile-circle" },
      { name: "Administrative Roles", href: "/admin/roles", icon: "settings" },
      { name: "Permissions", href: "/admin/permissions", icon: <HiShieldCheck size={14} /> },
    ],
  },
];


interface NavItemProps {
  item: {
    name: string;
    href: string;
    icon: string | React.ReactNode;
  };
  isCollapsed: boolean;
  pathname: string;
  onHover: (name: string | null, rect: DOMRect | null) => void;
}

const NavItem: React.FC<NavItemProps> = ({ item, isCollapsed, pathname, onHover }) => {
  // Exact match or sub-path match (e.g., /admin/orders/1 matches /admin/orders)
  const isMatch = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href + "/"));

  // Ensure we don't highlight a base path if a more specific sibling path is also a match
  const isMoreSpecificMatch = navGroups.flatMap(g => g.items).some(other =>
    other.href !== item.href &&
    other.href.startsWith(item.href + "/") &&
    (pathname === other.href || pathname.startsWith(other.href + "/"))
  );

  const isActive = isMatch && !isMoreSpecificMatch;

  return (
    <div className="relative flex items-center">
      <Link
        href={item.href}
        onMouseEnter={(e) => {
          if (isCollapsed) {
            onHover(item.name, e.currentTarget.getBoundingClientRect());
          }
        }}
        onMouseLeave={() => onHover(null, null)}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-[6px] transition-all text-sm font-medium w-full ${isCollapsed ? "justify-center px-2" : ""} ${isActive
          ? "bg-brand-charcoal text-white shadow-md shadow-brand-charcoal/20"
          : "text-gray-500 hover:bg-brand-gold-light hover:text-white"
          }`}
      >
        {typeof item.icon === "string" ? (
          <Icon name={item.icon} folder="dashboardIcon" size="sm" />
        ) : (
          item.icon
        )}
        {!isCollapsed && <span>{item.name}</span>}
      </Link>
    </div>
  );
};

const PortalTooltip = ({ label, rect }: { label: string; rect: DOMRect }) => {
  return createPortal(
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{
        top: rect.top + rect.height / 2,
        left: rect.right + 10,
        transform: 'translateY(-50%)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        className="bg-black text-white text-[10px] font-bold px-3 py-2 rounded-[4px] shadow-xl whitespace-nowrap relative flex items-center"
      >
        {/* Arrow */}
        <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-black rotate-45" />
        <span className="relative z-10 uppercase tracking-widest">{label}</span>
      </motion.div>
    </div>,
    document.body
  );
};

export const AdminSidebar: React.FC<SidenavProps> = ({ activeItem = "dashboard", isOpen, onClose, role: propRole }: SidenavProps) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
  const [hoveredItem, setHoveredItem] = useState<{ name: string; rect: DOMRect } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize expanded groups - default to expanded for groups containing the active path
  const [expandedGroups, setExpandedGroups] = React.useState<string[]>(() => {
    return navGroups
      .filter(group => group.items.some(item => pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href + "/"))))
      .map(group => group.title);
  });

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      dispatch(logOut());
      toast.success("Session Terminated", {
        description: "You have been successfully logged out."
      });
      router.push("/login");
    } catch (err) {
      // Even if the backend call fails (e.g. timeout), we should still clear local state
      dispatch(logOut());
      router.push("/login");
    }
  };

  const displayRole = user?.role?.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Store Management";

  return (
    <aside id="sidenav"
      className={`${isCollapsed ? "w-20" : "w-64"} h-full shrink-0 flex-col justify-between bg-white transition-transform duration-300 ease-in-out sm:flex sm:translate-x-0 border-r border-gray-100 ${isOpen ? "fixed inset-y-0 left-0 z-50 flex translate-x-0" : "hidden -translate-x-full sm:flex"
        }`}
    >
      {/* Brand */}
      <div className={`p-6 flex items-center ${isCollapsed ? "justify-center px-4" : "justify-between"}`}>
        <div className="flex items-center gap-1">
          <div className="h-8 overflow-hidden">
            <img src="/brand_logo/logo-symbol.svg" alt="Bloom & Mist" className="h-full object-contain" />
          </div>
          {!isCollapsed && (
            <span className="font-outfit font-light text-xl tracking-[0.1em] text-brand-gold uppercase whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-500">
              Bloom <span className="font-bold">Mist</span>
            </span>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <Icon name="menu-close" folder="dashboardIcon" size="md" />
          </button>
        )}
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="text-gray-400 hover:text-brand-gold transition-colors p-1 cursor-pointer"
          >
            <HiXMark size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-6 custom-scrollbar pb-8">
        {navGroups.map((group) => {
          const isExpanded = expandedGroups.includes(group.title) || !group.title;

          return (
            <div key={group.title} className="flex flex-col gap-1">
              {!isCollapsed && group.title && (
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="px-4 py-2 flex items-center justify-between group/title w-full"
                >
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover/title:text-brand-charcoal transition-colors">
                    {group.title}
                  </h4>
                  <HiChevronDown
                    size={14}
                    className={`text-gray-300 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""} group-hover/title:text-brand-charcoal`}
                  />
                </button>
              )}

              <AnimatePresence initial={false}>
                {(isExpanded || isCollapsed || !group.title) && (
                  <motion.div
                    initial={!group.title ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden flex flex-col gap-1"
                  >
                    {group.items.map((item) => (
                      <NavItem
                        key={item.href}
                        item={item}
                        isCollapsed={isCollapsed}
                        pathname={pathname}
                        onHover={(name, rect) => setHoveredItem(name && rect ? { name, rect } : null)}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Footer Profile & Shop */}
      <div className="p-4 flex flex-col gap-4 border-t border-gray-50">
        <div className={`flex items-center ${isCollapsed ? "justify-center px-0" : "justify-between px-2"}`}>
          <div
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center gap-3 min-w-0 group cursor-pointer relative"
            onMouseEnter={(e) => {
              if (isCollapsed) {
                setHoveredItem({ name: "Logout / Profile", rect: e.currentTarget.getBoundingClientRect() });
              }
            }}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden shadow-sm flex-shrink-0 group-hover:border-brand-gold-light group-hover:shadow-md transition-all">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || "A")}&background=C5A028&color=fff`}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-gray-900 truncate group-hover:text-brand-charcoal transition-colors">
                  {user?.fullName || "Bloom & Mist"}
                </span>
                <span className="text-[10px] font-medium text-gray-400 truncate">
                  {displayRole}
                </span>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              className="text-gray-400 hover:text-red-500 transition-colors"
              onClick={() => setIsLogoutModalOpen(true)}
            >
              <Icon name="ic_round-logout" folder="dashboardIcon" size="sm" />
            </button>
          )}
        </div>

        {!isCollapsed ? (
          <Link
            href="/"
            className="flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-md hover:border-brand-gold-light/30 hover:bg-gray-50 hover:shadow-lg hover:shadow-gray-100 transition-all group"
          >
            <div className="flex items-center gap-3 text-gray-600 font-bold group-hover:text-brand-charcoal">
              <Icon name="Cart" folder="dashboardIcon" size="sm" className="text-brand-charcoal" />
              <span className="text-xs">Your Shop</span>
            </div>
            <Icon name="link-external" folder="dashboardIcon" size="xs" className="text-gray-300 group-hover:text-brand-charcoal" />
          </Link>
        ) : (
          <div className="relative flex items-center justify-center">
            <Link
              href="/"
              onMouseEnter={(e) => {
                if (isCollapsed) {
                  setHoveredItem({ name: "Your Shop", rect: e.currentTarget.getBoundingClientRect() });
                }
              }}
              onMouseLeave={() => setHoveredItem(null)}
              className="flex items-center justify-center p-2.5 border border-gray-200 rounded-md hover:border-brand-gold-light/30 hover:shadow-lg hover:shadow-gray-100 transition-all group w-full"
            >
              <Icon name="Cart" folder="dashboardIcon" size="sm" className="text-brand-charcoal" />
            </Link>
          </div>
        )}
      </div>

      {/* Tooltip Portal */}
      {mounted && (
        <AnimatePresence>
          {hoveredItem && <PortalTooltip label={hoveredItem.name} rect={hoveredItem.rect} />}
        </AnimatePresence>
      )}

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Logout Session"
        message="Are you sure you want to end your current session? You will need to sign in again to access the administrative dashboard."
        confirmText="Yes, Logout Now"
        cancelText="Stay Logged In"
        type="danger"
      />
    </aside>
  );
};
