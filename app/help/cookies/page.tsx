"use client";

import React, { useState } from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { HiShieldCheck, HiFingerPrint, HiAdjustmentsHorizontal, HiChartBar, HiShoppingCart, HiLockClosed } from "react-icons/hi2";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/app/components/Button";

const CookiePreferencesPage = () => {
 const [preferences, setPreferences] = useState({
  essential: true, // Always true
  functional: true,
  analytics: false,
  marketing: false,
 });

 const togglePreference = (key: keyof typeof preferences) => {
  if (key === 'essential') return;
  setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
 };

 const cookieTypes = [
  {
   id: "essential",
   title: "Strictly Essential",
   desc: "These cookies are vital for the core orchestration of the Bloom & Mist experience, including secure authentication and cart persistence.",
   icon: <HiLockClosed size={24} />,
   required: true
  },
  {
   id: "functional",
   title: "Functional Preference",
   desc: "Enables specialized features like sensory discovery history and regional language synchronization for a tailored boutique experience.",
   icon: <HiAdjustmentsHorizontal size={24} />,
   required: false
  },
  {
   id: "analytics",
   title: "Performance Discovery",
   desc: "Anonymous tracking that allows our curation team to understand platform trajectories and optimize high-fidelity visual performance.",
   icon: <HiChartBar size={24} />,
   required: false
  },
  {
   id: "marketing",
   title: "Bespoke Targeting",
   desc: "Allows us to present you with artisanal collections and designer offers that align with your unique sensory profile.",
   icon: <HiFingerPrint size={24} />,
   required: false
  }
 ];

 return (
  <div className="min-h-screen !bg-white flex flex-col font-sans text-black">
   <Header />

   <main className="flex-1 w-full !bg-white py-8 md:py-12">
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 flex flex-col gap-12 md:gap-24">
     {/* Privacy Hero */}
     <section className="relative pt-10 pb-12  md:pb-20 bg-white overflow-hidden">

      <div className="relative z-10">
       <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col gap-6"
       >
        <span className="text-brand-gold font-black tracking-[0.4em] text-xs">Privacy Orchestration</span>
        <h1 className="text-4xl md:text-7xl font-black text-black tracking-tighter leading-none font-inter">
         Cookie <br /><span className="text-brand-gold">Preferences.</span>
        </h1>
        <p className="text-gray-500 max-w-2xl text-lg md:text-xl font-medium">
         Your digital footprint is as unique as your sensory profile. At Bloom & Mist, we prioritize your data sovereignty with artisanal precision.
        </p>
       </motion.div>
      </div>
     </section>

     <section className="">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
       {/* Policy Narrative */}
       <div className="lg:col-span-5 flex flex-col gap-10">
        <div className="flex flex-col gap-6">
         <h2 className="text-3xl md:text-5xl font-black text-black tracking-tight">Our Integrity.</h2>
         <p className="text-gray-500 leading-relaxed text-lg">
          We use cookies to ensure that your journey through the Bloom & Mist ecosystem is seamless, secure, and personalized. You have absolute control over which non-essential technologies materialize during your visit.
         </p>
        </div>

        <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 flex flex-col gap-6">
         <div className="flex items-center gap-4 text-brand-gold">
          <HiShieldCheck size={32} />
          <h4 className="text-xl font-black text-black">Data Sovereignty</h4>
         </div>
         <p className="text-sm text-gray-500 leading-relaxed">
          All personal data is encrypted and handled in strict accordance with global privacy frameworks, including GDPR and CCPA.
         </p>
        </div>
       </div>

       {/* Interactive Preference Control */}
       <div className="lg:col-span-7 bg-white border border-gray-200 rounded-[48px]   overflow-hidden">
        <div className="p-8 md:p-12 flex flex-col gap-10">
         {cookieTypes.map((cookie, i) => (
          <div key={cookie.id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-10 border-b border-gray-50 last:border-0 last:pb-0">
           <div className="flex items-start gap-6 flex-1">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-black shrink-0">
             {cookie.icon}
            </div>
            <div className="flex flex-col gap-1">
             <h4 className="font-black text-black tracking-tighter">{cookie.title}</h4>
             <p className="text-xs text-gray-400 leading-relaxed max-w-md">{cookie.desc}</p>
            </div>
           </div>
           <div className="flex items-center gap-4">
            {cookie.required ? (
             <span className="text-[10px] font-black tracking-widest text-brand-gold bg-brand-gold-light px-4 py-2 rounded-full">Required</span>
            ) : (
             <button
              onClick={() => togglePreference(cookie.id as keyof typeof preferences)}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${preferences[cookie.id as keyof typeof preferences] ? 'bg-brand-gold' : 'bg-gray-200'}`}
             >
              <motion.div
               animate={{ x: preferences[cookie.id as keyof typeof preferences] ? 28 : 4 }}
               className="absolute top-1 left-0 w-6 h-6 bg-white rounded-full  "
              />
             </button>
            )}
           </div>
          </div>
         ))}
        </div>

        <div className="bg-gray-100/50 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gray-200">
         <p className="text-xs text-gray-500 font-medium">Your preferences are synchronized in real-time.</p>
         <div className="flex gap-4 w-full md:w-auto">
          <Button variant="ghost" className="flex-1 md:flex-none border-gray-200 text-black px-10 h-14 font-black tracking-widest text-sm">
           Reject All
          </Button>
          <Button variant="primary" className="flex-1 md:flex-none bg-black text-white px-10 h-14 font-black tracking-widest text-sm">
           Accept All
          </Button>
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

export default CookiePreferencesPage;
