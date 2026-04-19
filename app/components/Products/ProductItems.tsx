"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Rating, FavoriteButton } from "../Other";
import { Button } from "../Button/Button";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";

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
   const { addToCart } = useCart();

   const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart({
         id: product.id,
         title: product.title,
         price: product.price,
         image: product.image,
      });
      toast.success("Added to cart");
   };

   return (
      <div className="bg-white border border-gray-200 overflow-hidden transition-all group flex flex-col h-full relative">
         <Link href="/products/detail" className="flex flex-col flex-1">
            <div className="relative w-full aspect-square p-5 border-b border-gray-200 flex items-center justify-center">
               <div className="relative w-full h-full transition-transform duration-300 group-hover:scale-110">
                  <Image src={product.image} alt={product.title} fill className="object-contain" />
               </div>
               {/* Heart Icon (Overlay) */}
               <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <FavoriteButton item={product as any} variant="outline" size="sm" />
               </div>
            </div>
            <div className="p-5 flex flex-col gap-2 pb-16"> {/* Add padding for buttons */}
               <div className="flex items-center justify-between">
                  <span className="font-outfit font-bold text-lg text-gray-900">{product.price}</span>
               </div>
               <div className="flex items-center gap-2">
                  <Rating value={product.rating} />
                  <span className="text-brand-gold text-sm font-medium">{product.rating}</span>
               </div>
               <span className="text-gray-600 text-[13px] uppercase tracking-wider leading-relaxed line-clamp-2 group-hover:text-brand-gold transition-colors font-bold">
                  {product.title}
               </span>
            </div>
         </Link>

         {/* Actions Footer */}
         <div className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-50 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-200">
            <Link href="/products/detail" className="flex-1">
               <Button variant="secondary" size="sm" className="w-full text-[10px] uppercase tracking-widest font-bold py-2 border-gray-200 rounded-none">
                  Details
               </Button>
            </Link>
            <Button
               onClick={handleAddToCart}
               size="sm"
               className="flex-1 bg-black text-white hover:bg-brand-gold text-[10px] uppercase tracking-widest font-bold py-2 shadow-none rounded-none"
            >
               Add to cart
            </Button>
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
      const { addToCart } = useCart();

      const handleAddToCart = (e: React.MouseEvent) => {
         e.preventDefault();
         e.stopPropagation();
         addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
         });
         toast.success("Added to cart");
      };

      return (
         <div className="bg-white border border-gray-200 p-3 md:p-5 flex gap-3 md:gap-6 transition-all relative group">
            {/* Product Image */}
            <Link href="/products/detail" className="w-24 h-24 md:w-48 md:h-48 flex-shrink-0 border border-gray-200 flex items-center justify-center p-2 md:p-4 bg-white cursor-pointer overflow-hidden">
               <div className="relative w-full h-full transition-transform duration-300 hover:scale-110">
                  <Image src={product.image} alt={product.title} fill className="object-contain" />
               </div>
            </Link>

            {/* Product Content */}
            <div className="flex-1 flex flex-col gap-1 md:gap-3 pr-8 md:pr-0">
               <div className="flex items-start justify-between">
                  <Link href="/products/detail" className="text-[13px] md:text-base font-bold uppercase tracking-wider text-gray-900 leading-snug hover:text-brand-gold cursor-pointer transition-colors line-clamp-2 md:line-clamp-none">
                     {product.title}
                  </Link>
               </div>

               <div className="flex flex-col gap-0.5 md:gap-1">
                  <div className="flex items-center gap-2 md:gap-3">
                     <span className="font-outfit font-bold text-lg md:text-2xl text-gray-900">{product.price}</span>
                     {product.originalPrice && (
                        <span className="text-gray-400 line-through text-xs md:text-sm font-medium">{product.originalPrice}</span>
                     )}
                  </div>

                  {/* Rating & Orders */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] md:text-sm font-normal">
                     <div className="flex items-center gap-1">
                        <Rating value={product.rating} />
                        <span className="text-brand-gold font-bold ml-0.5 md:ml-1">{product.rating}</span>
                     </div>
                     <div className="flex items-center gap-1.5 text-gray-400">
                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-gray-300" />
                        <span className="uppercase tracking-widest text-[10px]">{product.orders} orders</span>
                     </div>
                     {/* Shipping Info */}
                     <div className="flex items-center gap-1.5 text-brand-gold">
                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-brand-gold" />
                        <span className="font-bold uppercase tracking-widest text-[10px]">{product.shipping}</span>
                     </div>
                  </div>
               </div>

               {/* Desktop-only description */}
               <p className="hidden md:block text-gray-500 text-sm leading-relaxed line-clamp-2 mt-1 font-light">
                  {product.description}
               </p>

               <div className="flex items-center gap-4 mt-auto pt-2">
                  <Link href="/products/detail" className="text-black hover:text-brand-gold font-bold text-[10px] uppercase tracking-widest cursor-pointer flex items-center gap-1 transition-colors">
                     View details
                  </Link>
                  <button
                     onClick={handleAddToCart}
                     className="md:hidden text-brand-gold font-bold text-[10px] uppercase tracking-widest cursor-pointer"
                  >
                     Add to cart
                  </button>
               </div>
            </div>

            {/* Actions Section (Right Side) */}
            <div className="hidden md:flex flex-col items-end justify-between py-1 min-w-[160px]">
               <div className="flex flex-col gap-3 items-end w-full">
                  {showFavorite && <FavoriteButton item={product as any} className="flex-shrink-0" />}
                  <Button
                     onClick={handleAddToCart}
                     size="sm"
                     className="w-full bg-black text-white hover:bg-brand-gold font-bold mt-2 shadow-none rounded-none text-[10px] uppercase tracking-widest h-10"
                  >
                     Add to cart
                  </Button>
               </div>

               {onRemove && (
                  <button
                     onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                     }}
                     className="text-red-500 font-bold text-[10px] uppercase tracking-widest hover:underline cursor-pointer transition-all mt-auto"
                  >
                     Remove Item
                  </button>
               )}
            </div>

            {/* Heart Icon (Mobile) */}
            {showFavorite && (
               <FavoriteButton item={product as any} variant="ghost" className="md:hidden absolute top-3 right-3" />
            )}
         </div>
      );
   };
