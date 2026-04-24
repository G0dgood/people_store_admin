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
    { id: "yml1", name: "Aura Pink Blossom", price: "₦40.00", image: "/web_images/perfume_product_1_square_1777031387712.png" },
    { id: "yml2", name: "Aurore Noire Intense", price: "₦150.00", image: "/web_images/perfume_product_2_square_1777031402357.png" },
    { id: "yml3", name: "Oceania Fresh Mist", price: "₦85.00", image: "/web_images/perfume_product_3_square_1777031417355.png" },
    { id: "yml4", name: "Royale Luxe Parfum", price: "₦220.00", image: "/web_images/perfume_product_4_square_1777031431419.png" },
    { id: "yml5", name: "Silver Aura Modern", price: "₦95.00", image: "/web_images/perfume_product_5_square_1777031445408.png" },
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
    <div className="w-full lg:w-80 flex-shrink-0 bg-white border border-gray-200 p-8 flex flex-col gap-8">
      <h3 className="font-outfit font-light text-xl uppercase tracking-widest border-b border-gray-200 pb-4">You may <span className="font-bold">like</span></h3>
      <div className="flex flex-col gap-8">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 group relative cursor-pointer active:scale-95 transition-all">
            <Link href="/products/detail" className="w-16 h-16 relative flex-shrink-0 border border-gray-200 p-2 group-hover:border-brand-gold transition-colors overflow-hidden bg-white">
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
