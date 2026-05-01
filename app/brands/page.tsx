"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { HiChevronRight, HiStar, HiSparkles, HiBeaker, HiShoppingBag, HiShieldCheck } from "react-icons/hi2";
import { motion } from "framer-motion";

import { useGetPublicBrandsQuery } from "@/lib/redux/services/boutiqueApi";
import { BrandSkeleton } from "../components/Skeleton/BrandSkeleton";
import { BrandDetailModal } from "../components/Brands/BrandDetailModal";
import { useState } from "react";

const BrandsPage = () => {
   const { data: brandsResponse, isLoading } = useGetPublicBrandsQuery();
   const brands = brandsResponse?.data || [];
   const [selectedBrand, setSelectedBrand] = useState<any>(null);
   const [isModalOpen, setIsModalOpen] = useState(false);

   const handleBrandClick = (brand: any) => {
      setSelectedBrand(brand);
      setIsModalOpen(true);
   };

   const renderContent = () => {
      if (isLoading) {
         return (
            <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
               {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <BrandSkeleton key={i} />
               ))}
            </section>
         );
      }

      if (brands.length === 0) {
         return (
            <div className="py-32 flex flex-col items-center justify-center text-center gap-6 w-full col-span-full">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 border border-gray-100">
                  <HiShoppingBag size={40} />
               </div>
               <h3 className="text-2xl font-bold text-[#1D3557]">No Brands Found</h3>
               <p className="text-gray-400 max-w-sm">We are currently curating new collections. Please check back soon for our latest arrivals.</p>
            </div>
         );
      }

      return (
         <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {brands.map((brand: any, i: number) => (
               <motion.div
                  key={brand._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="relative aspect-[4/5] rounded-[32px] overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-500"
               >
                  <Image
                     src={brand.logo || "/placeholder.png"}
                     alt={brand.name}
                     fill
                     className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  />

                  {/* Glassmorphism Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                  <div className="absolute inset-0 p-4 flex flex-col justify-end" onClick={() => handleBrandClick(brand)}>
                     <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 flex flex-col gap-3 group-hover:-translate-y-2 transition-transform duration-500">
                        <div className="flex items-center justify-end">
                           <div className="flex items-center gap-1">
                              <HiStar className="text-brand-gold" size={10} />
                              <span className="text-[9px] font-bold text-white">{brand.rating || 5.0}</span>
                           </div>
                        </div>
                        <div className="flex flex-col gap-1">
                           <h3 className="text-lg font-black text-white tracking-tight leading-tight truncate">{brand.name}</h3>
                           <p className="text-[10px] text-white/60 leading-relaxed font-medium line-clamp-2">
                              Luxury heritage & artisanal mastery.
                           </p>
                        </div>
                        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-brand-gold pt-1">
                           Discover <HiChevronRight size={14} />
                        </div>
                     </div>
                  </div>
               </motion.div>
            ))}
         </section>
      );
   };

   return (
      <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-sans text-black">
         <Header />

         <main className="flex-1 w-full bg-white">
            {/* Brands Hero section */}
            <section className="bg-gray-50 py-20 md:py-32 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold rounded-full filter blur-[120px] opacity-5 translate-x-1/2 -translate-y-1/2" />
               <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 text-center relative z-10">
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6 }}
                     className="flex flex-col gap-4"
                  >
                     <span className="text-brand-gold font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs">Artisanal Houses</span>
                     <h1 className="text-4xl md:text-7xl font-black text-[#1D3557] tracking-tighter leading-none font-inter">
                        The <span className="text-brand-gold">Brands.</span>
                     </h1>
                     <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-lg mt-6 leading-relaxed font-medium">
                        Explore our curated selection of luxury perfume houses and skincare curators, each bringing a unique signature to the Bloom & Mist ecosystem.
                     </p>
                  </motion.div>
               </div>
            </section>

            <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-32">
               {/* Dynamic Content */}
               {renderContent()}
            </div>

            {/* Brands Concierge section */}
            <section className="bg-[#1D3557] py-24 relative overflow-hidden">
               <Image 
                  src="/brandImage/brand_banner.png" 
                  alt="Background" 
                  fill 
                  className="object-cover opacity-10 grayscale" 
               />
               <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 flex flex-col items-center text-center gap-8 relative z-10">
                  <div className="flex flex-col gap-2">
                     <span className="text-brand-gold font-bold tracking-[0.4em] uppercase text-xs">Custom Procurement</span>
                     <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none font-inter">Looking for a specific <span className="text-[#8CB7F5]">Creator?</span></h2>
                  </div>
                  <p className="text-blue-100/40 text-sm md:text-lg max-w-2xl font-medium">
                     Our artisans maintain connections with luxury houses globally. If you need a specific brand or collector's edition not shown here, our concierge sourcing team is at your disposal.
                  </p>
                  <Link href="/contact" className="mt-4 px-16 py-6 bg-brand-gold text-white rounded-3xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all">
                     Consult a Brand Curator
                  </Link>
               </div>
            </section>
         </main>

         <BrandDetailModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            brand={selectedBrand} 
         />

         <Footer />
      </div>
   );
};

export default BrandsPage;
