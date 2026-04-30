"use client";

import React from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { HiTruck, HiGlobeAlt, HiPaperAirplane, HiCube, HiMapPin, HiCheckCircle, HiClock } from "react-icons/hi2";
import { motion } from "framer-motion";
import Image from "next/image";

const ShippingPage = () => {
  const methods = [
    {
      title: "Standard Home Delivery",
      time: "3 - 5 Business Days",
      cost: "Calculated at checkout",
      desc: "Reliable and cost-effective delivery for your everyday Bloom & Mist essentials.",
      icon: <HiTruck size={28} />
    },
    {
      title: "Priority Express",
      time: "1 - 2 Business Days",
      cost: "Premium distance-based",
      desc: "When timing is tight. Accelerated fulfillment and direct-to-door priority handling.",
      icon: <HiPaperAirplane size={28} />
    },
    {
      title: "Global Bloom Shipping",
      time: "7 - 14 Business Days",
      cost: "International flat-rates",
      desc: "Delivering the Mist experience to 50+ countries with full customs orchestration.",
      icon: <HiGlobeAlt size={28} />
    }
  ];

  const regionalEstimates = [
    { region: "Local (Mainland)", days: "1-2 Days" },
    { region: "Regional Central", days: "3-4 Days" },
    { region: "Remote Territories", days: "5-7 Days" },
    { region: "International", days: "7-14 Days" },
  ];

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-sans text-black">
      <Header />

      <main className="flex-1 w-full bg-white">
        {/* Step 74: Global Logistics Hero section */}
        <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 bg-[#1D3557] overflow-hidden">
          <Image
            src="/brandImage/shipping_banner.png"
            alt="Shipping Banner"
            fill
            className="object-cover opacity-100"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1D3557] via-[#1D3557]/80 to-transparent" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold rounded-full filter blur-[140px] opacity-10 translate-x-1/2 -translate-y-1/2" />

          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center gap-3">
                <span className="w-10 h-1 bg-brand-gold rounded-full" />
                <span className="text-brand-gold font-bold tracking-[0.3em] uppercase text-xs">Global Logistics</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter font-inter leading-none">
                Delivering Excellence <br />to Your <span className="text-[#8CB7F5]">Doorstep.</span>
              </h1>
              <p className="text-blue-100/60 max-w-2xl text-base md:text-xl leading-relaxed font-medium">
                Bloom & Mist partners with top-tier global carriers to ensure your products arrive in pristine condition, no matter where you are in the world.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Step 75: Build Shipping Methods and Timeline grid */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {methods.map((method, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-[40px] border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col h-full"
              >
                <div className="w-16 h-16 bg-brand-gold-light rounded-3xl flex items-center justify-center text-brand-gold mb-8 group-hover:bg-brand-gold group-hover:text-white transition-colors duration-500">
                  {method.icon}
                </div>
                <h3 className="text-2xl font-black text-[#1D3557] mb-4">{method.title}</h3>
                <div className="flex flex-col gap-1 mb-6">
                  <div className="flex items-center gap-2 text-brand-gold">
                    <HiClock />
                    <span className="text-sm font-bold uppercase tracking-widest">{method.time}</span>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{method.cost}</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow">
                  {method.desc}
                </p>
                <div className="pt-6 border-t border-gray-50 mt-auto">
                  <ul className="flex flex-col gap-3">
                    <li className="flex items-center gap-2 text-xs font-bold text-gray-400">
                      <HiCheckCircle className="text-emerald-500" /> Doorstep Delivery
                    </li>
                    <li className="flex items-center gap-2 text-xs font-bold text-gray-400">
                      <HiCheckCircle className="text-emerald-500" /> Real-time Tracking
                    </li>
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 flex flex-col lg:flex-row gap-12 items-center bg-gray-50 rounded-[40px] p-10 md:p-16 border border-gray-200">
            <div className="flex-1 flex flex-col gap-6">
              <h2 className="text-3xl font-black text-[#1D3557] tracking-tight">Regional Estimates</h2>
              <p className="text-gray-500 leading-relaxed">
                While we strive for maximum speed, delivery times may vary based on seasonal demand and local logistics orchestration in your specific territory.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {regionalEstimates.map((region, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{region.region}</span>
                    <span className="font-black text-[#1D3557] text-xl">{region.days}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-[400px] aspect-square relative rounded-3xl overflow-hidden shadow-xl">
              <Image src="/brandImage/regional_visual.png" alt="Distribution Center" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 400px" />
            </div>
          </div>
        </section>

        {/* Step 76: Implement Tracking Journey and Packaging commitments */}
        <section className="bg-[#1D3557] py-24 md:py-32 relative overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <span className="text-brand-gold font-bold tracking-[0.2em] uppercase text-xs">Stay Connected</span>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">Follow Your Bloom <br />Every Step of the Way.</h2>
              </div>

              <div className="flex flex-col gap-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-brand-gold shrink-0">
                    <HiMapPin size={24} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-bold text-white text-lg">Intelligent Notifications</h4>
                    <p className="text-blue-100/40 text-sm leading-relaxed">Receive SMS and Email updates the moment your package reaches a new milestone.</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-brand-gold shrink-0">
                    <HiCube size={24} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-bold text-white text-lg">Secure Packaging</h4>
                    <p className="text-blue-100/40 text-sm leading-relaxed">All products are shipped in eco-friendly, reinforced Bloom & Mist packaging for maximum protection.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button className="bg-brand-gold text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-blue-500/20 hover:scale-105 transition-all">
                  Track My Order
                </button>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-brand-gold/20 rounded-[50px] blur-2xl group-hover:bg-brand-gold/30 transition-all" />
              <div className="relative rounded-[40px] overflow-hidden border border-white/10 aspect-video shadow-2xl">
                <Image src="/web_images/Mask group copy 3.png" alt="Tracking Visual" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D3557]/80 to-transparent flex items-end p-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold">Real-time Dashboard</span>
                    <p className="text-white text-sm font-medium">Precision tracking available for all shipments.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Anchor CTA */}
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-[1440px] mx-auto px-6 text-center">
            <h2 className="text-3xl font-black text-[#1D3557] mb-6 tracking-tight">Still have shipping questions?</h2>
            <p className="text-gray-500 mb-10 max-w-xl mx-auto italic">Learn more about customs, local duties, and carrier-specific policies in our Help Center.</p>
            <button
              onClick={() => window.location.href = '/faq'}
              className="px-10 py-4 bg-gray-50 border border-gray-200 rounded-xl text-[#1D3557] font-black uppercase tracking-widest text-xs hover:bg-white hover:border-brand-gold hover:text-brand-gold transition-all"
            >
              Visit Help Center
            </button>
          </div>
        </section>
      </main>


      <Footer />
    </div>
  );
};

export default ShippingPage;
