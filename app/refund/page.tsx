"use client";

import React from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { HiShieldCheck, HiArrowPath, HiClock, HiReceiptRefund, HiExclamationCircle, HiCheckCircle } from "react-icons/hi2";
import { motion } from "framer-motion";
import Image from "next/image";
import { RefundRequestModal } from "../components/Refund/RefundRequestModal";

const RefundPage = () => {
  const [isRequestModalOpen, setIsRequestModalOpen] = React.useState(false);

  const steps = [
    { title: "Initiate Request", desc: "Contact support or use the 'Initiate Return' button in your account dashboard.", icon: <HiReceiptRefund size={24} /> },
    { title: "Quality Check", desc: "Ship the item back to our facility for a professional quality and condition inspection.", icon: <HiShieldCheck size={24} /> },
    { title: "Processing", desc: "Once approved, we initiate the refund process through your original payment method.", icon: <HiArrowPath size={24} /> },
    { title: "Refund Received", desc: "Funds typically appear in your account within 5-10 business days.", icon: <HiCheckCircle size={24} /> },
  ];

  const eligibility = [
    { title: "30-Day Window", desc: "Refund requests must be submitted within 30 days of the delivery date.", icon: <HiClock size={24} /> },
    { title: "Original Condition", desc: "Items must be unused, unwashed, and in their original packaging with all tags.", icon: <HiShieldCheck size={24} /> },
    { title: "Proof of Purchase", desc: "A valid order number or digital receipt is required to process any refund.", icon: <HiReceiptRefund size={24} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-sans text-black">
      <Header />

      <main className="flex-1 w-full bg-white">
        {/* Step 68: Trust Hero with policy branding */}
        <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 bg-[#1D3557] overflow-hidden">
          <Image
            src="/brandImage/regional_visual.png"
            alt="Refund Banner"
            fill
            className="object-cover opacity-100"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1D3557] via-[#1D3557]/80 to-transparent" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue rounded-full filter blur-[120px] opacity-20 translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8CB7F5] rounded-full filter blur-[100px] opacity-10 -translate-x-1/4 translate-y-1/4" />

          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-brand-blue shadow-2xl border border-white/10">
                <HiShieldCheck size={40} />
              </div>
              <div className="flex flex-col gap-3">
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter font-inter">
                  Transparent <span className="text-brand-blue">Refunds</span>
                </h1>
                <p className="text-blue-100/70 max-w-2xl text-base md:text-lg leading-relaxed font-medium mx-auto">
                  At Bloom & Mist, we believe in blooming relationships built on trust. Our 30-day money-back guarantee is designed to give you peace of mind with every purchase.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Step 69: Eligibility Grid and Rules section */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 flex flex-col gap-6">
              <span className="text-brand-blue font-bold tracking-[0.2em] uppercase text-xs">Policy Foundations</span>
              <h2 className="text-3xl md:text-4xl font-black text-[#1D3557] tracking-tight leading-tight">Eligibility <br />Criteria</h2>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                To ensure a fair process for all customers, we maintain standardized criteria for all refund requests. Please verify your item meets these conditions before initiating.
              </p>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {eligibility.map((item, i) => (
                <div key={i} className="bg-gray-50 p-8 rounded-3xl border border-gray-200 hover:border-brand-blue/30 transition-all group">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-blue shadow-sm mb-6 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h4 className="text-lg font-bold text-[#1D3557] mb-2">{item.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
              <div className="bg-[#E1EFFE] p-8 rounded-3xl flex items-center gap-5 border border-brand-blue/10">
                <HiExclamationCircle className="text-brand-blue shrink-0" size={32} />
                <p className="text-brand-blue text-sm font-bold leading-relaxed">
                  Non-refundable items include clearance products, open personal care items, and gift cards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Step 70: Implement Visual Refund Process Timeline */}
        <section className="bg-gray-50 py-24 md:py-32">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
            <div className="text-center mb-20 flex flex-col items-center gap-4">
              <h2 className="text-3xl md:text-5xl font-black text-[#1D3557] tracking-tight">How the process works</h2>
              <p className="text-gray-500 max-w-xl">A transparent, four-step journey from your request to the funds appearing in your account.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden lg:block absolute top-[52px] left-0 right-0 h-0.5 bg-gray-200 z-0" />

              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 group"
                >
                  <div className="w-24 h-24 rounded-full bg-white border-4 border-gray-50 shadow-xl flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
                    {step.icon}
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-brand-blue font-black text-xs uppercase tracking-[0.2em]">Step 0{i + 1}</span>
                    <h4 className="text-xl font-bold text-[#1D3557]">{step.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed px-4 lg:px-0">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-24 md:py-32">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
            <div className="w-full bg-[#E1EFFE] rounded-[40px] p-12 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full filter blur-[80px] -translate-x-1/2 -translate-y-1/2" />
              <div className="flex flex-col gap-4 relative z-10 text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-black text-[#1D3557] tracking-tight">Need to start a refund?</h2>
                <p className="text-brand-blue/80 font-medium">Our support team is ready to guide you through the process.</p>
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <button 
                  onClick={() => setIsRequestModalOpen(true)}
                  className="bg-brand-blue text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 hover:scale-105 transition-transform"
                >
                  Initiate Now
                </button>
                <button className="bg-white text-[#1D3557] px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs border border-blue-100 hover:bg-gray-50 transition-colors">
                  View Orders
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>


      <RefundRequestModal 
        isOpen={isRequestModalOpen} 
        onClose={() => setIsRequestModalOpen(false)} 
      />
      <Footer />
    </div>
  );
};

export default RefundPage;
