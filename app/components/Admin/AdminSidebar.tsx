"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "../Icon";
import { Logo } from "../Logo";
import { ConfirmationModal } from "./ConfirmationModal";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown, HiOutlineQuestionMarkCircle, HiShieldCheck, HiXMark, HiBars3BottomLeft, HiOutlineGift, HiCreditCard } from "react-icons/hi2";
import { RiPercentLine } from "react-icons/ri";
import { useLogoutMutation } from "@/lib/redux/services/authApi";
import { logOut, selectCurrentUser } from "@/lib/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePrivilege, ModuleId } from "@/lib/contexts/PrivilegeContext";
import Image from "next/image";
import { SidebarSkeleton } from "./SidebarSkeleton";

interface NavGroup {
  title: string;
  items: {
    name: string;
    href: string;
    icon: string | React.ReactNode;
    moduleId?: ModuleId;
  }[];
}

interface SidenavProps {
  activeItem?: string;
  isOpen?: boolean;
  onClose?: () => void;
  role?: string;
}

const moduleIconMap: Record<string, string | React.ReactNode> = {
  dashboard: "Frame",
  orders: "Cart",
  products: "fluent-mdl2_product-list",
  media: "material-symbols_image-outline",
  "products/media": "material-symbols_image-outline",
  reviews: "material-symbols_reviews-outline",
  customers: "users",
  marketing: "ticket",
  categories: "circle-square",
  transactions: "famicons_card-outline",
  refunds: "arrow-refresh-06",
  support: "tabler_message",
  faq: <HiOutlineQuestionMarkCircle size={14} />,
  brands: "star",
  deals: <RiPercentLine size={14} />,
  "gift-boxes": <HiOutlineGift size={16} />,
  "gift-cards": <HiCreditCard size={16} />,
  advert: "Frame",
  notifications: "Bell outline",
  users: "users",
  profile: "user-profile-circle",
  roles: "settings",
  permissions: <HiShieldCheck size={14} />,
  offices: "fluent-mdl2_product-list",
  drivers: "users",
  deliveries: "Shipped",
};

// Map module IDs to their primary display names and routes if they differ from the default slug
const moduleMetadata: Record<string, { name?: string; href?: string }> = {
  dashboard: { name: "Dashboard Overview", href: "" },
  media: { name: "Media Library", href: "/products/media" },
  "products/media": { name: "Media Library", href: "/products/media" },
  marketing: { name: "Coupon Code", href: "/coupons" },
  drivers: { name: "Drivers", href: "/logistics/drivers" },
  deliveries: { name: "Deliveries", href: "/logistics/deliveries" },
};


interface NavItemProps {
  item: {
    name: string;
    href: string;
    icon: string | React.ReactNode;
    children?: { name: string; href: string }[];
  };
  isCollapsed: boolean;
  isActive: boolean;
  onHover: (name: string | null, rect: DOMRect | null) => void;
  pathname: string;
}

const NavItem: React.FC<NavItemProps> = ({ item, isCollapsed, isActive, onHover, pathname }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  useEffect(() => {
    if (hasChildren && item.children?.some(child => pathname === child.href)) {
      setIsOpen(true);
    }
  }, [pathname, hasChildren, item.children]);

  const handleToggle = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative flex flex-col gap-1 w-full">
      <Link
        href={item.href}
        onClick={handleToggle}
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
        {!isCollapsed && (
          <div className="flex items-center justify-between flex-1">
            <span>{item.name}</span>
            {hasChildren && (
              <HiChevronDown
                size={16}
                className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              />
            )}
          </div>
        )}
      </Link>

      <AnimatePresence>
        {hasChildren && isOpen && !isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden flex flex-col gap-1 pl-12 pr-2"
          >
            {item.children?.map(child => (
              <Link
                key={child.href}
                href={child.href}
                className={`py-2 px-3 text-[11px] font-bold uppercase tracking-widest rounded-[4px] transition-all ${pathname === child.href ? "text-brand-gold bg-brand-gold/5" : "text-gray-400 hover:text-brand-gold hover:bg-gray-50"}`}
              >
                {child.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
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
  const { canAccess, isLoading, userPrivileges } = usePrivilege();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const user = useAppSelector(selectCurrentUser);

  const dynamicNavData = React.useMemo(() => {
    const isSuperAdmin = user?.role === "SUPER_ADMIN";

    // 1. If we are a SUPER_ADMIN, provide all tabs immediately (Total Bypass)
    if (isSuperAdmin) {
      return {
        coreItems: [
          { name: "Dashboard Overview", href: "/dashboard", icon: moduleIconMap["dashboard"], moduleId: "dashboard" as any },
          { name: "Orders", href: "/orders", icon: moduleIconMap["orders"], moduleId: "orders" as any },
        ],
        navGroups: [
          {
            title: "Inventory",
            items: [
              { name: "Products", href: "/products", icon: moduleIconMap["products"], moduleId: "products" as any },
              { name: "Media Library", href: "/products/media", icon: moduleIconMap["media"], moduleId: "media" as any },
              { name: "Categories", href: "/categories", icon: moduleIconMap["categories"], moduleId: "categories" as any },
              { name: "Brands", href: "/brands", icon: moduleIconMap["brands"], moduleId: "brands" as any },
              { name: "Deals", href: "/deals", icon: moduleIconMap["deals"], moduleId: "deals" as any },
              { name: "Reviews", href: "/reviews", icon: moduleIconMap["reviews"], moduleId: "reviews" as any },
            ]
          },
          {
            title: "Logistics",
            items: [
              { name: "Drivers", href: "/logistics/drivers", icon: moduleIconMap["drivers"], moduleId: "drivers" as any },
              { name: "Deliveries", href: "/logistics/deliveries", icon: moduleIconMap["deliveries"], moduleId: "deliveries" as any },
            ]
          },
          {
            title: "Marketing",
            items: [
              { name: "Coupon Codes", href: "/coupons", icon: moduleIconMap["marketing"], moduleId: "marketing" as any },
              { name: "Gift Boxes", href: "/gift-boxes", icon: moduleIconMap["gift-boxes"], moduleId: "gift-boxes" as any },
              { name: "Gift Cards", href: "/gift-cards", icon: moduleIconMap["gift-cards"], moduleId: "gift-cards" as any },
              { name: "Adverts", href: "/advert", icon: moduleIconMap["advert"], moduleId: "advert" as any },
            ]
          },
          {
            title: "Finance",
            items: [
              { name: "Transactions", href: "/transactions", icon: moduleIconMap["transactions"], moduleId: "transactions" as any },
              { name: "Refunds", href: "/refunds", icon: moduleIconMap["refunds"], moduleId: "refunds" as any },
            ]
          },
          {
            title: "Governance & Staff",
            items: [
              { name: "Staff Management", href: "/users", icon: moduleIconMap["users"], moduleId: "users" as any },
              { name: "Roles & Policies", href: "/roles", icon: moduleIconMap["roles"], moduleId: "roles" as any },
              { name: "Permissions", href: "/permissions", icon: <HiShieldCheck size={14} />, moduleId: "permissions" as any },
            ]
          },
          {
            title: "Customers",
            items: [
              { name: "All Customers", href: "/customers", icon: moduleIconMap["customers"], moduleId: "customers" as any },
            ]
          },
          {
            title: "System",
            items: [
              { name: "Support", href: "/support", icon: moduleIconMap["support"], moduleId: "support" as any },
              { name: "FAQ", href: "/faq", icon: <HiOutlineQuestionMarkCircle size={14} />, moduleId: "faq" as any },
              { name: "Offices", href: "/offices", icon: moduleIconMap["offices"], moduleId: "offices" as any },
              { name: "Notifications", href: "/notifications", icon: moduleIconMap["notifications"], moduleId: "notifications" as any },
            ]
          }
        ]
      };
    }

    // 2. If we have real permissions from the DB, use them (For other roles)
    if (userPrivileges?.role?.permissions && userPrivileges.role.permissions.length > 0) {
      const categoryOrder = ["System", "Inventory", "Logistics", "Finance", "Marketing", "Users", "Admin"];
      const coreModuleIds = ["dashboard", "orders"];

      const coreItems = userPrivileges.role.permissions
        .filter(p => p.access && coreModuleIds.includes(p.id))
        .sort((a, b) => {
          if (a.id === "dashboard") return -1;
          if (b.id === "dashboard") return 1;
          return 0;
        })
        .map(p => {
          const metadata = moduleMetadata[p.id] || {};
          return {
            name: metadata.name || p.moduleName,
            href: metadata.href || `/${p.id}`,
            icon: moduleIconMap[p.id] || "Frame",
            moduleId: p.id as ModuleId
          };
        });

      const grouped = userPrivileges.role.permissions.reduce((acc, p) => {
        if (!p.access || coreModuleIds.includes(p.id)) return acc;

        const category = p.category || "General";
        if (!acc[category]) acc[category] = [];

        const metadata = moduleMetadata[p.id] || {};

        acc[category].push({
          name: metadata.name || p.moduleName,
          href: metadata.href || `/${p.id}`,
          icon: moduleIconMap[p.id] || "Frame",
          moduleId: p.id as ModuleId
        });

        return acc;
      }, {} as Record<string, any[]>);

      // Inject new modules
      if (!grouped["Marketing"]) grouped["Marketing"] = [];
      if (!grouped["Marketing"].some(item => item.href === "/gift-boxes")) {
        grouped["Marketing"].push({
          name: "Gift Boxes",
          href: "/gift-boxes",
          icon: moduleIconMap["gift-boxes"] || <HiOutlineGift size={16} />,
          moduleId: "gift-boxes" as any,
        });
      }
      if (!grouped["Marketing"].some(item => item.href === "/gift-cards")) {
        grouped["Marketing"].push({
          name: "Gift Cards",
          href: "/gift-cards",
          icon: moduleIconMap["gift-cards"] || <HiCreditCard size={16} />,
          moduleId: "gift-cards" as any,
        });
      }

      // Inject Logistics
      if (!grouped["Logistics"]) grouped["Logistics"] = [];
      if (!grouped["Logistics"].some(item => item.href === "/logistics/drivers")) {
        grouped["Logistics"].push({
          name: "Drivers",
          href: "/logistics/drivers",
          icon: moduleIconMap["drivers"] || "users",
          moduleId: "drivers" as any,
        });
      }
      if (!grouped["Logistics"].some(item => item.href === "/logistics/deliveries")) {
        grouped["Logistics"].push({
          name: "Deliveries",
          href: "/logistics/deliveries",
          icon: moduleIconMap["deliveries"] || "Shipped",
          moduleId: "deliveries" as any,
        });
      }

      const navGroups = Object.entries(grouped)
        .sort(([a], [b]) => {
          const indexA = categoryOrder.indexOf(a);
          const indexB = categoryOrder.indexOf(b);
          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
          return a.localeCompare(b);
        })
        .map(([title, items]) => ({
          title: title === "General" ? "" : title,
          items
        }));

      return { coreItems, navGroups };
    }

    return { coreItems: [], navGroups: [] };
  }, [userPrivileges, user]);

  const { coreItems, navGroups } = dynamicNavData;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize expanded groups - default to expanded for groups containing the active path
  const [expandedGroups, setExpandedGroups] = React.useState<string[]>([]);

  useEffect(() => {
    if (navGroups.length > 0 && expandedGroups.length === 0) {
      const activeGroups = navGroups
        .filter(group => group.items.some(item => pathname === item.href || (item.href !== "" && pathname.startsWith(item.href + "/"))))
        .map(group => group.title);
      setExpandedGroups(activeGroups);
    }
  }, [navGroups, pathname]);

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
      dispatch(logOut());

      // Clear all local storage and cookies manually as a fallback
      localStorage.clear();
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      toast.success("Session Terminated", {
        description: "You have been successfully logged out."
      });

      // Absolute navigation to clear all states
      window.location.href = "/";
    } catch (err) {
      // Even if the backend call fails (e.g. timeout), we should still clear local state
      dispatch(logOut());
      localStorage.clear();
      window.location.href = "/";
    }
  };

  const displayRole = user?.role?.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Store Management";

  if (isLoading && !userPrivileges) {
    return <SidebarSkeleton />;
  }

  return (
    <aside id="sidenav"
      className={`${isCollapsed ? "w-20" : "w-64"} h-full shrink-0 flex-col justify-between bg-white transition-transform duration-300 ease-in-out sm:flex sm:translate-x-0 border-r border-gray-200 ${isOpen ? "fixed inset-y-0 left-0 z-50 flex translate-x-0" : "hidden -translate-x-full sm:flex"
        }`}
    >
      {/* Brand */}
      <div className={`p-6 flex items-center ${isCollapsed ? "justify-center px-4" : "justify-between"}`}>
        <Logo size="md" variant="on-light" short={isCollapsed} type="cms" />
        {!isCollapsed ? (
          <button
            onClick={() => setIsCollapsed(true)}
            className="text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <Icon name="menu-close" folder="dashboardIcon" size="md" />
          </button>
        ) : (
          <button
            onClick={() => setIsCollapsed(false)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-1 custom-scrollbar pb-8">
        {/* Flat Core Items */}
        <div className="flex flex-col gap-1 mb-6">
          {coreItems.map((item) => {
            const isMatch = pathname === item.href || (item.href !== "" && pathname.startsWith(item.href + "/"));

            // Core items don't have specific sibling matches in this context
            const isActive = isMatch;

            return (
              <NavItem
                key={item.href}
                item={item}
                isCollapsed={isCollapsed}
                isActive={isActive}
                onHover={(name, rect) => setHoveredItem(name && rect ? { name, rect } : null)}
                pathname={pathname}
              />
            );
          })}
        </div>

        {/* Grouped Modules */}
        <div className="flex flex-col gap-6">
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
                      {group.items.map((item: any) => {
                        const isMatch = pathname === item.href || (item.href !== "" && pathname.startsWith(item.href + "/"));

                        const isMoreSpecificMatch = navGroups.flatMap(g => g.items).some(other =>
                          other.href !== item.href &&
                          other.href.startsWith(item.href + "/") &&
                          (pathname === other.href || pathname.startsWith(other.href + "/"))
                        );

                        const isActive = isMatch && !isMoreSpecificMatch;

                        return (
                          <NavItem
                            key={item.href}
                            item={item}
                            isCollapsed={isCollapsed}
                            isActive={isActive}
                            onHover={(name, rect) => setHoveredItem(name && rect ? { name, rect } : null)}
                            pathname={pathname}
                          />
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
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
            <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden   flex-shrink-0 group-hover:border-brand-gold-light group-hover:shadow-md transition-all relative">
              <Image
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || "A")}&background=C5A028&color=fff`}
                alt="User"
                fill
                className="object-cover"
                priority
                sizes="40px"
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
