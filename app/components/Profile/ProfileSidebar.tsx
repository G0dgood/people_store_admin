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

import { useGetCurrentCustomerQuery, useUpdateCustomerAvatarMutation } from "@/lib/redux/services/customerApi";
import { toast } from "sonner";

export const ProfileSidebar: React.FC = () => {
  const pathname = usePathname();
  const { data: customerResponse, isLoading } = useGetCurrentCustomerQuery();
  const customer = (customerResponse as any)?.data;

  const navItems: NavItem[] = [
    { label: "Personal Info", href: "/profile", icon: "profile" },
    // { label: "My Orders", href: "/orders", icon: "favorite" },
    // { label: "Messages", href: "/messages", icon: "message_header", badge: 2 }, 
    { label: "Password", href: "/profile/password", icon: "lock" },
  ];

  const [isUpdatingAvatar, setIsUpdatingAvatar] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [updateAvatar] = useUpdateCustomerAvatarMutation();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUpdatingAvatar(true);
        const formData = new FormData();
        formData.append("avatar", file);

        await updateAvatar(formData).unwrap();
        toast.success("Profile photo updated!");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to update photo");
      } finally {
        setIsUpdatingAvatar(false);
      }
    }
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
      {/* User Header */}
      <div className="p-8 pb-6 border-b border-gray-50 flex flex-col items-center text-center">
        <div className="relative group cursor-pointer" onClick={() => !isUpdatingAvatar && fileInputRef.current?.click()}>
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg ring-1 ring-gray-100 mb-4 group-hover:ring-brand-blue/30 transition-all bg-gray-50 relative">
            {isLoading || isUpdatingAvatar ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                <div className="w-6 h-6 border-2 border-brand-blue border-t-transparent rounded-full animate-spin mb-1"></div>
                {isUpdatingAvatar && <span className="text-[8px] font-black text-brand-blue uppercase tracking-widest">Optimizing</span>}
              </div>
            ) : (
              <Image
                src={customer?.avatar || "/avatars/avatar=pic1.jpg"}
                alt="User Avatar"
                width={96}
                height={96}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            )}
            {!isUpdatingAvatar && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon name="edit" size="xs" className="text-white" />
              </div>
            )}
          </div>
          <div className="absolute bottom-4 right-1 bg-brand-blue text-white p-1.5 rounded-full shadow-md border-2 border-white translate-y-1/2">
            <Icon name="edit" size="xs" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </div>
        {isLoading ? (
          <div className="h-6 w-32 bg-gray-100 animate-pulse rounded mb-2" />
        ) : (
          <h3 className="text-xl font-bold text-gray-900 mb-0.5">{customer?.fullName || "Guest User"}</h3>
        )}
        <p className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-tighter">Premium Member</p>
        <div className="px-3 py-1 bg-brand-blue-light text-brand-blue text-[10px] font-bold rounded-full uppercase tracking-wider">
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
                  ? "text-brand-blue bg-brand-blue-light"
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


    </aside>
  );
};
