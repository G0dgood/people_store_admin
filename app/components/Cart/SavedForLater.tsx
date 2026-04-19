"use client";

import React from "react";
import Image from "next/image";
import { Icon } from "../Icon";
import { Button } from "../Button";

import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";

const SavedForLater = () => {
  const { addToCart } = useCart();
  const { wishlistItems, removeFromWishlist } = useWishlist();

  const handleMoveToCart = (item: any) => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
    });
    removeFromWishlist(item.id);
  };

  if (wishlistItems.length === 0) {
    return (
      <section className="bg-white border border-gray-200 overflow-hidden ">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Saved for later</h3>
        </div>
        <div className="p-12 flex flex-col items-center text-center gap-2">
           <p className="text-gray-900 font-bold">No saved items</p>
           <p className="text-gray-500 text-sm">Items you save for later will appear here.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white border border-gray-200 overflow-hidden ">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Saved for later ({wishlistItems.length})</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
        {wishlistItems.map((item) => (
          <div key={item.id} className="p-6 flex flex-col gap-4 hover:bg-gray-50 transition-colors group cursor-pointer">
            <div className="w-full aspect-square relative bg-white border border-gray-200 flex items-center justify-center p-14 md:p-10 overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain scale-75 group-hover:scale-80 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-gray-900">{item.price}</span>
                <p className="text-gray-500 text-sm leading-tight line-clamp-2 group-hover:text-brand-blue">{item.title}</p>
              </div>
              <div className="flex flex-row gap-2">
                <Button 
                  onClick={() => handleMoveToCart(item)}
                  variant="secondary" 
                  size="sm" 
                  className="flex-1 font-bold hover:bg-brand-blue hover:text-white shadow-none justify-center" 
                  iconLeft={<Icon name="shopping_cart" size="xs" />}
                >
                  Move to cart
                </Button>
                <Button 
                  onClick={() => removeFromWishlist(item.id)}
                  variant="ghost" 
                  size="sm" 
                  className="flex-1 !text-[#EB001B] font-medium border border-brand-blue-light hover:bg-red-50 shadow-none justify-center"
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export { SavedForLater };
