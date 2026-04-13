"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Rating, FavoriteButton } from "../Other";

interface ProductProps {
   id: string;
   title: string;
   price: string;
   originalPrice?: string;
   rating: number;
   orders: number;
   shipping: string;
   description: string;
   image: string;
}

export const ProductGridItem: React.FC<{ product: ProductProps }> = ({ product }) => {
   return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full cursor-pointer">
         <div className="relative w-full aspect-square p-5 border-b border-gray-100 flex items-center justify-center">
            <div className="relative w-full h-full">
               <Image src={product.image} alt={product.title} fill className="object-contain" />
            </div>
         </div>
         <div className="p-5 flex flex-col flex-1 gap-2">
            <div className="flex items-center justify-between">
               <span className="font-bold text-lg text-gray-900">{product.price}</span>
               <FavoriteButton />
            </div>
            <div className="flex items-center gap-2">
               <Rating value={product.rating} />
               <span className="text-orange-500 text-sm font-medium">{product.rating}</span>
            </div>
            <Link href="/products/detail" className="text-gray-600 text-sm leading-relaxed line-clamp-2 hover:text-brand-blue cursor-pointer transition-colors">
               {product.title}
            </Link>
         </div>
      </div>
   );
};

export const ProductListItem: React.FC<{ 
   product: ProductProps; 
   onRemove?: () => void;
   showFavorite?: boolean;
}> = ({ 
   product, 
   onRemove,
   showFavorite = true
}) => {
   return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-5 flex gap-3 md:gap-6 hover:shadow-md transition-shadow relative group">
         {/* Product Image */}
         <Link href="/products/detail" className="w-24 h-24 md:w-48 md:h-48 flex-shrink-0 border border-gray-100 rounded flex items-center justify-center p-2 md:p-4 bg-white cursor-pointer overflow-hidden">
            <div className="relative w-full h-full transition-transform duration-300 hover:scale-110">
               <Image src={product.image} alt={product.title} fill className="object-contain" />
            </div>
         </Link>

         {/* Product Content */}
         <div className="flex-1 flex flex-col gap-1 md:gap-3 pr-8 md:pr-0">
            <div className="flex items-start justify-between">
               <Link href="/products/detail" className="text-sm md:text-md font-medium text-gray-900 leading-snug hover:text-brand-blue cursor-pointer transition-colors line-clamp-2 md:line-clamp-none">
                  {product.title}
               </Link>
            </div>

            <div className="flex flex-col gap-0.5 md:gap-1">
               <div className="flex items-center gap-2 md:gap-3">
                  <span className="font-bold text-md md:text-xl text-gray-900">{product.price}</span>
                  {product.originalPrice && (
                     <span className="text-gray-400 line-through text-xs md:text-sm font-medium">{product.originalPrice}</span>
                  )}
               </div>

               {/* Rating & Orders */}
               <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] md:text-sm font-normal">
                  <div className="flex items-center gap-1">
                     <Rating value={product.rating} />
                     <span className="text-orange-500 font-medium ml-0.5 md:ml-1">{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                     <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-gray-300" />
                     <span>{product.orders} orders</span>
                  </div>
                  {/* Shipping Info - Mobile design shows color dot and text */}
                  <div className="flex items-center gap-1.5 text-[#00B517]">
                     <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#00B517]" />
                     <span className="font-medium">{product.shipping}</span>
                  </div>
               </div>
            </div>

            {/* Desktop-only description */}
            <p className="hidden md:block text-gray-500 text-sm leading-relaxed line-clamp-2 mt-1">
               {product.description}
            </p>

            <Link href="/products/detail" className="hidden md:block text-brand-blue font-bold text-sm hover:underline pt-2 cursor-pointer w-fit">
               View details
            </Link>
         </div>

         {/* Actions Section (Right Side) */}
         <div className="flex flex-col items-end justify-between py-1 min-w-[70px]">
            {/* Heart Icon (Desktop) */}
            {showFavorite && <FavoriteButton className="hidden md:flex flex-shrink-0" />}

            {onRemove && (
               <button 
                  onClick={(e) => {
                     e.stopPropagation();
                     onRemove();
                  }}
                  className="text-red-500 font-bold text-xs md:text-sm hover:underline cursor-pointer transition-all mt-auto"
               >
                  Remove
               </button>
            )}
         </div>

         {/* Heart Icon (Mobile - Floating like the design) */}
         {showFavorite && (
            <FavoriteButton variant="ghost" className="md:hidden absolute top-3 right-3" />
         )}
      </div>
   );
};
