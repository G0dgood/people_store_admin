"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "../Icon";
import { Rating } from "../Other/Rating";
import { Button } from "../Button";

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
            <button className="w-9 h-9 border border-gray-200 rounded-md flex items-center justify-center hover:text-red-500 hover:border-red-500 transition-colors">
               <Icon name="favorite" size="sm" />
            </button>
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

export const ProductListItem: React.FC<{ product: ProductProps }> = ({ product }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 flex gap-6 hover:shadow-md transition-shadow cursor-pointer">
      <div className="w-48 h-48 flex-shrink-0 border border-gray-100 rounded flex items-center justify-center p-4">
         <div className="relative w-full h-full">
           <Image src={product.image} alt={product.title} fill className="object-contain" />
         </div>
      </div>

      <div className="flex-1 flex flex-col gap-3">
         <div className="flex items-start justify-between">
            <Link href="/products/detail" className="text-md font-medium text-gray-900 leading-snug hover:text-brand-blue cursor-pointer transition-colors max-xl">
               {product.title}
            </Link>
            <button className="w-9 h-9 border border-gray-200 rounded-md flex items-center justify-center hover:text-red-500 hover:border-red-500 transition-colors">
               <Icon name="favorite" size="sm" />
            </button>
         </div>

         <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
               <span className="font-bold text-xl text-gray-900">{product.price}</span>
               {product.originalPrice && (
                 <span className="text-gray-400 line-through text-sm font-medium">{product.originalPrice}</span>
               )}
            </div>
            <div className="flex items-center gap-4 text-sm font-normal">
               <div className="flex items-center gap-1">
                  <Rating value={product.rating} />
                  <span className="text-orange-500 font-medium ml-1">{product.rating}</span>
               </div>
               <div className="flex items-center gap-1.5 text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  <span>{product.orders} orders</span>
               </div>
               <div className="flex items-center gap-1.5 text-[#00B517]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00B517]" />
                  <span>{product.shipping}</span>
               </div>
            </div>
         </div>

         <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mt-1">
            {product.description}
         </p>

         <Link href="/products/detail" className="text-brand-blue font-bold text-sm w-fit hover:underline pt-2 cursor-pointer">
            View details
         </Link>
      </div>
    </div>
  );
};
