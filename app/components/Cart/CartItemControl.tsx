"use client";

import React from "react";
import { Icon } from "../Icon";

interface CartItemControlProps {
  id: string;
  price: string;
  quantity: number;
}

import { useCart } from "@/app/context/CartContext";
import { formatPrice } from "@/app/utils/formatPrice";

const CartItemControl: React.FC<CartItemControlProps> = ({ id, price, quantity }) => {
  const { updateQuantity } = useCart();

  return (
    <div className="flex flex-col items-end gap-4 min-w-[140px]">
      <span className="font-outfit font-bold text-lg md:text-xl text-gray-900">{formatPrice(price)}</span>
      <div className="relative w-full">
        <select 
          value={quantity}
          onChange={(e) => updateQuantity(id, parseInt(e.target.value))}
          className="w-full h-11 px-4 border border-gray-200 bg-white text-[10px] font-bold uppercase tracking-widest text-gray-900 appearance-none outline-none focus:border-brand-gold cursor-pointer transition-colors rounded-none"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            <option key={num} value={num}>Qty: {num}</option>
          ))}
        </select>
        <Icon name="expand_more" size="xs" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

export { CartItemControl };
