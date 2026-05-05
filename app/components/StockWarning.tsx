"use client";

import React from "react";

interface StockWarningProps {
  stock: number;
  quantity: number;
  className?: string;
}

export const StockWarning: React.FC<StockWarningProps & { isUnlimited?: boolean }> = ({
  stock,
  quantity,
  isUnlimited = false,
  className = "",
}) => {
  if (isUnlimited) {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <div className="w-1 h-1 rounded-full bg-brand-gold" />
        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
          Always Available
        </span>
      </div>
    );
  }

  if (stock > 0) {
    const isLimitReached = quantity >= stock;
    const colorClass = isLimitReached ? "text-rose-500" : stock <= 5 ? "text-amber-500" : "text-gray-400";
    const dotClass = isLimitReached ? "bg-rose-500" : stock <= 5 ? "bg-amber-500" : "bg-brand-gold";
    
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <div className={`w-1 h-1 rounded-full ${dotClass}`} />
        <span className={`text-[9px] font-bold uppercase tracking-widest ${colorClass}`}>
          {isLimitReached ? "Limit reached" : `${stock} units left`}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-1 h-1 rounded-full bg-rose-500" />
      <span className="text-[9px] font-bold uppercase tracking-widest text-rose-500">
        Out of Stock
      </span>
    </div>
  );
};
