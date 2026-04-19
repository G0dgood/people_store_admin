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
      <footer className="w-full bg-[#1A1A1A] pt-20 pb-12 text-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-12 mb-20">
        {/* Brand Column */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 overflow-hidden brightness-0 invert">
              <img src="/brand_logo/logo-symbol.svg" alt="Bloom & Mist" className="h-full object-contain" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-white font-inter whitespace-nowrap">
              Bloom & Mist
            </span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-[280px]">
            The premier destination for Signature Fragrances, Luxury Skincare, and bespoke Boutique Gifts. Experience elegance in every detail.
          </p>
          <div className="flex items-center gap-4 mt-8">
            {[
              { name: "facebook", icon: "social/facebook" },
              { name: "twitter", icon: "social/twitter" },
              { name: "linkedin", icon: "social/linkedin" },
              { name: "instagram", icon: "social/instagram" },
              { name: "youtube", icon: "social/youtube" }
            ].map((social) => (
              <div key={social.name} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-brand-red transition-all duration-300">
                <Icon name={social.icon} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Link Columns */}
        {columns.map((col, idx) => (
          <div key={idx} className="flex flex-col gap-5">
            <h4 className="font-black text-white text-[11px] uppercase tracking-[0.2em] mb-2">{col.title}</h4>
            <div className="flex flex-col gap-3 text-[13px] text-gray-400">
              {col.links.map((link: any, lIdx) => (
                link.onClick ? (
                  <button key={lIdx} onClick={link.onClick} className="hover:text-white text-left cursor-pointer transition-colors">{link.label}</button>
                ) : (
                  <Link key={lIdx} href={link.href} className="hover:text-white transition-colors">{link.label}</Link>
                )
              ))}
            </div>
          </div>
        ))}

        {/* App Store Buttons Corner */}
        <div className="lg:col-span-1">
          <h4 className="font-black text-white text-[11px] uppercase tracking-[0.2em] mb-6">Get app</h4>
          <div className="brightness-0 invert opacity-90">
            <StoreButtons orientation="vertical" />
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="w-full border-t border-white/5 pt-8">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] uppercase tracking-widest text-gray-500 font-bold">
          <p>© {new Date().getFullYear()} Bloom & Mist. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
              <span>English (USD)</span>
              <Icon name="expand_less" size="xs" />
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};

export { Footer };
