"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "../Icon";
import { useMobileMenu } from "@/app/context/MobileMenuContext";
import { useCustomerAuth } from "@/app/context/CustomerAuthContext";
import { useAuthModal } from "@/app/context/AuthModalContext";
import { useCart } from "@/app/context/CartContext";

interface MenuItem {
  label: string;
  icon?: string;
  href: string;
  badge?: number;
}

const MobileMenuSidebar = () => {
  const { isOpen, closeMenu } = useMobileMenu();
  const { customer, isAuthenticated } = useCustomerAuth();
  const { openLogin } = useAuthModal();
  const { cartItems } = useCart();
  
  const cartCount = cartItems.length;

  const menuGroups: { items: MenuItem[] }[] = [
    {
      items: [
        { label: "Home", icon: "home", href: "/" },
        { label: "Categories", icon: "list", href: "/products" },
        { label: "My Cart", icon: "shopping_cart", href: "/cart", badge: cartCount },
        { label: "Favorites", icon: "favorite_border", href: "/wishlist" },
        { label: "My orders", icon: "inventory_2", href: "/orders" },
        { label: "My Profile", icon: "person", href: "/profile" },
      ]
    },
    {
      items: [
        { label: "English | USD", icon: "language", href: "#" },
        { label: "Contact us", icon: "headset_mic", href: "#" },
        { label: "About", icon: "info", href: "#" },
      ]
    },
    {
      items: [
        { label: "User agreement", href: "#" },
        { label: "Partnership", href: "#" },
        { label: "Privacy policy", href: "#" },
      ]
    }
  ];

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 w-[280px] bg-white z-[100] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Header / Profile */}
      <div className="bg-[#EFF2F4] p-6 flex flex-col gap-4 relative">
         <button 
           onClick={closeMenu}
           className="absolute top-4 right-4 text-gray-500 hover:text-black"
         >
            <Icon name="close" size="sm" />
         </button>
         
         <div className="flex flex-col gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-gray-200">
               <Image 
                 src={isAuthenticated && customer?.avatar ? customer.avatar : "/avatars/avatar=pic1.jpg"} 
                 alt="User" 
                 width={48} 
                 height={48} 
                 className="w-full h-full object-cover"
               />
            </div>
            <div className="flex flex-col">
               {isAuthenticated ? (
                 <span className="text-sm font-bold text-gray-900">{customer?.fullName}</span>
               ) : (
                 <button 
                   onClick={() => {
                     closeMenu();
                     openLogin();
                   }}
                   className="text-sm text-left font-bold text-gray-900 hover:text-brand-gold transition-colors"
                 >
                   Sign in | Register
                 </button>
               )}
            </div>
         </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-4">
         {menuGroups.map((group, gIdx) => (
           <div key={gIdx} className="border-b border-gray-200 last:border-0 py-2">
              {group.items.map((item, iIdx) => (
                <Link 
                  key={iIdx} 
                  href={item.href} 
                  onClick={closeMenu}
                  className="flex items-center gap-4 px-6 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-gold transition-colors group"
                >
                   {item.icon && (
                     <Icon 
                       name={item.icon} 
                       size="sm" 
                       className="text-gray-400 group-hover:text-brand-gold" 
                     />
                   )}
                   <span className={!item.icon ? "ml-9" : ""}>{item.label}</span>
                   {item.badge !== undefined && item.badge > 0 && (
                     <span className="ml-auto bg-[#C30000] text-white text-[10px] font-bold min-w-[20px] h-[20px] flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                       {item.badge}
                     </span>
                   )}
                </Link>
              ))}
           </div>
         ))}
      </div>
    </aside>
  );
};

export { MobileMenuSidebar };
