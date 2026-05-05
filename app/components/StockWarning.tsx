"use client";

import React from "react";

interface StockWarningProps {
  stock: number;
  quantity: number;
  className?: string;
}

export const StockWarning: React.FC<StockWarningProps> = ({
  stock,
  quantity,
  className = "",
}) => {
  if (stock > 5) return null;

  const isLimitReached = quantity >= stock;
  
  return (
    <div className={`flex flex-col items-end ${className}`}>
      <span 
        className={`text-[10px] font-bold uppercase tracking-widest ${
          isLimitReached ? "text-red-500" : "text-amber-500"
        }`}
      >
        {isLimitReached ? "Limit reached" : `Only ${stock} left`}
      </span>
    </div>
  );
};
