import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
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
    { label: "Brands", href: "/brands" },
  ];

  const helpLinks = [
    { label: "Help Center", href: "/help" },
    { label: "Place an order", href: "/help/order" },
    { label: "Payment options", href: "/help/payment" },
    { label: "Track an order", href: "/help/tracking" },
    { label: "Cancel an order", href: "/help/cancel" },
    { label: "Returns & Refunds", href: "/refund" },
    { label: "Cookie Preferences", href: "/help/cookies" },
  ];

  return (
    <div className="w-full bg-white border-t border-gray-200 hidden lg:block">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 h-10 flex items-center justify-between">
        <div className="flex items-center gap-6 h-full">
          <div className="relative h-full z-40" ref={secondaryCategoryRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsSecondaryCategoryOpen(prev => !prev);
              }}
              className="flex items-center gap-2 h-full font-bold text-sm text-gray-900 border-r border-gray-200 pr-6 hover:text-brand-blue transition-colors outline-none focus:outline-none"
              aria-expanded={isSecondaryCategoryOpen}
            >
              All categories
              {/* <Icon name="menu" size="sm" /> */}
            </button>

            <AnimatePresence>
              {isSecondaryCategoryOpen && (
                <div className="absolute top-full left-0 pt-2 w-56 z-[100]" onClick={() => setIsSecondaryCategoryOpen(false)}>
                  <DropdownMenu width="100%" className="border border-gray-200">
                    <DropdownItem label="Signature Fragrance" href="/products?category=Signature+Fragrance" />
                    <DropdownItem label="Luxury Skincare" href="/products?category=Luxury+Skincare" />
                    <DropdownItem label="Boutique Gift Sets" href="/gift-boxes" />
                    <DropdownItem label="Body & Bath" href="/products?category=Body+%26+Bath" />
                    <DropdownItem label="Home Fragrance" href="/products?category=Home+Fragrance" />
                    <DropdownItem label="Men's Grooming" href="/products?category=Men's+Grooming" />
                  </DropdownMenu>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-6 text-[12px] font-bold uppercase tracking-widest">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`transition-colors ${isActive(link.href) ? "text-brand-red font-bold" : "text-neutral-900 hover:text-brand-red"
                  }`}
              >
                {link.label}
              </Link>
            ))}


            <div className="relative h-full" ref={helpRef}>
              <div
                className={`flex items-center gap-1 cursor-pointer transition-colors h-full ${isHelpOpen ? "text-brand-red font-bold" : "text-neutral-900 hover:text-brand-red"}`}
                onClick={() => setIsHelpOpen(prev => !prev)}
              >
                Help
                <Icon name="expand_more" size="xs" className={`transition-transform duration-200 ${isHelpOpen ? "rotate-180" : ""}`} />
              </div>

              <AnimatePresence>
                {isHelpOpen && (
                  <div className="absolute top-full right-0 pt-2 w-64 z-[100]">
                    <DropdownMenu width="100%" className="border border-gray-200 overflow-hidden">
                      <div className="flex flex-col py-2">
                        {helpLinks.map((link) => (
                          <DropdownItem
                            key={link.label}
                            label={link.label}
                            href={link.href}
                            onSelect={() => setIsHelpOpen(false)}
                            className="text-gray-700 hover:text-brand-red font-semibold text-[11px] uppercase tracking-wide"
                          />
                        ))}
                      </div>

                      {/* Contact Section */}
                      <div className="p-4 border-t border-gray-200 bg-gray-50/30 flex flex-col gap-3">
                        <Button
                          className="w-full text-white h-11 active:scale-95 transition-all hover:opacity-90 font-bold uppercase text-[11px]"
                          style={{ backgroundColor: "#A10101" }}
                          iconLeft={<Icon name="chat" size="sm" />}
                        >
                          Live Chat
                        </Button>
                        <Button
                          variant="secondary"
                          className="w-full h-11 border-2 font-bold active:scale-95 transition-all uppercase text-[11px]"
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

        {/* <div className="flex items-center gap-6 text-sm font-bold text-gray-900">
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
    </div> */}
      </div>
    </div>
  );
};
