"use client";

import React, { useState } from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { HiMapPin, HiClock, HiCheckCircle, HiMagnifyingGlass, HiCubeTransparent, HiTruck } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Input } from "@/app/components/Form/Inputs";
import { Button } from "@/app/components/Button";

const TrackingPage = () => {
 const [orderId, setOrderId] = useState("");
 const [email, setEmail] = useState("");
 const [isTracking, setIsTracking] = useState(false);

 const handleTrack = (e: React.FormEvent) => {
  e.preventDefault();
  setIsTracking(true);
 };

 const trackingSteps = [
  { status: "Order Placed", time: "Oct 24, 10:30 AM", active: true, done: true },
  { status: "Processing", time: "Oct 24, 02:45 PM", active: true, done: true },
  { status: "Shipped", time: "Oct 25, 09:00 AM", active: true, done: false },
  { status: "In Transit", time: "Est. Oct 27", active: false, done: false },
  { status: "Out for Delivery", time: "Est. Oct 28", active: false, done: false },
 ];

 return (
  <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-sans text-black">
   <Header />

   <main className="flex-1 w-full bg-white">
    {/* Tracking Hero Section */}
    <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 bg-[#1D3557] overflow-hidden text-center md:text-left">
     <Image
      src="/brandImage/regional_visual.png"
      alt="Logistics Network"
      fill
      className="object-cover opacity-60 grayscale"
      priority
     />
     <div className="absolute inset-0 bg-gradient-to-r from-[#1D3557] via-[#1D3557]/90 to-transparent" />

     <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
      <motion.div
       initial={{ opacity: 0, x: -30 }}
       animate={{ opacity: 1, x: 0 }}
       transition={{ duration: 0.7 }}
       className="flex flex-col gap-6"
      >
       <span className="text-brand-gold font-black tracking-[0.4em] uppercase text-xs">Real-time Logistics</span>
       <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none font-inter">
        Follow Your <br /><span className="text-[#8CB7F5]">Journey.</span>
       </h1>
       <p className="text-blue-100/60 max-w-xl text-lg font-medium">
        Enter your order credentials to visualize the trajectory of your Bloom & Mist essentials from our curators to your door.
       </p>
      </motion.div>
     </div>
    </section>

    <section className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-20 md:py-32">
     <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 items-start">
      {/* Tracking Input Form */}
      <div className="lg:col-span-4 flex flex-col gap-10">
       <form onSubmit={handleTrack} className="flex flex-col gap-8 bg-gray-50 border border-gray-200 p-8 rounded-[6px] shadow-sm">
        <div className="flex flex-col gap-2">
         <label className="text-[10px] font-black uppercase tracking-widest text-[#1D3557] opacity-60">Order ID</label>
         <Input
          type="text"
          placeholder="e.g. #BM-123456"
          className="h-14 bg-white border-gray-200"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          required
         />
        </div>
        <div className="flex flex-col gap-2">
         <label className="text-[10px] font-black uppercase tracking-widest text-[#1D3557] opacity-60">Account Email</label>
         <Input
          type="email"
          placeholder="john@example.com"
          className="h-14 bg-white border-gray-200"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
         />
        </div>
        <Button
         type="submit"
         variant="primary"
         className="w-full h-14 bg-brand-gold text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-500/10"
        >
         Visualize Journey
        </Button>

        <button
          type="button"
          onClick={() => {
            setOrderId("#BM-882910");
            setEmail("guest@bloomandmist.com");
            setIsTracking(true);
          }}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold/60 hover:text-brand-gold transition-colors text-center w-full"
        >
          Try with Demo ID
        </button>
       </form>

       <div className="flex flex-col gap-6 text-sm text-gray-500 bg-blue-50/30 p-8 rounded-[32px] border border-blue-50">
        <div className="flex items-center gap-3 font-bold text-[#1D3557]">
         <HiCubeTransparent size={20} className="text-brand-gold" />
         <span>Packaging Note</span>
        </div>
        <p className="leading-relaxed">All Bloom & Mist orders are fortified in eco-friendly, artisan-textured packaging to ensure sensory preservation during transit.</p>
       </div>
      </div>

      {/* Visualization Result Area */}
      <div className="lg:col-span-8">
       <AnimatePresence mode="wait">
        {isTracking ? (
         <motion.div
          key="tracking-results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-12"
         >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-10">
           <div className="flex flex-col gap-1">
            <h3 className="text-3xl font-black text-[#1D3557] tracking-tight">Status: Shipped</h3>
            <p className="text-gray-400 font-medium">Estimated arrival: <span className="text-brand-gold">October 28, 2026</span></p>
           </div>
           <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-gold flex items-center justify-center text-white shadow-lg">
             <HiTruck size={28} />
            </div>
            <div className="flex flex-col">
             <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Courier</span>
             <span className="font-bold text-[#1D3557]">Global Express</span>
            </div>
           </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative pb-20">
           {/* Progress Line */}
           <div className="absolute top-6 left-6 right-6 h-1 bg-gray-100 hidden md:block" />
           <div className="absolute top-6 left-6 w-[40%] h-1 bg-brand-gold hidden md:block" />

           {trackingSteps.map((step, i) => (
            <div key={i} className={`flex md:flex-col items-center gap-4 md:gap-6 relative z-10 ${!step.active ? 'opacity-30' : ''}`}>
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors overflow-hidden ${step.done ? 'bg-brand-gold text-white' : 'bg-white text-gray-300 border border-gray-200'}`}>
              {step.done ? <HiCheckCircle size={24} /> : i + 1}
             </div>
             <div className="flex flex-col md:items-center md:text-center gap-1">
              <span className="font-black text-xs text-[#1D3557] uppercase tracking-tighter">{step.status}</span>
              <span className="text-[10px] text-gray-400 font-medium">{step.time}</span>
             </div>
            </div>
           ))}
          </div>

          <div className="bg-[#1D3557] rounded-[48px] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex flex-col gap-2 text-center md:text-left">
            <h4 className="text-2xl font-black text-white">Need a custom update?</h4>
            <p className="text-blue-100/40 font-medium">Connect with our logistics concierge for precise orchestration.</p>
           </div>
           <Button variant="ghost" className="text-white border-white/20 px-10 rounded-2xl h-14 font-black uppercase tracking-widest text-sm">
            Request Detail
           </Button>
          </div>
         </motion.div>
        ) : (
         <motion.div
          key="tracking-empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-[500px] border-2 border-dashed border-gray-200 rounded-[48px] flex flex-col items-center justify-center text-center p-12 gap-6"
         >
          <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
           <HiMagnifyingGlass size={48} />
          </div>
          <div className="flex flex-col gap-2">
           <h3 className="text-2xl font-black text-gray-400">Visualization Awaiting</h3>
           <p className="text-gray-300 max-w-sm font-medium">Enter your order ID and email to materialize the trajectory of your artisanal shipment.</p>
          </div>
         </motion.div>
        )}
       </AnimatePresence>
      </div>
     </div>
    </section>
   </main>


   <Footer />
  </div>
 );
};

export default TrackingPage;
