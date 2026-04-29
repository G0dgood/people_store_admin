"use client";

import React from "react";
import Image from "next/image";

const regions = [
  { name: "Arabic Emirates", flag: "/country/Property 1=AE.png", domain: "shopname.ae" },
  { name: "Australia", flag: "/country/Property 1=AU.png", domain: "shopname.au" },
  { name: "United States", flag: "/country/Property 1=US.png", domain: "shopname.com" },
  { name: "Russia", flag: "/country/Property 1=RU.png", domain: "shopname.ru" },
  { name: "Italy", flag: "/country/Property 1=IT.png", domain: "shopname.it" },
  { name: "Denmark", flag: "/country/Property 1=DK.png", domain: "shopname.com.dk" },
  { name: "France", flag: "/country/Property 1=FR.png", domain: "shopname.com.fr" },
  { name: "China", flag: "/country/Property 1=CN.png", domain: "shopname.cn" },
  { name: "United Kingdom", flag: "/country/Property 1=GB.png", domain: "shopname.co.uk" },
];

const RegionSuppliers = () => {
  return (
    <section className="w-full">
      <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-gray-900">Suppliers by region</h3>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-8 md:gap-x-12 gap-y-6">
        {regions.map((region, idx) => (
          <div key={idx} className="flex items-center gap-3 group cursor-pointer hover:bg-white p-2 -m-2 rounded-lg transition-colors">
            <div className="w-7 h-5 relative border border-gray-200 rounded-sm overflow-hidden flex-shrink-0 shadow-sm">
              <Image src={region.flag} alt={region.name} fill className="object-cover" sizes="28px" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium group-hover:text-brand-blue transition-colors truncate">
                {region.name}
              </span>
              <span className="text-[10px] text-gray-400 truncate">
                {region.domain}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export { RegionSuppliers };
