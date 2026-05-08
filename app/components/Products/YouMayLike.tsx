"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";
import { Icon } from "../Icon";

import { useGetPublicRecommendedProductsQuery } from "@/lib/redux/services/boutiqueApi";
import { useApiError } from "@/app/hooks/useApiError";
import { SectionHeaderSimple } from "../ui/SectionHeaderSimple";

const YouMayLike = () => {
  const { addToCart } = useCart();
  const { data: recommendedResponse, isLoading, isError, error } = useGetPublicRecommendedProductsQuery();

  useApiError(isError, error, "Failed to load recommendations");

  const items = (recommendedResponse?.data || []).slice(0, 5).map(p => ({
    id: p._id,
    name: p.name,
    price: `₦${p.price.toLocaleString()}`,
    image: p.productImage || "/placeholder.png",
    stock: p.stock,
    isUnlimited: p.isUnlimited
  }));

  if (isLoading) {
    return (
      <div className="w-full lg:w-80 flex-shrink-0 bg-white border border-gray-200 p-8 flex flex-col gap-8 animate-pulse">
        <div className="h-6 bg-gray-100 w-3/4" />
        <div className="flex flex-col gap-8">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-50 flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-3 bg-gray-100 w-full" />
                <div className="h-3 bg-gray-50 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleAddToCart = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: item.id,
      title: item.name,
      price: item.price,
      image: item.image,
      stock: item.stock,
      isUnlimited: item.isUnlimited,
    });
    toast.success("Added to cart");
  };

  return (
    <div className="w-full lg:w-80 flex-shrink-0 bg-white border border-gray-200  flex flex-col gap-8">
      <SectionHeaderSimple title="You may like" />
      <div className="flex flex-col gap-8 p-8 pt-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 group relative cursor-pointer active:scale-95 transition-all">
            <Link href={`/products/detail?id=${item.id}`} className="w-16 h-16 relative flex-shrink-0 border border-gray-200 p-2 group-hover:border-brand-gold transition-colors overflow-hidden bg-white">
              <Image src={item.image} alt={item.name} fill className="object-contain transition-transform group-hover:scale-110" sizes="64px" />
            </Link>
            <div className="flex-1 flex flex-col gap-1 overflow-hidden">
              <Link href={`/products/detail?id=${item.id}`} className="text-[11px] font-outfit font-bold tracking-wider text-gray-900 line-clamp-2 leading-tight hover:text-brand-gold transition-colors">
                {item.name}
              </Link>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-outfit font-bold uppercase tracking-widest">{item.price}</span>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleAddToCart(e, item)}
                    className="text-brand-gold hover:scale-110 transition-transform p-1.5 bg-gray-50 rounded-full"
                    title="Add to cart"
                  >
                    <Icon name="shopping_cart" size="sm" />
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
