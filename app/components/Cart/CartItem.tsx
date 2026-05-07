"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { CartItemControl } from "./CartItemControl";

interface CartItemProps {
   id: string;
   title: string;
   price: string;
   image: string;
   quantity: number;
   stock?: number;
   meta?: {
      size?: string;
      color?: string;
      material?: string;
      seller?: string;
   };
}

import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";

const CartItem: React.FC<CartItemProps> = ({ id, title, price, image, quantity, stock, meta = {} }) => {
   const { removeFromCart } = useCart();
   const { addToWishlist } = useWishlist();

   const handleSaveForLater = () => {
      addToWishlist({
         id,
         title,
         price,
         image,
         description: meta.seller ? `Seller: ${meta.seller}` : "",
      });
      removeFromCart(id);
   };

   return (
      <div className="flex flex-col md:flex-row gap-6 p-6 border-b border-gray-200 last:border-0 hover:bg-gray-50/30 transition-colors">
         {/* Item Image */}
         <div className="w-24 h-24 flex-shrink-0 border border-gray-200 p-3 flex items-center justify-center bg-white shadow-none">
            <div className="relative w-full h-full">
               {image ? (
                  <Image src={image} alt={title} fill className="object-contain" sizes="96px" />
               ) : (
                  <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300 text-[10px] font-bold uppercase tracking-widest text-center">
                     No<br />Image
                  </div>
               )}
            </div>
         </div>

         {/* Item Details */}
         <div className="flex-1 flex flex-col gap-2">
            <h3 className="text-gray-900 font-bold text-[13px] md:text-base uppercase tracking-wider leading-tight hover:text-brand-gold cursor-pointer transition-colors max-w-md">
               {title}
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
               {meta.size && <span>Size: {meta.size}</span>}
               {meta.color && <span>Color: {meta.color}</span>}
               {meta.material && <span>Material: {meta.material}</span>}
               {meta.seller && <span>Seller: {meta.seller}</span>}
            </div>
            <div className="flex items-center gap-4 mt-2">
               <button
                  onClick={() => removeFromCart(id)}
                  className="text-red-500 text-[10px] uppercase tracking-widest font-bold hover:underline transition-all"
               >
                  Remove
               </button>
               <button
                  onClick={handleSaveForLater}
                  className="text-brand-gold text-[10px] uppercase tracking-widest font-bold hover:underline transition-all"
               >
                  Save for later
               </button>
            </div>
         </div>

         {/* Item Control & Price */}
         <CartItemControl id={id} price={price} quantity={quantity} stock={stock} />
      </div>
   );
};

export { CartItem };
