"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/app/components/Icon";
import { Newsletter } from "@/app/components/Home/Newsletter";
import { Logo } from "@/app/components/Logo";
import { useOfficeLocationInfo } from "@/app/context/OfficeLocationContext";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectCurrentUser } from "@/lib/redux/features/authSlice";
import { getShopUrl } from "../utils/storeUtils";

const OfficeLocationFooter = () => {
  const { storeContext, officelocation } = useOfficeLocationInfo();
  const staff = useAppSelector(selectCurrentUser);

  const isLoggedIn = !!officelocation || !!staff;

  const columns = [
    {
      title: "About Location",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Our Inventory", href: getShopUrl("/", storeContext.subdomain, storeContext.officeId) }
      ],
    },
    {
      title: "Customer Service",
      links: [
        { label: "Help Center", href: "/faq" },
        { label: "Refund Policy", href: "/refund" },
        { label: "Shipping Info", href: "/shipping" },
        { label: "Contact Location", href: "/contact" }
      ],
    },
    {
      title: "My Account",
      links: [
        ...(isLoggedIn ? [
          { label: "Profile", href: getShopUrl("/profile", storeContext.subdomain, storeContext.officeId) },
          { label: "My Orders", href: getShopUrl("/orders", storeContext.subdomain, storeContext.officeId) }
        ] : [
          { label: "Sign In", href: getShopUrl("/profile", storeContext.subdomain, storeContext.officeId) },
          { label: "Track Order", href: getShopUrl("/orders", storeContext.subdomain, storeContext.officeId) }
        ]),
      ],
    },
  ];

  return (
    <footer
      className="w-full pt-20 pb-12 text-white"
      style={{ backgroundColor: 'var(--brand-black)' }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-12 mb-20">
        {/* Brand Column */}
        <div className="lg:col-span-2">
          <div className="mb-8">
            <Logo size="md" variant="on-dark" />
          </div>
          <p className="text-gray-400 text-[13px] leading-relaxed max-w-[280px] font-light tracking-wide">
            Official Boutique storefront for {storeContext.officeName || "Bloom & Mist"}. Experience local luxury with curated inventory and personalized service.
          </p>
          <div className="flex items-center gap-4 mt-10">
            {[
              { name: "facebook", icon: "social/facebook" },
              { name: "twitter", icon: "social/twitter" },
              { name: "instagram", icon: "social/instagram" }
            ].map((social) => (
              <div key={social.name} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white cursor-pointer hover:border-brand-gold hover:text-brand-gold transition-all duration-500">
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
              {col.links.map((link, lIdx) => (
                <Link key={lIdx} href={link.href} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Newsletter Column */}
        <Newsletter variant="footer" />
      </div>

      {/* Footer Bottom */}
      <div className="w-full border-t border-white/5 pt-8">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] uppercase tracking-widest text-gray-500 font-bold">
          <p>© {new Date().getFullYear()} {storeContext.officeName || "Bloom & Mist"}. Local Office Portal.</p>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default OfficeLocationFooter;
