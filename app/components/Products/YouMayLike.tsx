"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";
import { Icon } from "../Icon";

const YouMayLike = () => {
  const { addToCart } = useCart();

  const items = [
    { id: "yml1", name: "Men's T-shirt", price: "₦99.50", image: "/web_detail_images/Image copy.png" },
    { id: "yml2", name: "Mens T-shirt Base Layer", price: "₦85.00", image: "/web_detail_images/Image copy 2.png" },
    { id: "yml3", name: "Mens T-shirt Base Layer", price: "₦75.00", image: "/web_detail_images/Image copy 3.png" },
    { id: "yml4", name: "Mens T-shirt Base Layer", price: "₦90.00", image: "/web_detail_images/Image copy 4.png" },
    { id: "yml5", name: "Mens T-shirt Base Layer", price: "₦95.00", image: "/web_detail_images/Image copy 5.png" },
  ];

  const handleAddToCart = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: item.id,
      title: item.name,
      price: item.price,
      image: item.image,
    });
    toast.success("Added to cart");
  };

  return (
    <div className="w-full lg:w-80 flex-shrink-0 bg-white border border-gray-100 p-8 flex flex-col gap-8 rounded-2xl shadow-sm">
      <h3 className="font-outfit font-light text-xl uppercase tracking-widest border-b border-gray-100 pb-4">You may <span className="font-bold">like</span></h3>
      <div className="flex flex-col gap-8">
         {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 group relative cursor-pointer active:scale-95 transition-all">
              <Link href="/products/detail" className="w-16 h-16 relative flex-shrink-0 border border-gray-100 p-2 group-hover:border-brand-gold transition-colors overflow-hidden bg-white rounded-lg shadow-sm">
                 <Image src={item.image} alt={item.name} fill className="object-contain transition-transform group-hover:scale-110" />
              </Link>
              <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                 <Link href="/products/detail" className="text-[11px] font-bold uppercase tracking-wider text-gray-900 line-clamp-2 leading-tight hover:text-brand-gold transition-colors">
                    {item.name}
                 </Link>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.price}</span>
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                         onClick={(e) => handleAddToCart(e, item)}
                         className="text-brand-gold hover:scale-110 transition-transform p-1.5 bg-gray-50 rounded-full"
                         title="Add to cart"
                       >
                          <Icon name="shopping_cart" size="xs" />
                       </button>
                    </div>
                 </div>
              </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export { YouMayLike };
