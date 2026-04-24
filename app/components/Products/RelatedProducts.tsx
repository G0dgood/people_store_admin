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
    <section className="flex flex-col gap-8 w-full mt-12">
      <h3 className="text-xl md:text-2xl font-outfit font-light uppercase tracking-widest text-gray-900">Related <span className="font-bold">products</span></h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {products.map((item, idx) => (
          <Link
            key={idx}
            href="/products/detail"
            className="bg-white flex flex-col gap-4 transition-all cursor-pointer group"
          >
            <div className="w-full aspect-square relative bg-gray-50/50 flex items-center justify-center p-6 group-hover:bg-gray-100 transition-colors">
              <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-110">
                <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-bold text-[11px] uppercase tracking-wider text-gray-900 line-clamp-2 group-hover:text-brand-gold transition-colors">{item.name}</span>
              <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{item.price}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
