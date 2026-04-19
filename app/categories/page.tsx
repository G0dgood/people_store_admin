"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { HiChevronRight, HiDevicePhoneMobile, HiHome, HiSparkles, HiShoppingBag, HiHeart, HiBeaker, HiStar } from "react-icons/hi2";
import { motion } from "framer-motion";

const CategoriesPage = () => {
   const collections = [
      {
         title: "Signature Fragrance",
         count: "320 items",
         image: "/brandImage/signature_oud.webp",
         icon: <HiSparkles className="text-brand-blue" size={24} />,
         link: "/products?category=fragrance"
      },
      {
         title: "Advanced Skincare",
         count: "150 items",
         image: "/brandImage/cat_skincare.png",
         icon: <HiBeaker className="text-brand-blue" size={24} />,
         link: "/products?category=skincare"
      },
      {
         title: "Artisanal Gift Sets",
         count: "85 items",
         image: "/brandImage/cat_gifts.png",
         icon: <HiShoppingBag className="text-brand-blue" size={24} />,
         link: "/products?category=gifts"
      },
      {
         title: "Body & Bath",
         count: "120 items",
         image: "/brandImage/cat_body.png",
         icon: <HiHeart className="text-brand-blue" size={24} />,
         link: "/products?category=body"
      },
      {
         title: "Men's Grooming",
         count: "95 items",
         image: "/brandImage/cat_grooming.png",
         icon: <HiStar className="text-brand-blue" size={24} />,
         link: "/products?category=grooming"
      },
      {
         title: "Home Fragrance",
         count: "60 items",
         image: "/brandImage/cat_home_scent.png",
         icon: <HiHome className="text-brand-blue" size={24} />,
         link: "/products?category=home-scent"
      }
   ];

   const subCategories = [
      "Kitchenware", "Smartphones", "Outerwear", "Yoga Mats", "Organic Oils", "Office Supplies",
      "Smart Watches", "Garden Tools", "Denim", "Hiking Gear", "Skincare", "Power Tools"
   ];

   return (
      <div className="min-h-screen bg-white flex flex-col font-sans text-black">
         <Header />

         <main className="flex-1 w-full bg-white">
            {/* Step 86: Implement Minimalist Collections Hero section */}
            <section className="bg-white py-20 md:py-28 relative overflow-hidden border-b border-gray-200">
               <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue rounded-none filter blur-[120px] opacity-5 translate-x-1/2 -translate-y-1/2" />
               <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 text-center relative z-10">
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6 }}
                     className="flex flex-col gap-4"
                  >
                     <span className="text-brand-blue font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs">Bloom & Mist Catalogs</span>
                     <h1 className="text-4xl md:text-6xl font-black text-[#1D3557] tracking-tighter leading-none font-inter">
                        The <span className="text-brand-blue">Collections.</span>
                     </h1>
                     <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-lg mt-4 leading-relaxed font-medium">
                        Explore a universe of high-fidelity products curated across six primary categories, designed to bring excellence into every facet of your life.
                     </p>
                  </motion.div>
               </div>
            </section>

            <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24">
               {/* Step 87: Build Visual Collections Grid with Glassmorphism overlays */}
               <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                  {collections.map((col, i) => (
                     <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="relative aspect-[4/5] overflow-hidden cursor-pointer group border border-gray-200 transition-all duration-500"
                     >
                        <Image
                           src={col.image}
                           alt={col.title}
                           fill
                           className="object-cover group-hover:scale-110 transition-transform duration-1000"
                        />

                        {/* Glassmorphism Overlay */}
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-500" />

                        <div className="absolute bottom-6 left-6 right-6">
                           <div className="bg-white/80 backdrop-blur-xl p-8 border border-gray-200 flex flex-col gap-4 group-hover:-translate-y-2 transition-transform duration-500">
                              <div className="flex items-center justify-between">
                                 <div className="w-12 h-12 bg-white flex items-center justify-center border border-gray-200">
                                    {col.icon}
                                 </div>
                                 <span className="text-[10px] font-black uppercase tracking-widest text-[#1D3557] opacity-60">Verified Collection</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                 <h3 className="text-2xl font-black text-[#1D3557] tracking-tight">{col.title}</h3>
                                 <span className="text-xs font-bold text-brand-blue uppercase tracking-widest">{col.count}</span>
                              </div>
                              <Link
                                 href={col.link}
                                 className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-[#1D3557] group-hover:text-brand-blue pt-2 transition-colors"
                              >
                                 Explore Catalog <HiChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                              </Link>
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </section>

               {/* Step 88: Implement Sub-Category Exploration module */}
               <section className="mt-24 md:mt-40">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                     <div className="flex flex-col gap-2">
                        <span className="text-brand-blue font-bold tracking-[0.2em] uppercase text-xs">Deeper Discovery</span>
                        <h2 className="text-3xl md:text-5xl font-black text-[#1D3557] tracking-tight">Popular Verticals.</h2>
                     </div>
                     <p className="text-gray-500 max-w-md text-sm leading-relaxed">
                        Quickly jump into our most-searched niches and trending collections within the Bloom & Mist ecosystem.
                     </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                     {subCategories.map((sub, i) => (
                        <motion.div
                           key={i}
                           initial={{ opacity: 0, x: -10 }}
                           whileInView={{ opacity: 1, x: 0 }}
                           viewport={{ once: true }}
                           transition={{ delay: i * 0.05 }}
                           className="px-8 py-4 bg-white border border-gray-200 hover:border-brand-blue hover:text-brand-blue transition-all text-sm font-black uppercase tracking-widest text-[#1D3557] cursor-pointer"
                        >
                           {sub}
                        </motion.div>
                     ))}
                  </div>
               </section>
            </div>

            {/* Featured Promotion / Collections Trust */}
            <section className="bg-[#1D3557] py-20 relative overflow-hidden">
               <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 flex flex-col items-center text-center gap-6 relative z-10">
                  <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-inter">Can't find your <span className="text-[#8CB7F5]">bloom?</span></h2>
                  <p className="text-blue-100/40 text-sm md:text-base max-w-xl">
                     Our concierge sourcing team is always adding new collections to the catalog. Connect with our curators if you're looking for something specific.
                  </p>
                  <Link href="/contact" className="mt-4 px-12 py-5 bg-brand-blue text-white font-black uppercase tracking-widest text-sm hover:scale-105 transition-all">
                     Request Curator Support
                  </Link>
               </div>
            </section>
         </main>


         <Footer />
      </div>
   );
};

export default CategoriesPage;
