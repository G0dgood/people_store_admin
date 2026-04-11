"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "./Icon";
import { StoreButtons } from "./Other/Misc";

const Footer = () => {
  const columns = [
    {
      title: "About",
      links: ["About Us", "Find store", "Categories", "Blogs"],
    },
    {
      title: "Partnership",
      links: ["About Us", "Find store", "Categories", "Blogs"],
    },
    {
      title: "Information",
      links: ["Help Center", "Money Refund", "Shipping", "Contact us"],
    },
    {
      title: "For users",
      links: ["Login", "Register", "Settings", "My Orders"],
    },
  ];

  return (
    <footer className="w-full bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-12 mb-16">
        {/* Brand Column */}
        <div className="lg:col-span-2">
          <Image 
            src="/brand_logo/logo-colored.svg" 
            alt="Brand Logo" 
            width={150} 
            height={46} 
            className="h-10 w-auto mb-4"
          />
          <p className="text-gray-500 text-sm leading-relaxed max-w-[280px]">
            Best information about the company gies here but now lorem ipsum is
          </p>
          <div className="flex items-center gap-3 mt-4">
             <div className="w-8 h-8 rounded-full bg-[#BDC1C7] flex items-center justify-center text-white cursor-pointer hover:bg-brand-blue transition-colors">
                <Icon name="social/facebook" size="sm" />
             </div>
             <div className="w-8 h-8 rounded-full bg-[#BDC1C7] flex items-center justify-center text-white cursor-pointer hover:bg-brand-blue transition-colors">
                <Icon name="social/twitter" size="sm" />
             </div>
             <div className="w-8 h-8 rounded-full bg-[#BDC1C7] flex items-center justify-center text-white cursor-pointer hover:bg-brand-blue transition-colors">
                <Icon name="social/linkedin" size="sm" />
             </div>
             <div className="w-8 h-8 rounded-full bg-[#BDC1C7] flex items-center justify-center text-white cursor-pointer hover:bg-brand-blue transition-colors">
                <Icon name="social/instagram" size="sm" />
             </div>
             <div className="w-8 h-8 rounded-full bg-[#BDC1C7] flex items-center justify-center text-white cursor-pointer hover:bg-brand-blue transition-colors">
                <Icon name="social/youtube" size="sm" />
             </div>
          </div>
        </div>

        {/* Link Columns */}
        {columns.map((col, idx) => (
          <div key={idx} className="flex flex-col gap-3">
             <h4 className="font-bold text-gray-900 text-sm">{col.title}</h4>
             <div className="flex flex-col gap-1.5 text-sm text-gray-500">
                {col.links.map((link, lIdx) => (
                  <Link key={lIdx} href="#" className="hover:underline">{link}</Link>
                ))}
             </div>
          </div>
        ))}

        {/* App Store Buttons Corner */}
        <div className="lg:col-span-1">
            <h4 className="font-bold text-gray-900 text-sm mb-4">Get app</h4>
            <StoreButtons orientation="vertical" />
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="w-full bg-gray-100 py-6 border-t border-gray-200">
         <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between text-sm text-gray-500">
            <p>© 2023 Ecommerce.</p>
            <div className="flex items-center gap-2 cursor-pointer">
               <div className="w-5 h-4 bg-gray-200 rounded-sm"></div>
               <span>English</span>
               <Icon name="expand_less" size="xs" />
            </div>
         </div>
      </div>
    </footer>
  );
};

export { Footer };
