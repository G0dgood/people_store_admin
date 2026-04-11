import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Icon } from "../Icon";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

export const ProfileSidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { label: "Personal Info", href: "/profile", icon: "profile" },
    // { label: "My Orders", href: "/orders", icon: "favorite" },
    // { label: "Messages", href: "/messages", icon: "message_header", badge: 2 },
    { label: "My Wishlist", href: "/wishlist", icon: "favorite" },
    { label: "Settings", href: "/settings", icon: "Settings" },
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
      {/* User Header */}
      <div className="p-8 pb-6 border-b border-gray-50 flex flex-col items-center text-center">
        <div className="relative group cursor-pointer">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg ring-1 ring-gray-100 mb-4 group-hover:ring-brand-blue/30 transition-all">
            <Image
              src="/avatars/avatar=pic1.jpg"
              alt="User Avatar"
              width={96}
              height={96}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="absolute bottom-4 right-1 bg-brand-blue text-white p-1.5 rounded-full shadow-md border-2 border-white translate-y-1/2">
            <Icon name="edit" size="xs" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-0.5">Alex John</h3>
        <p className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-tighter">Premium Member</p>
        <div className="px-3 py-1 bg-blue-50 text-brand-blue text-[10px] font-bold rounded-full uppercase tracking-wider">
          Verified Buyer
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col py-4 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-xl font-bold text-sm transition-all group relative overflow-hidden
                ${isActive
                  ? "text-brand-blue bg-blue-50/50"
                  : "text-gray-500 hover:text-brand-blue hover:bg-gray-50"}`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-brand-blue rounded-r-full" />
              )}
              <Icon
                name={item.icon}
                size="sm"
                className={`transition-colors ${isActive ? "text-brand-blue" : "text-gray-400 group-hover:text-brand-blue"}`}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black transition-colors
                  ${isActive ? "bg-brand-blue text-white" : "bg-gray-200 text-gray-600 group-hover:bg-brand-blue group-hover:text-white"}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Action */}
      <div className="p-6 pt-2 border-t border-gray-50 bg-gray-50/30">
        <button className="flex items-center gap-3 px-4 py-3 text-red-500 transition-all w-full rounded-xl font-bold text-sm hover:bg-red-50 hover:text-red-700">
          <Icon name="logout" size="sm" />
          Log Out
        </button>
      </div>
    </aside>
  );
};
