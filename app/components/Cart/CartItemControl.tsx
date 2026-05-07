"use client";

import React from "react";
import { Icon } from "../Icon";

interface CartItemControlProps {
  id: string;
  price: string;
  quantity: number;
  stock?: number;
}

import { useCart } from "@/app/context/CartContext";
import { formatPrice } from "@/app/utils/formatPrice";
import { QuantitySelector } from "../QuantitySelector";
import { StockWarning } from "../StockWarning";

const CartItemControl: React.FC<CartItemControlProps> = ({ id, price, quantity, stock }) => {
  const { updateQuantity } = useCart();

  return (
    <div className="flex flex-col items-end gap-2 min-w-[140px]">
      <span className="font-outfit font-bold text-lg md:text-xl text-gray-900">{formatPrice(price)}</span>
      <QuantitySelector
        quantity={quantity}
        stock={stock ?? 0}
        onIncrease={() => updateQuantity(id, quantity + 1)}
        onDecrease={() => updateQuantity(id, quantity - 1)}
      />
      <StockWarning stock={stock || 0} quantity={quantity} />
    </div>
  );
};

export { CartItemControl };
