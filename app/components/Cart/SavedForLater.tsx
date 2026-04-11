"use client";

import React from "react";
import Image from "next/image";
import { Icon } from "../Icon";
import { Button } from "../Button";

const SavedForLater = () => {
 const items = [
  { name: "iPhone 13 Pro Max Gold 256GB", price: "$99.50", image: "/images/iphone.jpg" },
  { name: "Apple iPad Pro 12.9 (2021) 128GB", price: "$59.00", image: "/images/tablet.jpg" },
  { name: "GoPro HERO9 Black Camera", price: "$10.50", image: "/images/camera.jpg" },
  { name: "Apple MacBook Pro 13 (M1)", price: "$99.50", image: "/images/laptop.jpg" },
 ];

 return (
  <section className="bg-white border border-gray-200 rounded-lg overflow-hidden ">
   <div className="p-6 border-b border-gray-100">
    <h3 className="text-xl font-bold text-gray-900">Saved for later</h3>
   </div>
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
    {items.map((item, idx) => (
     <div key={idx} className="p-6 flex flex-col gap-4 hover:bg-gray-50 transition-colors group cursor-pointer">
      <div className="w-full aspect-square relative rounded bg-white border border-gray-200 flex items-center justify-center p-14 md:p-10 overflow-hidden">
       <Image
        src={item.image}
        alt={item.name}
        fill
        className="object-contain scale-75 group-hover:scale-80 transition-transform duration-300"
       />
      </div>
      <div className="flex flex-col gap-3">
       <div className="flex flex-col gap-1">
        <span className="font-bold text-gray-900">{item.price}</span>
        <p className="text-gray-500 text-sm leading-tight line-clamp-2 group-hover:text-brand-blue">{item.name}</p>
       </div>
       <div className="flex flex-row gap-2">
        <Button variant="secondary" size="sm" className="flex-1 font-bold hover:bg-brand-blue hover:text-white shadow-none justify-center" iconLeft={<Icon name="shopping_cart" size="xs" />}>
         Move to cart
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 !text-[#EB001B] font-medium border border-blue-50 hover:bg-red-50 shadow-none justify-center">
         Remove
        </Button>
       </div>
      </div>
     </div>
    ))}
   </div>
  </section>
 );
};

export { SavedForLater };
