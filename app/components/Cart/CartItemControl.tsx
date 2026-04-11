"use client";

import React from "react";
import { Icon } from "../Icon";

interface CartItemControlProps {
  price: string;
}

const CartItemControl: React.FC<CartItemControlProps> = ({ price }) => {
  return (
    <div className="flex flex-col items-end gap-3 min-w-[120px]">
      <span className="font-bold text-gray-900">{price}</span>
      <div className="relative w-32">
        <select className="w-full h-10 px-3 border border-gray-300 rounded-lg bg-white text-sm text-gray-900 appearance-none outline-none focus:border-brand-blue cursor-pointer">
          <option>Qty: 1</option>
          <option>Qty: 2</option>
          <option>Qty: 3</option>
          <option>Qty: 4</option>
          <option>Qty: 5</option>
        </select>
        <Icon name="expand_more" size="xs" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

export { CartItemControl };
