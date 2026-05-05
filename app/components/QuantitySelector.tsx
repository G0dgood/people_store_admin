"use client";

import React from "react";
import { Icon } from "./Icon";

interface QuantitySelectorProps {
  quantity: number;
  stock: number;
  onIncrease: () => void;
  onDecrease: () => void;
  className?: string;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  stock,
  onIncrease,
  onDecrease,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <button
        onClick={onDecrease}
        disabled={quantity <= 1}
        className={`w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 bg-white shadow-sm transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <Icon name="remove" size="xs" className="text-gray-500" />
      </button>
      
      <span className="font-outfit font-bold text-sm text-gray-900 min-w-[20px] text-center">
        {quantity}
      </span>
      
      <button
        onClick={onIncrease}
        disabled={quantity >= stock}
        className={`w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 bg-white shadow-sm transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <Icon name="add" size="xs" className="text-gray-500" />
      </button>
    </div>
  );
};
