"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface RelatedProduct {
  name: string;
  price: string;
  image: string;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  return (
    <section className="flex flex-col gap-6 w-full">
      <h3 className="text-xl font-bold text-gray-900">Related products</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {products.map((item, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-full aspect-square relative border border-gray-50 rounded flex items-center justify-center p-2">
              <Image src={item.image} alt={item.name} fill className="object-contain" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-medium text-sm text-gray-900 line-clamp-2">{item.name}</span>
              <span className="text-gray-400 text-sm">{item.price}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
