"use client";

import React from "react";
import { Icon } from "../Icon";

interface CartItemControlProps {
  id: string;
  price: string;
  quantity: number;
}

import { useCart } from "@/app/context/CartContext";

const CartItemControl: React.FC<CartItemControlProps> = ({ id, price, quantity }) => {
  const { updateQuantity } = useCart();

  return (
    <div className="flex flex-col items-end gap-3 min-w-[120px]">
      <span className="font-bold text-gray-900">{price}</span>
      <div className="relative w-32">
        <select 
          value={quantity}
          onChange={(e) => updateQuantity(id, parseInt(e.target.value))}
          className="w-full h-10 px-3 border border-gray-300 rounded-lg bg-white text-sm text-gray-900 appearance-none outline-none focus:border-brand-blue cursor-pointer"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            <option key={num} value={num}>Qty: {num}</option>
          ))}
        </select>
        <Icon name="expand_more" size="xs" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

export { CartItemControl };
