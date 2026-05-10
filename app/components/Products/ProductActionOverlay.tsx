"use client";

import React from "react";
import { HiEye } from "react-icons/hi2";

interface ProductActionOverlayProps {
  onQuickView: () => void;
  className?: string;
  useAbsolute?: boolean;
}

export const ProductActionOverlay: React.FC<ProductActionOverlayProps> = ({ onQuickView, className = "", useAbsolute = true }) => {
  const baseClasses = useAbsolute
    ? "absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0"
    : "flex flex-col gap-2";

  return (
    <div className={`${baseClasses} ${className}`}>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onQuickView();
        }}
        className="w-8 h-8 bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand-gold hover:border-brand-gold transition-all"
      >
        <HiEye size={15} />
      </button>
    </div>
  );
};
