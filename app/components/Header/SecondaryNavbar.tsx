import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "../Icon";
import { Button } from "../Button/Button";
import { DropdownMenu, DropdownItem } from "../Dropdown/DropdownMenu";

export const SecondaryNavbar: React.FC = () => {
 const [isSecondaryCategoryOpen, setIsSecondaryCategoryOpen] = useState(false);
 const [isHelpOpen, setIsHelpOpen] = useState(false);

 const secondaryCategoryRef = useRef<HTMLDivElement>(null);
 const helpRef = useRef<HTMLDivElement>(null);

 const pathname = usePathname();

 const isActive = (path: string) => pathname === path;

 useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
   const target = event.target as Node;
   if (secondaryCategoryRef.current && !secondaryCategoryRef.current.contains(target)) {
    setIsSecondaryCategoryOpen(false);
   }
   if (helpRef.current && !helpRef.current.contains(target)) {
    setIsHelpOpen(false);
   }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
 }, []);

 const navLinks = [
  { label: "Hot deals", href: "/products" },
  { label: "Gift boxes", href: "/gift-boxes" },
  { label: "Projects", href: "/projects" },
  { label: "Menu item", href: "/menu" },
 ];

 const helpLinks = [
  { label: "Help Center", href: "/help" },
  { label: "Place an order", href: "/help/order" },
  { label: "Payment options", href: "/help/payment" },
  { label: "Track an order", href: "/help/tracking" },
  { label: "Cancel an order", href: "/help/cancel" },
  { label: "Returns & Refunds", href: "/help/returns" },
  { label: "Cookie Preferences", href: "/help/cookies" },
 ];

 return (
  <div className="w-full bg-white border-t border-gray-100 hidden lg:block">
   <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 h-10 flex items-center justify-between">
    <div className="flex items-center gap-6 h-full">
     <div className="relative h-full z-40" ref={secondaryCategoryRef}>
      <button
       onClick={(e) => {
        e.stopPropagation();
        setIsSecondaryCategoryOpen(prev => !prev);
       }}
       className="flex items-center gap-2 h-full font-bold text-sm text-gray-900 border-r border-gray-100 pr-6 hover:text-brand-blue transition-colors outline-none focus:outline-none"
       aria-expanded={isSecondaryCategoryOpen}
      >
       <Icon name="menu" size="sm" />
       All categories
      </button>

      <AnimatePresence>
       {isSecondaryCategoryOpen && (
        <div className="absolute top-full left-0 pt-2 w-56 z-[100]" onClick={() => setIsSecondaryCategoryOpen(false)}>
         <DropdownMenu width="100%" className="shadow-lg">
          <DropdownItem label="Smartphones & Tablets" />
          <DropdownItem label="Computers & Laptops" />
          <DropdownItem label="Home Appliances" />
          <DropdownItem label="Furniture" />
          <DropdownItem label="Men's Fashion" />
          <DropdownItem label="Women's Fashion" />
         </DropdownMenu>
        </div>
       )}
      </AnimatePresence>
     </div>

     <div className="flex items-center gap-6 text-sm font-medium">
      {navLinks.map((link) => (
       <Link
        key={link.label}
        href={link.href}
        className={`transition-colors ${isActive(link.href) ? "text-brand-blue font-bold" : "text-gray-900 hover:text-brand-blue"
         }`}
       >
        {link.label}
       </Link>
      ))}
      <div className="relative h-full" ref={helpRef}>
       <div
        className={`flex items-center gap-1 cursor-pointer transition-colors h-full ${isHelpOpen ? "text-brand-blue font-bold" : "text-gray-900 hover:text-brand-blue"}`}
        onClick={() => setIsHelpOpen(prev => !prev)}
       >
        Help
        <Icon name="expand_more" size="xs" className={`transition-transform duration-200 ${isHelpOpen ? "rotate-180" : ""}`} />
       </div>

       <AnimatePresence>
        {isHelpOpen && (
         <div className="absolute top-full right-0 pt-2 w-64 z-[100]">
          <DropdownMenu width="100%" className="shadow-2xl border-gray-200 rounded-xl overflow-hidden">
           <div className="flex flex-col py-2">
            {helpLinks.map((link) => (
             <DropdownItem
              key={link.label}
              label={link.label}
              onSelect={() => setIsHelpOpen(false)}
              className="text-gray-700 hover:text-brand-blue font-medium"
             />
            ))}
           </div>

           {/* Contact Section */}
           <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex flex-col gap-3">
            <Button
             className="w-full text-white h-11 shadow-lg active:scale-95 transition-all hover:opacity-90"
             style={{ backgroundColor: "#2196F3" }}
             iconLeft={<Icon name="chat" size="sm" />}
            >
             Live Chat
            </Button>
            <Button
             variant="secondary"
             className="w-full h-11 border-2 font-bold active:scale-95 transition-all"
             style={{ borderColor: "#00B517", color: "#00B517" }}
             iconLeft={<Icon name="social/whatsapp" size="sm" />}
            >
             WhatsApp
            </Button>
           </div>
          </DropdownMenu>
         </div>
        )}
       </AnimatePresence>
      </div>
     </div>
    </div>

    <div className="flex items-center gap-6 text-sm font-bold text-gray-900">
     <div className="flex items-center gap-2 cursor-pointer">
      <span>English, USD</span>
      <Icon name="expand_more" size="xs" />
     </div>
     <div className="flex items-center gap-2 cursor-pointer">
      <span>Ship to</span>
      <div className="w-5 h-4 bg-gray-200 rounded-sm overflow-hidden border border-gray-300">
       <Image src="/country/Property 1=AE.png" alt="Country" width={20} height={16} className="w-full h-full object-cover" />
      </div>
      <Icon name="expand_more" size="xs" />
     </div>
    </div>
   </div>
  </div>
 );
};
