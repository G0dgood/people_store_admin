"use client";

import React from "react";
import Image from "next/image";
import { Icon } from "@/app/components/Icon";

const services = [
  {
    title: "Source from Industry Hubs",
    image: "/web_images/Mask group copy.png",
    icon: "search"
  },
  {
    title: "Customize Your Products",
    image: "/web_images/Mask group copy 2.png",
    icon: "inventory_2"
  },
  {
    title: "Fast, reliable shipping by ocean or air",
    image: "/web_images/Mask group copy 3.png",
    icon: "send"
  },
  {
    title: "Product monitoring and inspection",
    image: "/web_images/Mask group copy.png",
    icon: "security"
  }
];

const ExtraServices = () => {
  return (
    <section className="w-full">
      <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-gray-900">Extra services</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {services.map((service, idx) => (
          <div 
            key={idx} 
            className="bg-white border border-gray-200 rounded-lg overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer relative"
          >
            <div className="h-32 relative overflow-hidden">
              <Image 
                src={service.image} 
                alt={service.title} 
                fill 
                className="object-cover transition-transform group-hover:scale-110 duration-500" 
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
            </div>
            <div className="p-5 pt-8 relative bg-white">
              <div className="absolute -top-7 right-5 w-14 h-14 bg-[#D1E7FF] border-4 border-white rounded-full flex items-center justify-center text-gray-900 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md">
                <Icon name={service.icon} size="md" />
              </div>
              <p className="text-sm font-medium pr-12 leading-relaxed text-gray-800 group-hover:text-brand-blue transition-colors">
                {service.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export { ExtraServices };
