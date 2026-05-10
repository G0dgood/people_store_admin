"use client";

import React from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { HiArrowPath, HiShieldCheck, HiCurrencyDollar, HiCheckBadge, HiChatBubbleLeftRight } from "react-icons/hi2";
import { motion } from "framer-motion";
import { Button } from "@/app/components/Button";

const RefundPolicyPage = () => {
 const refundSteps = [
  {
   title: "Initiate Return",
   desc: "Connect with our curation team within 14 days of delivery to materialize your return orchestration.",
   icon: <HiArrowPath size={24} />
  },
  {
   title: "Artisanal Inspection",
   desc: "Our quality curators verify the pristine condition and original sensory packaging of your return.",
   icon: <HiShieldCheck size={24} />
  },
  {
   title: "Final Rebursement",
   desc: "Once authenticated, your original payment method is credited within 3-5 business days.",
   icon: <HiCurrencyDollar size={24} />
  }
 ];

 return (
  <div className="min-h-screen !bg-white flex flex-col font-sans text-black">
   <Header />

   <main className="flex-1 w-full !bg-white py-8 md:py-12">
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 flex flex-col gap-12 md:gap-24">
     {/* Refund Hero section */}
     <section className="relative pt-10 pb-12  md:pb-20 bg-white overflow-hidden">

      <div className="relative z-10">
       <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col gap-6"
       >
        <span className="text-brand-gold font-black tracking-[0.4em] text-xs">Satisfaction Guarantee</span>
        <h1 className="text-4xl md:text-7xl font-black text-black tracking-tighter font-inter leading-none">
         Refund <br /><span className="text-brand-gold">Integrity.</span>
        </h1>
        <p className="text-gray-500 max-w-2xl text-lg md:text-xl font-medium">
         We stand by the artisanal quality of our collection. If your acquisition does not materialize your expectations, our refund protocol ensures a seamless resolution.
        </p>
       </motion.div>
      </div>
     </section>

     <section className="">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
       {refundSteps.map((step, i) => (
        <motion.div
         key={i}
         initial={{ opacity: 0, y: 30 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         transition={{ delay: i * 0.1 }}
         className="flex flex-col gap-6 p-8 bg-gray-50 rounded-[32px] border border-gray-100 group hover:bg-white hover:border-brand-gold hover:shadow-2xl transition-all"
        >
         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-gold shadow-sm group-hover:bg-brand-gold group-hover:text-white transition-colors">
          {step.icon}
         </div>
         <div className="flex flex-col gap-2">
          <h3 className="text-xl font-black text-black">{step.title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
         </div>
        </motion.div>
       ))}
      </div>

      <div className="mt-24 md:mt-40 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
       <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
         <span className="text-brand-gold font-bold tracking-[0.2em] text-xs">Policy Framework</span>
         <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight">Artisanal Returns.</h2>
        </div>
        <div className="space-y-6">
         <div className="flex items-start gap-4">
          <HiCheckBadge className="text-brand-gold mt-1 shrink-0" size={24} />
          <div className="flex flex-col gap-1">
           <h4 className="font-bold text-black">14-Day Window</h4>
           <p className="text-gray-500 text-sm leading-relaxed">Requests must be materialized within 14 calendar days of fulfillment receipt for a full orchestration of refund.</p>
          </div>
         </div>
         <div className="flex items-start gap-4">
          <HiCheckBadge className="text-brand-gold mt-1 shrink-0" size={24} />
          <div className="flex flex-col gap-1">
           <h4 className="font-bold text-black">Original Preservation</h4>
           <p className="text-gray-500 text-sm leading-relaxed">Products must remain in their original artisanal packaging, unopened and unused to maintain sensory integrity.</p>
          </div>
         </div>
         <div className="flex items-start gap-4">
          <HiCheckBadge className="text-brand-gold mt-1 shrink-0" size={24} />
          <div className="flex flex-col gap-1">
           <h4 className="font-bold text-black">Global Support</h4>
           <p className="text-gray-500 text-sm leading-relaxed">Our logistics network handles returns from all regions, though local duty fees may be excluded from the final refund.</p>
          </div>
         </div>
        </div>
       </div>

       <div className="bg-gray-50 border border-gray-100 rounded-[48px] p-10 md:p-16 flex flex-col gap-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold rounded-full filter blur-[100px] opacity-10 translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-1000" />
        <div className="flex items-center gap-4 text-brand-gold">
         <HiChatBubbleLeftRight size={32} />
         <h4 className="text-xl font-black text-white">Concierge Support</h4>
        </div>
        <p className="text-gray-400 text-lg leading-relaxed">
         Need specialized assistance with your return? Our curation curators are ready to orchestrate a seamless resolution for your artisanal acquisition.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row gap-4">
         <Button
          onClick={() => window.location.href = '/contact'}
          variant="primary"
          className="bg-brand-gold text-white px-10 h-14 font-black tracking-widest text-xs shadow-2xl shadow-black/40"
         >
          Initiate Return
         </Button>
         <Button
          variant="ghost"
          className="text-white border-white/20 px-10 h-14 font-black tracking-widest text-xs"
         >
          Live Consultation
         </Button>
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

export default RefundPolicyPage;
