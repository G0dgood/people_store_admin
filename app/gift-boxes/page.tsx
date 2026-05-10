"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { HiChevronRight, HiSparkles, HiShoppingBag, HiGift } from "react-icons/hi2";
import { motion } from "framer-motion";
import { Button } from "@/app/components/Button";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";

import { useGetGiftBoxesQuery } from "@/lib/redux/services/giftBoxApi";

const GiftBoxesPage = () => {
 const { data: giftSetsRes, isLoading } = useGetGiftBoxesQuery({ status: "Active" });
 const giftSets = giftSetsRes?.data?.giftBoxes || [];
 const { addToCart } = useCart();

 const handleAddToCart = (set: any) => {
  addToCart({
   id: set._id,
   title: set.name,
   price: String(set.price),
   image: set.image,
   itemType: "GiftBox"
  });
  toast.success("Added to Cart", {
   description: `${set.name} has been added to your curation.`
  });
 };

 return (
  <div className="min-h-screen !bg-white flex flex-col font-sans text-black">
   <Header />

   <main className="flex-1 w-full bg-white py-8 md:py-12">
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 flex flex-col gap-12 md:gap-24">
     {/* Artisanal Curations Hero */}
     <section className="relative pt-16 pb-12 md:pt-24 md:pb-20 bg-black overflow-hidden">
      <Image
       src="/brandImage/cat_gifts.png"
       alt="Gift Boxes Collection"
       fill
       className="object-cover opacity-100  brightness-50"
       priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold rounded-full filter blur-[140px] opacity-10 translate-x-1/2 -translate-y-1/2" />

      <div className="px-6 md:px-10 lg:px-16 relative z-10">
       <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl"
       >
        <div className="bg-black/20 backdrop-blur-sm p-6 md:p-10 border border-white/10 inline-flex flex-col gap-6">
         <div className="flex flex-col gap-4">
          <span className="text-brand-gold font-black tracking-[0.4em] text-xs">Boutique Curations</span>
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none font-inter">
           Artisanal <br /><span className="text-brand-gold">Gifts.</span>
          </h1>
         </div>
         <p className="text-gray-300 text-sm md:text-lg leading-relaxed font-medium max-w-xl">
          Elevate the art of giving with our meticulously curated sensory experiences. Each set is hand-wrapped in our signature Bloom & Mist packaging.
         </p>
         <div className="pt-4 flex flex-col md:flex-row gap-4">
          <Button className="!bg-brand-gold !text-white font-black tracking-widest px-12 py-5 h-auto rounded-none border-none shadow-2xl shadow-brand-gold/20 hover:scale-105 transition-all">
           Shop All Sets
          </Button>
          <Button variant="ghost" className="!text-white border-white/20 hover:!bg-white/10 font-black tracking-widest px-12 py-5 h-auto rounded-none hover:scale-105 transition-all">
           Custom Curation
          </Button>
         </div>
        </div>
       </motion.div>
      </div>
     </section>

     {/* Gift Collection Grid */}
     <section className="py-8 md:py-12">
      <div className="flex flex-col gap-4 mb-16 md:mb-24">
       <span className="text-brand-gold font-bold tracking-[0.2em] text-xs">The Seasonal Edit</span>
       <h2 className="text-4xl md:text-6xl font-black text-black tracking-tight">Hand-Wrapped <br />Excellence.</h2>
      </div>

      <div className="flex flex-col gap-12">
       {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
         {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
           <div className="aspect-square bg-gray-100 rounded-[48px] mb-8" />
           <div className="h-6 bg-gray-100 rounded w-3/4 mb-2" />
           <div className="h-4 bg-gray-100 rounded w-1/2" />
          </div>
         ))}
        </div>
       ) : giftSets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
         {giftSets.map((set, i) => (
          <motion.div
           key={set._id}
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: i * 0.1 }}
           className="group cursor-pointer"
          >
           <div className="relative aspect-square rounded-[48px] overflow-hidden bg-gray-50 mb-8 border border-gray-100 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-black/5">
            <Image
             src={set.image}
             alt={set.name}
             fill
             className="object-contain p-12 group-hover:p-8 transition-all duration-700"
            />
            {set.tag && (
             <div className="absolute top-8 left-8">
              <div className="px-5 py-2 bg-white/70 backdrop-blur-md rounded-full text-[10px] font-black tracking-widest text-black border border-white/40">
               {set.tag}
              </div>
             </div>
            )}
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-8 left-8 right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
             <button
              onClick={() => handleAddToCart(set)}
              className="w-full py-5 bg-black text-white font-black tracking-widest text-[10px] rounded-2xl shadow-2xl flex items-center justify-center gap-2 hover:bg-brand-charcoal transition-colors"
             >
              <HiShoppingBag size={14} /> Add To Cart
             </button>
            </div>
           </div>
           <div className="flex flex-col gap-2 px-2">
            <div className="flex justify-between items-start">
             <h3 className="text-2xl font-black text-black tracking-tight group-hover:text-brand-gold transition-colors">
              {set.name}
             </h3>
             <span className="text-xl font-bold text-gray-900">₦{set.price.toLocaleString()}</span>
            </div>
            <p className="text-gray-500 text-sm font-medium line-clamp-1">{set.description}</p>
           </div>
          </motion.div>
         ))}
        </div>
       ) : (
        <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         className="flex flex-col items-center justify-center py-20 text-center gap-6"
        >
         <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
          <HiGift size={64} />
         </div>
         <div className="flex flex-col gap-2">
          <h3 className="text-3xl font-black text-black tracking-tight">Curation in Progress</h3>
          <p className="text-gray-500 max-w-sm mx-auto font-medium">
           Our artisanal curators are currently hand-picking new seasonal sets. Please check back soon for our next release.
          </p>
         </div>
         <Button
          onClick={() => window.location.href = '/products'}
          className="!bg-black !text-white px-10 py-4 h-auto rounded-none font-black tracking-widest text-xs"
         >
          Explore All Products
         </Button>
        </motion.div>
       )}
      </div>
     </section>

     {/* Bespoke Concierge CTA */}
     <section className="bg-black py-24 md:py-32 relative overflow-hidden rounded-[48px]">

      <Image
       src="/brandImage/cat_gifts.png"
       alt="Bespoke Background"
       fill
       className="object-cover opacity-20  brightness-50"
       sizes="100vw"
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-20">
       <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-6">
         <div className="w-16 h-16 bg-brand-gold rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-brand-gold/20">
          <HiSparkles size={32} />
         </div>
         <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[1.1]">The Bespoke <br /><span className="text-brand-gold">Choice.</span></h2>
        </div>
        <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-medium">
         Seeking a personalized touch? Our Concierge team specializes in corporate gifting and custom sensory curation for life's most momentous occasions.
        </p>
        <div className="flex flex-col md:flex-row gap-8">
         <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black tracking-widest text-brand-gold">Corporate Gifting</span>
          <p className="text-sm text-gray-500 font-medium">Premium sets for your valued partners.</p>
         </div>
         <div className="w-px h-12 bg-white/10 hidden md:block" />
         <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black tracking-widest text-brand-gold">Wedding Suites</span>
          <p className="text-sm text-gray-500 font-medium">Bespoke scents for your special day.</p>
         </div>
        </div>
        <Link href="/contact" className="w-full md:w-auto px-16 py-6 bg-brand-gold text-white rounded-none font-black tracking-widest text-sm shadow-2xl shadow-brand-gold/20 hover:scale-105 transition-all inline-block text-center">
         Consult a Curator
        </Link>
       </div>

       <div className="relative aspect-square">
        <div className="absolute inset-0 bg-brand-gold/10 rounded-[64px] rotate-6" />
        <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-[64px] border border-white/10 relative overflow-hidden p-10 flex items-center justify-center">
         <div className="relative w-full h-full">
          <Image
           src="/brandImage/cat_gifts.png"
           alt="Bespoke Curation"
           fill
           className="object-cover rounded-[32px] opacity-40  group-hover:-0 transition-all duration-700"
          />
          <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-24 h-24 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center text-brand-gold border border-white/20 shadow-2xl">
            <HiGift size={40} />
           </div>
          </div>
         </div>
        </div>
       </div>
      </div>
     </section>
    </div>
   </main>

   <Footer />
  </div>
 );
};

export default GiftBoxesPage;
