
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetPublicBrandsQuery } from "@/lib/redux/services/boutiqueApi";
import { SectionHeaderRich } from "../ui/SectionHeaderRich";

const TopBrands = () => {
 const { data: brandsResponse, isLoading } = useGetPublicBrandsQuery();

 const brands = brandsResponse?.data && 'brands' in brandsResponse.data
  ? brandsResponse.data.brands
  : (Array.isArray(brandsResponse?.data) ? brandsResponse.data : []);

 // Filter for brands that have logos and are "top" (using rating or specific names from image)
 const topBrands = brands.slice(0, 6);

 if (isLoading) {
  return <div className="w-full h-32 bg-gray-50 animate-pulse mt-8 mb-12 border border-gray-200" />;
 }

 return (
  <section className="w-full mt-8 mb-12">
   <SectionHeaderRich
    title="Shop By Brands"
    mainHref="/brands"
    exploreLabel="All Brands"
    exploreHref="/brands"
   />

   <div className="w-full border border-gray-100 bg-white">
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-gray-100">
     {topBrands.map((brand: any, idx: number) => (
      <Link
       key={brand._id || idx}
       href={`/products?brand=${encodeURIComponent(brand.name)}`}
       className="group h-32 relative flex items-center justify-center p-6 hover:bg-gray-50 transition-colors"
      >
       <div className="relative w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105">
        <Image
         src={brand.logo || "/placeholder.png"}
         alt={brand.name}
         fill
         className="object-contain"
         sizes="(max-width: 768px) 150px, 200px"
        />
       </div>
      </Link>
     ))}

     {/* If we have fewer than 6, fill with placeholders to match the image grid */}
     {topBrands.length < 6 && [...Array(6 - topBrands.length)].map((_, i) => (
      <div key={`fill-${i}`} className="h-32 bg-white" />
     ))}
    </div>
   </div>
  </section>
 );
};

export { TopBrands };
