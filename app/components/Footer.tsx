"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "./Icon";
import { StoreButtons } from "./Other/Misc";
import { Newsletter } from "./Home/Newsletter";

import { useAuthModal } from "@/app/context/AuthModalContext";

const Footer = () => {
  const { openLogin, openRegister } = useAuthModal();
  const columns = [
    {
      title: "About",
      links: [
        { label: "About Us", href: "/about" },
        // { label: "Find store", href: "#" },
        { label: "Categories", href: "/categories" },
        { label: "Blogs", href: "/blog" }
      ],
    },
    // {
    //   title: "Partnership",
    //   links: [
    //     { label: "About Us", href: "#" },
    //     { label: "Find store", href: "#" },
    //     { label: "Categories", href: "#" },
    //   ],
    // },
    {
      title: "Information",
      links: [
        { label: "Help Center", href: "/faq" },
        { label: "Money Refund", href: "/refund" },
        { label: "Shipping", href: "/shipping" },
        { label: "Contact us", href: "/contact" }
      ],
    },
    {
      title: "For users",
      links: [
        { label: "Login", onClick: openLogin },
        { label: "Register", onClick: openRegister },
        { label: "Settings", href: "#" },
        { label: "My Orders", href: "/orders" }
      ],
    },
  ];

  return (
    <>
      <Newsletter />
      <footer className="w-full bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-12 mb-16">
        {/* Brand Column */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 overflow-hidden">
              <img src="/brand_logo/logo-symbol.svg" alt="Bloom & Mist" className="h-full object-contain" />
            </div>
            <span className="font-black text-xl tracking-tighter text-[#8CB7F5] font-inter whitespace-nowrap">
              Bloom & Mist
            </span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed max-w-[280px]">
            The premier destination for Signature Fragrances, Luxury Skincare, and bespoke Boutique Gifts. Best experiences in every petal.
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
              {col.links.map((link: any, lIdx) => (
                link.onClick ? (
                  <button key={lIdx} onClick={link.onClick} className="hover:underline text-left cursor-pointer">{link.label}</button>
                ) : (
                  <Link key={lIdx} href={link.href} className="hover:underline">{link.label}</Link>
                )
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
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 flex items-center justify-between text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Bloom & Mist. All rights reserved.</p>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-5 h-4 bg-gray-200 rounded-sm"></div>
            <span>English</span>
            <Icon name="expand_less" size="xs" />
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};

export { Footer };
