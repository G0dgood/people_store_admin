"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const recommendedItems = [
  { title: "Luxury Bloom Perfume Gift Set", price: "$145.00", image: "/brandImage/product_1.png" },
  { title: "Advanced Anti-Aging Skincare Kit", price: "$180.00", image: "/brandImage/product_4.png" },
  { title: "Organic Botanical Body Oil", price: "$34.00", image: "/brandImage/product_5.png" },
  { title: "Handcrafted Scented Candle", price: "$28.00", image: "/brandImage/product_8.png" },
  { title: "Travel Size Fragrance Discovery", price: "$45.00", image: "/brandImage/product_12.png" },
  { title: "Rosehip Infused Facial Serum", price: "$52.00", image: "/brandImage/product_7.png" },
  { title: "Silk Sleep Mask & Balm Gift", price: "$65.00", image: "/brandImage/product_3.png" },
  { title: "Essential Oil Diffuser Blend", price: "$18.00", image: "/brandImage/product_6.png" },
];

const RecommendedItems = () => {
  return (
    <section className="w-full">
      <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-gray-900">Recommended items</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
        {recommendedItems?.map((item, idx) => (
          <Link
            key={idx}
            href="/products/detail"
            className="bg-white border border-gray-200 p-5 flex flex-col gap-4 hover:border-brand-gold/20 transition-all duration-300 cursor-pointer group"
          >
            <div className="w-full aspect-square relative mb-2 overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-black text-neutral-900 text-lg tracking-tight">{item.price}</span>
              <p className="text-[13px] text-gray-500 font-medium line-clamp-2 leading-snug group-hover:text-brand-gold transition-colors">
                {item.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecommendedItems;
