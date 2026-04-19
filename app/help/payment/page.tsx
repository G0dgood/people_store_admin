"use client";

import React from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { HiShieldCheck, HiCreditCard, HiGlobeAlt, HiBanknotes, HiCheckBadge, HiLockClosed } from "react-icons/hi2";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/components/Button";

const PaymentOptionsPage = () => {
 const paymentMethods = [
  {
   title: "Traditional Orchestration",
   desc: "We accept all major high-fidelity cards including Visa, MasterCard, and American Express, processed with 256-bit encryption.",
   icon: <HiCreditCard size={28} />
  },
  {
   title: "Digital Currencies",
   desc: "For the modern collector, we support direct artisanal transfers via Bitcoin and Ethereum, materializing instant transaction finality.",
   icon: <HiGlobeAlt size={28} />
  },
  {
   title: "Concierge Billing",
   desc: "Patrons with custom procurement accounts may opt for wire orchestration or monthly boutique billing for high-volume acquisitions.",
   icon: <HiBanknotes size={28} />
  }
 ];

 return (
  <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-sans text-black">
   <Header />

   <main className="flex-1 w-full bg-white">
    {/* Secure Orchestration Hero */}
    <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 bg-[#1D3557] overflow-hidden">
     <Image
      src="/brandImage/shipping_banner.png"
      alt="Secure Payments"
      fill
      className="object-cover opacity-100 grayscale brightness-[0.4]"
      priority
     />
     <div className="absolute inset-0 bg-gradient-to-r from-[#1D3557] via-[#1D3557]/80 to-transparent" />

     <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
      <motion.div
       initial={{ opacity: 0, x: -30 }}
       animate={{ opacity: 1, x: 0 }}
       transition={{ duration: 0.7 }}
       className="flex flex-col gap-6"
      >
       <span className="text-brand-blue font-black tracking-[0.4em] uppercase text-xs">Security Framework</span>
       <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none font-inter">
        Secure <br /><span className="text-[#8CB7F5]">Orchestration.</span>
       </h1>
       <p className="text-blue-100/60 max-w-2xl text-lg md:text-xl font-medium">
        Your transactional integrity is our highest priority. We employ high-fidelity encryption and artisanal fraud prevention to ensure every acquisition is flawless and protected.
       </p>
      </motion.div>
     </div>
    </section>

    <section className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-24 md:py-32">
     {/* Payment Grid */}
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {paymentMethods.map((method, i) => (
       <motion.div
        key={i}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.1 }}
        className="bg-white p-10 rounded-[40px] border border-gray-200 shadow-sm hover:shadow-2xl transition-all group"
       >
        <div className="w-16 h-16 bg-brand-blue-light rounded-3xl flex items-center justify-center text-brand-blue mb-8 group-hover:bg-brand-blue group-hover:text-white transition-colors duration-500">
         {method.icon}
        </div>
        <h3 className="text-2xl font-black text-[#1D3557] mb-4">{method.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">
         {method.desc}
        </p>
       </motion.div>
      ))}
     </div>

     {/* Encryption Details Area */}
     <div className="mt-24 md:mt-40 bg-gray-50 rounded-[64px] p-10 md:p-24 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full filter blur-[100px] translate-x-1/2 -translate-y-1/2" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
       <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
         <span className="text-brand-blue font-bold tracking-[0.2em] uppercase text-xs">Technical Integrity</span>
         <h2 className="text-3xl md:text-5xl font-black text-[#1D3557] tracking-tight leading-tight">Artisanal Encryption <br />Standards.</h2>
        </div>
        <p className="text-gray-500 text-lg leading-relaxed">
         Every transaction within the Bloom & Mist ecosystem is materialized through a 256-bit SSL encrypted tunnel. We do not store raw payment credentials, utilizing high-fidelity tokenization to ensure the absolute sanctity of your financial data.
        </p>
        <div className="flex flex-wrap gap-6 pt-4">
         <div className="flex items-center gap-3 text-[#1D3557]">
          <HiLockClosed className="text-brand-blue" size={24} />
          <span className="text-xs font-black uppercase tracking-widest">SSL Secure</span>
         </div>
         <div className="flex items-center gap-3 text-[#1D3557]">
          <HiCheckBadge className="text-brand-blue" size={24} />
          <span className="text-xs font-black uppercase tracking-widest">PCI Compliant</span>
         </div>
        </div>
       </div>

       <div className="flex flex-col gap-8 bg-[#1D3557] p-10 md:p-12 rounded-[48px] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full filter blur-[60px] group-hover:scale-110 transition-transform duration-700" />
        <div className="flex items-center gap-4 text-[#8CB7F5] relative z-10">
         <HiShieldCheck size={32} />
         <h4 className="text-xl font-black text-white">Patron Assurance</h4>
        </div>
        <p className="text-sm text-blue-100/60 leading-relaxed italic relative z-10">
         "We understand that luxury discovery requires absolute peace of mind. Our billing curators work tirelessly behind the scenes to monitor transaction integrity, ensuring that your journey from curation to acquisition is as secure as it is seamless."
        </p>
        <div className="flex items-center gap-3 relative z-10">
         <div className="w-10 h-10 rounded-full bg-brand-blue" />
         <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-[#8CB7F5] tracking-widest">Chief Security Officer</span>
          <span className="text-[10px] text-white/40 font-medium">Boutique Compliance Suite</span>
         </div>
        </div>
       </div>
      </div>
     </div>
    </section>
   </main>


   <Footer />
  </div>
 );
};

export default PaymentOptionsPage;
