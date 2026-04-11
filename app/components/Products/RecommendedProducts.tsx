"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

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
  return (
    <div className="flex flex-col gap-4 mt-8 px-4 md:px-0 md:hidden">
      <h2 className="text-lg font-bold text-gray-900">You may also like</h2>
      
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
        {products.map((product) => (
          <Link 
            key={product.id}
            href={`/products/detail`}
            className="flex-shrink-0 w-[150px] bg-white border border-gray-200 rounded-lg p-3 flex flex-col gap-2 hover:shadow-sm transition-shadow"
          >
            <div className="w-full aspect-square relative mb-1">
              <Image 
                src={product.image} 
                alt={product.title} 
                fill 
                className="object-contain p-2"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-gray-900">{product.price}</span>
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                {product.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
