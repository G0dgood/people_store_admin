"use client";

import React from "react";
import Image from "next/image";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { FavoriteButton } from "../Other";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";

const SupplierCard = () => {
   const { addToCart } = useCart();

   const handleAddToCart = () => {
      addToCart({
         id: "detail-1",
         title: "Mens Long Sleeve T-shirt Cotton Base Layer Slim Muscle",
         price: "₦98.00",
         image: "/images/shirt.jpg",
      });
      toast.success("Added to cart");
   };

   return (
      <div className="w-72 flex-shrink-0 flex flex-col gap-3">
         <div className="bg-white border border-gray-200 p-5 flex flex-col gap-5 ">
            {/* Vendor Header */}
            <div className="flex gap-3 pb-4 border-b border-gray-200 items-center">
               <div className="w-12 h-12 bg-[#DDF0FF] flex items-center justify-center text-brand-gold font-bold text-xl">
                  R
               </div>
               <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">Supplier</span>
                  <span className="text-xs text-gray-400">Guanjoi Trading Co., Ltd.</span>
               </div>
            </div>

            {/* Vendor Details */}
            <div className="flex flex-col gap-2">
               <div className="flex items-center gap-3">
                  {/* <div className="w-5 h-4 relative">
                     <Image src="/country/Property 1=DE.png" alt="Germany" fill className="object-cover" />
                  </div> */}
                  {/* <span className="text-sm text-gray-400">Germany, Berlin</span> */}
               </div>
               <div className="flex items-center gap-3">
                  <Icon name="verified_user" size="sm" className="text-gray-400" />
                  <span className="text-sm text-gray-400">Verified Seller</span>
               </div>
               {/* <div className="flex items-center gap-3">
                  <Icon name="public" size="sm" className="text-gray-400" />
                  <span className="text-sm text-gray-400">Worldwide shipping</span>
               </div> */}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
               <Button
                  onClick={handleAddToCart}
                  className="w-full bg-brand-gold text-white h-10 hover:bg-brand-gold/90 shadow-none cursor-pointer"
               >
                  Add to cart
               </Button>
               {/* <Button variant="ghost" className="w-full bg-white text-brand-gold border border-gray-200 h-10 hover:bg-gray-50 shadow-none cursor-pointer">Seller's profile</Button> */}
            </div>
         </div>

         {/* Favorite Button Overlay (Design-specific placement) */}
         <FavoriteButton
            item={{
               id: "detail-1",
               title: "Mens Long Sleeve T-shirt Cotton Base Layer Slim Muscle",
               price: "₦98.00",
               image: "/images/shirt.jpg",
            }}
            variant="none"
            className="flex items-center justify-center gap-2 py-4 text-brand-gold text-sm font-medium hover:underline cursor-pointer"
         >
            Save for later
         </FavoriteButton>
      </div>
   );
};

export { SupplierCard };
