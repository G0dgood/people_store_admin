"use client";

import React from "react";
import Image from "next/image";
import { HiOutlineTrash, HiMinus, HiPlus } from "react-icons/hi2";

interface OfficeLocationCartItemProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  priceUnit?: string;
  image: string;
  location?: string;
  initialQuantity: number;
  selectedColor?: string;
  selectedSize?: string;
  availableColors?: string[];
  images?: { fileUrl: string }[];
  stockCount?: number;
  quantityUnit?: string;
  onRemove: () => void;
  onQuantityChange: (quantity: number) => void;
}

export const OfficeLocationCartItem = ({
  name,
  description,
  price,
  priceUnit = "₦",
  image,
  location,
  initialQuantity,
  selectedColor,
  selectedSize,
  stockCount,
  quantityUnit = "items",
  onRemove,
  onQuantityChange,
}: OfficeLocationCartItemProps) => {
  return (
    <div className="flex flex-col gap-6 border-b border-gray-100 py-8 last:border-0 md:flex-row md:items-center">
      {/* Product Image */}
      <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-gray-50 p-2">
        <Image
          src={image || "/genericProduct.jpg"}
          alt={name}
          fill
          className="object-contain mix-blend-multiply"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500 line-clamp-1">{description}</p>
          </div>
          <button
            onClick={onRemove}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <HiOutlineTrash className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-2 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider text-gray-400">
          {selectedColor && (
            <div className="flex items-center gap-2">
              <span>Color:</span>
              <span className="text-gray-900">{selectedColor}</span>
            </div>
          )}
          {selectedSize && (
            <div className="flex items-center gap-2">
              <span>Size:</span>
              <span className="text-gray-900">{selectedSize}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-2">
              <span>Branch:</span>
              <span className="text-[#156BB6]">{location}</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Quantity Controls */}
            <div className="flex h-10 items-center rounded-full border border-gray-200 px-1">
              <button
                onClick={() => onQuantityChange(Math.max(1, initialQuantity - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-50"
              >
                <HiMinus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-bold">{initialQuantity}</span>
              <button
                onClick={() => onQuantityChange(initialQuantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-50"
                disabled={stockCount !== undefined && initialQuantity >= stockCount}
              >
                <HiPlus className="h-4 w-4" />
              </button>
            </div>
            
            {stockCount !== undefined && stockCount < 10 && (
              <span className="text-[10px] font-bold uppercase text-amber-600">
                Only {stockCount} {quantityUnit} left
              </span>
            )}
          </div>

          <div className="text-right">
            <span className="text-sm font-medium text-gray-400">Total Price</span>
            <p className="text-xl font-black text-[#156BB6]">
              {priceUnit} {(price * initialQuantity).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
