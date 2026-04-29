"use client";

import React from "react";
import { motion } from "framer-motion";
import { HiOutlineSearch } from "react-icons/hi";

interface PageSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  animate?: boolean;
}

export const PageSearch: React.FC<PageSearchProps> = ({ 
  value, 
  onChange, 
  placeholder = "SEARCH QUESTIONS, COLLECTIONS, POLICIES...", 
  className = "",
  animate = true
}) => {
  const content = (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-brand-gold">
        <HiOutlineSearch size={22} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-14 md:h-16 pl-16 pr-8 rounded-full border shadow-2xl shadow-gray-200/50 bg-white text-[10px] font-bold uppercase tracking-[0.3em] text-gray-900 placeholder:text-gray-300 focus:ring-0 focus:border-brand-gold transition-all ${
          value ? "border-brand-gold" : "border-gray-200"
        }`}
      />
    </div>
  );

  if (!animate) {
    return (
      <div className={`relative max-w-xl mx-auto ${className}`}>
        {content}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className={`relative max-w-xl mx-auto ${className}`}
    >
      {content}
    </motion.div>
  );
};
