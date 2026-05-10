"use client";

import React from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { HiQuestionMarkCircle, HiTruck, HiCreditCard, HiArrowPath, HiShieldCheck, HiChevronRight } from "react-icons/hi2";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { HiSearch } from "react-icons/hi";

const HelpCenterPage = () => {
 const categories = [
  {
   title: "Getting Started",
   icon: <HiQuestionMarkCircle size={28} />,
   links: ["Set up your account", "First-time shopping", "Member benefits"],
   color: "bg-gray-50 text-black"
  },
  {
   title: "Shipping & Delivery",
   icon: <HiTruck size={28} />,
   links: ["Delivery timelines", "Free shipping policy", "International rates"],
   color: "bg-emerald-50 text-emerald-600",
   href: "/shipping"
  },
  {
   title: "Payments & Pricing",
   icon: <HiCreditCard size={28} />,
   links: ["Accepted methods", "Currency options", "Voucher codes"],
   color: "bg-purple-50 text-purple-600",
   href: "/help/payment"
  },
  {
   title: "Returns & Refunds",
   icon: <HiArrowPath size={28} />,
   links: ["Return policy", "Refund timelines", "Exchanges"],
   color: "bg-rose-50 text-rose-600",
   href: "/refund"
  }
 ];

 const popularFaqs = [
  { text: "How do I track my atmospheric fragrance delivery?", href: "/help/tracking" },
  { text: "What is the Bloom & Mist 'Sourced with Soul' guarantee?", href: "/help/cookies" },
  { text: "Can I cancel my artisanal gift set order?", href: "/help/cancel" },
  { text: "How to manage my cookie and privacy preferences?", href: "/help/cookies" }
 ];

 return (
  <div className="min-h-screen !bg-white flex flex-col font-sans text-black">
   <Header />

   <main className="flex-1 w-full !bg-white ">
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 flex flex-col gap-12 md:gap-24">
     {/* Help Center Hero */}
     <section className="relative pt-10 pb-12  md:pb-20 bg-white overflow-hidden">

      <div className=" relative z-10">
       <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col gap-8"
       >
        <div className="flex flex-col gap-4">
         <span className="text-brand-gold font-black tracking-[0.4em] text-xs">Support Concierge</span>
         <h1 className="text-4xl md:text-7xl font-black text-black tracking-tighter leading-none font-inter">
          How can we <br /><span className="text-brand-gold">help you?</span>
         </h1>
        </div>

       </motion.div>
      </div>
     </section>

     {/* Category Grid */}
     <section className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
       {categories.map((cat, i) => (
        <motion.div
         key={i}
         initial={{ opacity: 0, scale: 0.95 }}
         whileInView={{ opacity: 1, scale: 1 }}
         viewport={{ once: true }}
         transition={{ delay: i * 0.1 }}
         className="bg-white p-8 rounded-[32px] border border-gray-200   hover:shadow-2xl hover:-translate-y-2 transition-all group lg:aspect-square flex flex-col justify-between"
        >
         <div>
          <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center mb-6`}>
           {cat.icon}
          </div>
          <h3 className="text-xl font-black text-black mb-4">{cat.title}</h3>
          <div className="flex flex-col gap-2">
           {cat.links.map((link, j) => (
            <span key={j} className="text-sm text-gray-500 font-medium hover:text-brand-gold cursor-pointer transition-colors">{link}</span>
           ))}
          </div>
         </div>
         <Link href={cat.href || "#"} className="mt-8 flex items-center justify-between text-xs font-black tracking-widest text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity">
          View More <HiChevronRight size={16} />
         </Link>
        </motion.div>
       ))}
      </div>

      {/* Popular FAQs Section */}
      <div className="mt-24 md:mt-40 grid grid-cols-1 lg:grid-cols-2 gap-20">
       <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
         <span className="text-brand-gold font-bold tracking-[0.2em] text-xs">Discovery</span>
         <h2 className="text-4xl font-black text-black tracking-tight">Trending Questions.</h2>
        </div>
        <div className="flex flex-col gap-4">
         {popularFaqs.map((faq, i) => (
          <Link key={i} href={(faq as any).href}>
           <div className="p-6 bg-gray-50 border border-transparent hover:border-brand-gold hover:bg-white rounded-2xl cursor-pointer transition-all flex items-center justify-between group">
            <span className="text-gray-600 font-medium group-hover:text-black">{(faq as any).text}</span>
            <HiChevronRight className="text-gray-300 group-hover:text-brand-gold group-hover:translate-x-1 transition-all" />
           </div>
          </Link>
         ))}
        </div>
       </div>

       <div className="bg-gray-50 border border-gray-100 rounded-[48px] p-10 md:p-16 flex flex-col justify-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold rounded-full filter blur-[100px] opacity-10 translate-x-1/2 -translate-y-1/2" />
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-brand-gold">
         <HiShieldCheck size={32} />
        </div>
        <h3 className="text-3xl font-black text-black leading-tight">Can't find the <br /><span className="text-brand-gold">answer?</span></h3>
        <p className="text-gray-400 text-lg">Our artisanal support curators are available from 9am to 6pm for a personalized consultation.</p>
        <div className="pt-4">
         <Link href="/contact" className="px-12 py-5 bg-brand-gold text-white rounded-2xl font-black tracking-widest text-sm shadow-2xl shadow-black/20 hover:scale-105 transition-all inline-block">
          Talk to a Human
         </Link>
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

export default HelpCenterPage;
