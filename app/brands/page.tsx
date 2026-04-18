"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { HiChevronRight, HiStar, HiSparkles, HiBeaker, HiShoppingBag, HiShieldCheck } from "react-icons/hi2";
import { motion } from "framer-motion";

const BrandsPage = () => {
   const brands = [
      {
         title: "Bloom & Mist Signature",
         description: "Our flagship house, masterfully balancing midnight bloom with rare oud for an unforgettable sensory trajectory.",
         image: "/brandImage/signature_oud.webp",
         icon: <HiSparkles className="text-brand-blue" size={24} />,
         link: "/products?brand=Bloom+%26+Mist"
      },
      {
         title: "Prada",
         description: "Reinventing classic elegance through avant-garde scented sensations and timeless ambery signatures.",
         image: "/brandImage/product_2.png",
         icon: <HiStar className="text-brand-blue" size={24} />,
         link: "/products?brand=Prada"
      },
      {
         title: "Versace",
         description: "Powerful, passionate compositions that blend noble ingredients into vibrant, high-fidelity fragrances.",
         image: "/brandImage/product_4.png",
         icon: <HiShieldCheck className="text-brand-blue" size={24} />,
         link: "/products?brand=Versace"
      },
      {
         title: "Gucci",
         description: "Eclectic and contemporary structures that remain unchanged from the first application to the skin.",
         image: "/brandImage/gucci_guilty.png",
         icon: <HiBeaker className="text-brand-blue" size={24} />,
         link: "/products?brand=Gucci"
      },
      {
         title: "Dior",
         description: "Absolute luxury distilled into intense floral and woody orchestrations for the modern connoisseur.",
         image: "/brandImage/product_6.png",
         icon: <HiShoppingBag className="text-brand-blue" size={24} />,
         link: "/products?brand=Dior"
      },
      {
         title: "Lancôme",
         description: "Sophisticated beauty rituals designed to materialize absolute radiance and timeless femininity.",
         image: "/brandImage/product_13.png",
         icon: <HiSparkles className="text-brand-blue" size={24} />,
         link: "/products?brand=Lancôme"
      }
   ];

   return (
      <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-sans text-black">
         <Header />

         <main className="flex-1 w-full bg-white">
            {/* Brands Hero section */}
            <section className="bg-gray-50 py-20 md:py-32 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue rounded-full filter blur-[120px] opacity-5 translate-x-1/2 -translate-y-1/2" />
               <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 text-center relative z-10">
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6 }}
                     className="flex flex-col gap-4"
                  >
                     <span className="text-brand-blue font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs">Artisanal Houses</span>
                     <h1 className="text-4xl md:text-7xl font-black text-[#1D3557] tracking-tighter leading-none font-inter">
                        The <span className="text-brand-blue">Brands.</span>
                     </h1>
                     <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-lg mt-6 leading-relaxed font-medium">
                        Explore our curated selection of luxury perfume houses and skincare curators, each bringing a unique signature to the Bloom & Mist ecosystem.
                     </p>
                  </motion.div>
               </div>
            </section>

            <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-32">
               {/* Visual Brands Grid */}
               <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12">
                  {brands.map((brand, i) => (
                     <motion.div
                        key={i}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="relative aspect-[16/10] rounded-[48px] overflow-hidden cursor-pointer group shadow-sm hover:shadow-2xl transition-all duration-700"
                     >
                        <Image
                           src={brand.image}
                           alt={brand.title}
                           fill
                           className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                        />

                        {/* Glassmorphism Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="absolute bottom-8 left-8 right-8">
                           <div className="bg-white/70 backdrop-blur-2xl p-8 md:p-10 rounded-[40px] border border-white/40 flex flex-col gap-6 group-hover:-translate-y-4 transition-transform duration-500">
                              <div className="flex items-center justify-between">
                                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                                    {brand.icon}
                                 </div>
                                 <span className="text-[10px] font-black uppercase tracking-widest text-[#1D3557] opacity-60">Signature House</span>
                              </div>
                              <div className="flex flex-col gap-2">
                                 <h3 className="text-3xl font-black text-[#1D3557] tracking-tight">{brand.title}</h3>
                                 <p className="text-sm text-gray-500 leading-relaxed font-medium max-w-sm">
                                    {brand.description}
                                 </p>
                              </div>
                              <Link
                                 href={brand.link}
                                 className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-brand-blue pt-2 group-hover:translate-x-2 transition-transform"
                              >
                                 Discover Collection <HiChevronRight size={18} />
                              </Link>
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </section>
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
                     <span className="text-brand-blue font-bold tracking-[0.4em] uppercase text-xs">Custom Procurement</span>
                     <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none font-inter">Looking for a specific <span className="text-[#8CB7F5]">Creator?</span></h2>
                  </div>
                  <p className="text-blue-100/40 text-sm md:text-lg max-w-2xl font-medium">
                     Our artisans maintain connections with luxury houses globally. If you need a specific brand or collector's edition not shown here, our concierge sourcing team is at your disposal.
                  </p>
                  <Link href="/contact" className="mt-4 px-16 py-6 bg-brand-blue text-white rounded-3xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all">
                     Consult a Brand Curator
                  </Link>
               </div>
            </section>
         </main>


         <Footer />
      </div>
   );
};

export default BrandsPage;
