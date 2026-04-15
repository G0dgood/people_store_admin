"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "../Icon";

interface NavGroup {
  title: string;
  items: {
    name: string;
    href: string;
    icon: string;
  }[];
}

const navGroups: NavGroup[] = [
  {
    title: "Main menu",
    items: [
      { name: "Dashboard", href: "/admin", icon: "Frame" },
      { name: "Order Management", href: "/admin/orders", icon: "Cart" },
      { name: "Customers", href: "/admin/customers", icon: "users" },
      { name: "Coupon Code", href: "/admin/coupons", icon: "ticket" },
      { name: "Categories", href: "/admin/categories", icon: "circle-square" },
      { name: "Transaction", href: "/admin/transactions", icon: "famicons_card-outline" },
      { name: "Brand", href: "/admin/brands", icon: "star" },
      { name: "Notifications", href: "/admin/notifications", icon: "Bell outline" },
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
    title: "Admin",
    items: [
      { name: "Admin role", href: "/admin/roles", icon: "user-profile-circle" },
      { name: "Control Authority", href: "/admin/permissions", icon: "settings" },
    ],
  },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <aside id="sidenav" className={`${isCollapsed ? "w-20" : "w-64"} bg-white border-r border-gray-100 h-screen sticky top-0 flex flex-col transition-all duration-300 ease-in-out`}>
      {/* Brand */}
      <div className={`p-8 flex items-center ${isCollapsed ? "justify-center px-4" : "justify-between"}`}>
        <div className="flex items-center gap-2">
          <div className="h-6 overflow-hidden">
            <img src="/dashboardIcon/dashboardLogo.svg" alt="DEALPORT" className="h-full object-contain" />
          </div>
        </div>
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="text-gray-400 hover:text-gray-900 transition-colors"
          >
            <Icon name="menu-close" folder="dashboardIcon" size="md" />
          </button>
        )}
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="text-gray-400 hover:text-gray-900 transition-colors"
          >
            <Icon name="menu" folder="dashboardIcon" size="md" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-6 custom-scrollbar pb-8">
        {navGroups.map((group) => (
          <div key={group.title} className="flex flex-col gap-1">
            {!isCollapsed && (
              <h4 className="px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                {group.title}
              </h4>
            )}
            {group.items.map((item) => {
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
                <Link
                  key={item.name}
                  href={item.href}
                  title={isCollapsed ? item.name : ""}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-all text-sm font-medium ${isCollapsed ? "justify-center px-2" : ""} ${isActive
                    ? "bg-brand-blue text-white shadow-md shadow-blue-100"
                    : "text-gray-500 hover:bg-brand-blue-light hover:text-brand-blue"
                    }`}
                >
                  <Icon name={item.icon} folder="dashboardIcon" size="sm" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Profile & Shop */}
      <div className="p-4 flex flex-col gap-4 border-t border-gray-50">
        <div className={`flex items-center ${isCollapsed ? "justify-center px-0" : "justify-between px-2"}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gray-100 overflow-hidden shadow-sm flex-shrink-0">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="User" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-gray-900 truncate">Dealport</span>
                <span className="text-[10px] font-medium text-gray-400 truncate">Mark@thedesigner...</span>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button className="text-gray-400 hover:text-red-500 transition-colors">
              <Icon name="ic_round-logout" folder="dashboardIcon" size="sm" />
            </button>
          )}
        </div>

        {!isCollapsed ? (
          <Link
            href="/"
            className="flex items-center justify-between px-4 py-2.5 border border-gray-100 rounded-md hover:border-brand-blue/30 hover:bg-brand-blue-light hover:shadow-lg hover:shadow-gray-100 transition-all group"
          >
            <div className="flex items-center gap-3 text-gray-600 font-bold">
              <Icon name="Cart" folder="dashboardIcon" size="sm" className="text-brand-blue" />
              <span className="text-xs">Your Shop</span>
            </div>
            <Icon name="link-external" folder="dashboardIcon" size="xs" className="text-gray-300 group-hover:text-brand-blue" />
          </Link>
        ) : (
          <Link
            href="/"
            title="Your Shop"
            className="flex items-center justify-center p-2.5 border border-gray-100 rounded-md hover:border-brand-blue/30 hover:shadow-lg hover:shadow-gray-100 transition-all group"
          >
            <Icon name="Cart" folder="dashboardIcon" size="sm" className="text-brand-blue" />
          </Link>
        )}
      </div>
    </aside>
  );
};
