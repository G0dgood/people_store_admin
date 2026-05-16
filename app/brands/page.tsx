
"use client";

import React, { useState, useMemo } from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { useGetPublicBrandsQuery } from "@/lib/redux/services/boutiqueApi";
import Link from "next/link";
import { AlphabetFilter } from "@/app/components/Brands/AlphabetFilter";
import { SectionHeaderRich } from "../components/ui/SectionHeaderRich";

const alphabet = ["ALL", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

const BrandsPage = () => {
 const { data: brandsResponse, isLoading } = useGetPublicBrandsQuery();
 const [activeLetter, setActiveLetter] = useState("ALL");

 const allBrands = useMemo(() => {
  return brandsResponse?.data && 'brands' in brandsResponse.data
   ? brandsResponse.data.brands
   : (Array.isArray(brandsResponse?.data) ? brandsResponse.data : []);
 }, [brandsResponse]);

 const filteredBrands = useMemo(() => {
  if (activeLetter === "ALL") return allBrands;
  if (activeLetter === "#") {
   return allBrands.filter((b: any) => /^[0-9]/.test(b.name));
  }
  return allBrands.filter((b: any) => b.name.toUpperCase().startsWith(activeLetter));
 }, [allBrands, activeLetter]);

 const groupedBrands = useMemo(() => {
  const groups: { [key: string]: any[] } = {};

  // For ALL, we group everything
  const targetBrands = filteredBrands;

  targetBrands.forEach((b: any) => {
   let firstChar = b.name[0].toUpperCase();
   if (!/[A-Z]/.test(firstChar)) {
    firstChar = "#";
   }
   if (!groups[firstChar]) groups[firstChar] = [];
   groups[firstChar].push(b);
  });

  return Object.keys(groups).sort().reduce((acc: any, key) => {
   acc[key] = groups[key].sort((a, b) => a.name.localeCompare(b.name));
   return acc;
  }, {});
 }, [filteredBrands]);

 return (
  <div className="min-h-screen bg-white flex flex-col font-outfit">
   <Header />

   <div className="flex-1 max-w-[1440px] mx-auto w-full px-6 md:px-10 lg:px-16 py-12 md:py-20">
    <div className="flex flex-col gap-12">
     <SectionHeaderRich
      title="Brands"
      mainHref="/brands"
      exploreLabel="Return to Shop"
      exploreHref="/"
      className="!mt-0"
     />

     {/* Alphabet Filter */}
     <AlphabetFilter
      alphabet={alphabet}
      activeLetter={activeLetter}
      onLetterClick={setActiveLetter}
     />

     {/* Brands Directory */}
     {isLoading ? (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 animate-pulse mt-8">
       {[...Array(6)].map((_, i) => (
        <div key={i} className="h-40 bg-gray-50 rounded-none border border-gray-100" />
       ))}
      </div>
     ) : (
      <div className="flex flex-col gap-16 mt-8">
       {Object.keys(groupedBrands).map((letter) => (
        <div key={letter} className="flex flex-col md:flex-row gap-8 md:gap-24 border-t border-gray-100 pt-12 first:border-0 first:pt-0">
         <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-none border border-gray-100 flex-shrink-0">
          <span className="text-2xl font-black text-gray-900">{letter}</span>
         </div>

         <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
          {groupedBrands[letter].map((brand: any) => (
           <Link
            key={brand._id}
            href={`/products?brand=${encodeURIComponent(brand.name)}`}
            className="group flex items-center gap-4 py-1"
           >
            <div className="text-[15px] font-medium text-gray-600 group-hover:text-brand-gold transition-colors tracking-tight">
             {brand.name}
            </div>
           </Link>
          ))}
         </div>
        </div>
       ))}

       {Object.keys(groupedBrands).length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
         <span className="text-gray-300 font-black text-6xl mb-4">?</span>
         <p className="text-gray-500 font-medium">No brands found for "{activeLetter}"</p>
         <button
          onClick={() => setActiveLetter("ALL")}
          className="mt-6 text-brand-gold font-bold text-xs uppercase tracking-widest hover:underline"
         >
          Clear Filter
         </button>
        </div>
       )}
      </div>
     )}
    </div>
   </div>

   <Footer />
  </div>
 );
};

export default BrandsPage;
