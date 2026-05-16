
"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/app/components/Icon";

interface SectionHeaderRichProps {
  title: string;
  mainHref?: string;
  exploreLabel?: string;
  exploreHref?: string;
  className?: string;
}

export const SectionHeaderRich: React.FC<SectionHeaderRichProps> = ({
  title,
  mainHref = "/products?search",
  exploreLabel = "Explore All Selection",
  exploreHref = "/products?search",
  className = ""
}) => {
  return (
    <div className={`flex justify-between items-end mb-6 md:mb-8 mt-10 ${className}`}>
      <Link href={mainHref} className="group/title flex items-center gap-3">
        <h3 className="text-md md:text-xl font-bold text-gray-900 tracking-tight group-hover/title:text-brand-gold transition-colors font-outfit">
          {title}
        </h3>
        <div className="w-8 h-px bg-gray-200 group-hover/title:w-12 group-hover/title:bg-brand-gold transition-all duration-500 hidden md:block" />
      </Link>
      <Link
        href={exploreHref}
        className="text-[10px] font-black tracking-[0.2em] text-gray-400 hover:text-brand-gold transition-colors flex items-center gap-2 group/view"
      >
        {exploreLabel}
        <div className="w-5 h-5 rounded-full border border-gray-100 flex items-center justify-center group-hover/view:border-brand-gold group-hover/view:bg-brand-gold group-hover/view:text-white transition-all duration-300">
          <Icon name="arrow_forward" size="xs" />
        </div>
      </Link>
    </div>
  );
};
