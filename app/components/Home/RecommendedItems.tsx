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
            className="bg-white border border-[#1C1C1C1A] rounded-[6px] p-4 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="w-full aspect-square relative mb-2">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-gray-900">{item.price}</span>
              <p className="text-sm text-gray-500 line-clamp-2 leading-tight group-hover:text-brand-blue transition-colors">
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
