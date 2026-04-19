"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../Button/Button";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";

interface RecommendedProduct {
  id: string;
  title: string;
  price: string;
  image: string;
}

interface RecommendedProductsProps {
  products: RecommendedProduct[];
}

export const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ products }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent, product: RecommendedProduct) => {
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
    <div className="flex flex-col gap-4 mt-8 px-4 md:px-0 md:hidden">
      <h2 className="text-lg font-bold text-gray-900">You may also like</h2>
      
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
        {products.map((product) => (
          <div 
            key={product.id}
            className="flex-shrink-0 w-[160px] bg-white border border-gray-200 p-3 flex flex-col gap-2 transition-all relative group cursor-pointer active:scale-[0.98]"
          >
            <Link href={`/products/detail`} className="flex flex-col flex-1">
              <div className="w-full aspect-square relative mb-1">
                <Image 
                  src={product.image} 
                  alt={product.title} 
                  fill 
                  className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col gap-1 mb-2">
                <span className="text-sm font-bold text-gray-900">{product.price}</span>
                <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed group-hover:text-brand-blue transition-colors">
                  {product.title}
                </p>
              </div>
            </Link>
            
            <div className="flex flex-col gap-2">
               <Link href="/products/detail" className="w-full">
                  <Button variant="ghost" size="sm" className="w-full text-[10px] h-8 font-bold border border-gray-200 bg-gray-50/50 hover:bg-gray-100">
                    View Details
                  </Button>
               </Link>
               <Button 
                onClick={(e) => handleAddToCart(e, product)}
                variant="primary" 
                size="sm" 
                className="w-full text-[10px] h-8 font-bold shadow-none"
               >
                 + Cart
               </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
