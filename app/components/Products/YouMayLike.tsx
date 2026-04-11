"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const YouMayLike = () => {
  const items = [
    { name: "Men's T-shirt", price: "$7.00 - $99.50", image: "/web_detail_images/Image copy.png" },
    { name: "Mens T-shirt Base Layer", price: "$7.00 - $99.50", image: "/web_detail_images/Image copy 2.png" },
    { name: "Mens T-shirt Base Layer", price: "$7.00 - $99.50", image: "/web_detail_images/Image copy 3.png" },
    { name: "Mens T-shirt Base Layer", price: "$7.00 - $99.50", image: "/web_detail_images/Image copy 4.png" },
    { name: "Mens T-shirt Base Layer", price: "$7.00 - $99.50", image: "/web_detail_images/Image copy 5.png" },
  ];

  return (
    <div className="w-72 flex-shrink-0 bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-5">
      <h3 className="font-bold text-gray-900">You may like</h3>
      <div className="flex flex-col gap-6">
         {items.map((item, idx) => (
           <Link key={idx} href="#" className="flex items-center gap-3 group">
              <div className="w-14 h-14 relative flex-shrink-0 border border-gray-100 rounded p-1 group-hover:border-brand-blue transition-colors">
                 <Image src={item.image} alt={item.name} fill className="object-contain" />
              </div>
              <div className="flex flex-col gap-1 overflow-hidden">
                 <span className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight group-hover:text-brand-blue transition-colors">
                    {item.name}
                 </span>
                 <span className="text-xs text-gray-400 font-normal">{item.price}</span>
              </div>
           </Link>
         ))}
      </div>
    </div>
  );
};

export { YouMayLike };
