"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Button } from "@/app/components/Button";
import { Input, Textarea } from "@/app/components/Form/Inputs";
import { HiCreditCard, HiSparkles, HiCheckBadge, HiGift } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import { useBuyGiftCardMutation } from "@/lib/redux/services/giftCardApi";
import { toast } from "sonner";

const GiftCardPurchasePage = () => {
 const [buyGiftCard, { isLoading }] = useBuyGiftCardMutation();
 const [isGift, setIsGift] = useState(false);
 const [formData, setFormData] = useState({
  amount: 5000,
  color: "#1D3557",
  recipientName: "",
  recipientEmail: "",
  message: ""
 });

 const amounts = [5000, 10000, 25000, 50000, 100000];
 const colors = [
  { name: "Midnight Navy", value: "#1D3557" },
  { name: "Royal Purple", value: "#2D1B4D" },
  { name: "Forest Green", value: "#0A2F1F" },
  { name: "Deep Crimson", value: "#3D0C11" },
  { name: "Onyx Black", value: "#0F172A" }
 ];

 const handlePurchase = async () => {
  try {
   const data = {
    amount: formData.amount,
    color: formData.color,
    ...(isGift && {
     recipientName: formData.recipientName,
     recipientEmail: formData.recipientEmail,
     message: formData.message
    })
   };
   await buyGiftCard(data).unwrap();
   toast.success("Gift card purchased successfully!");
  } catch (error: any) {
   toast.error(error?.data?.message || "Purchase failed");
  }
 };

 return (
  <div className="min-h-screen bg-white flex flex-col font-sans">
   <Header />

   <main className="flex-1">
    {/* Hero Section */}
    <section className="bg-brand-charcoal py-20 relative overflow-hidden">
     <div className="absolute inset-0 opacity-10">
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-gold rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-gold rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
     </div>

     <div className="max-w-[1440px] mx-auto px-6 lg:px-16 relative z-10">
      <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
       <span className="text-brand-gold font-black tracking-[0.4em] uppercase text-xs">The Gift of Choice</span>
       <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight">
        Give a <span className="text-brand-gold">Masterpiece.</span>
       </h1>
       <p className="text-white/60 text-lg md:text-xl font-medium leading-relaxed">
        Perfect for any occasion. Our digital prepaid cards unlock the entire boutique collection, from artisanal mists to curated gift boxes.
       </p>
      </div>
     </div>
    </section>

    <section className="py-24 max-w-[1440px] mx-auto px-6 lg:px-16">
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

      {/* Interactive Card Preview */}
      <div className="sticky top-32">
       <motion.div
        layout
        className="aspect-[1.6/1] w-full rounded-[24px] p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden group transition-all duration-700"
        style={{ backgroundColor: formData.color }}
       >
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />

        <div className="flex justify-between items-start relative z-10">
         <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em]">Boutique Credit</span>
          <HiCreditCard size={48} className="text-white/20 mt-2" />
         </div>
         <div className="text-right">
          <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Prepaid Card</span>
         </div>
        </div>

        <div className="relative z-10">
         <div className="flex items-baseline gap-2">
          <span className="text-brand-gold text-2xl font-black">₦</span>
          <span className="text-5xl md:text-7xl font-black text-white tracking-tighter">
           {formData.amount.toLocaleString()}
          </span>
         </div>
         <div className="mt-4 flex items-center gap-2">
          <HiCheckBadge className="text-brand-gold" size={20} />
          <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Valid Storewide</span>
         </div>
        </div>
       </motion.div>

       <div className="mt-12 flex flex-col gap-6">
        <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
         <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-charcoal">
          <HiSparkles size={24} />
         </div>
         <div>
          <h4 className="text-sm font-black text-brand-charcoal uppercase tracking-widest">Instant Delivery</h4>
          <p className="text-xs text-gray-500 font-medium">Digital code sent immediately after purchase.</p>
         </div>
        </div>
        <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
         <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-charcoal">
          <HiGift size={24} />
         </div>
         <div>
          <h4 className="text-sm font-black text-brand-charcoal uppercase tracking-widest">No Expiry</h4>
          <p className="text-xs text-gray-500 font-medium">Balance stays valid for as long as you need.</p>
         </div>
        </div>
       </div>
      </div>

      {/* Selection Form */}
      <div className="flex flex-col gap-12">
       <div className="flex flex-col gap-6">
        <label className="text-xs font-black text-brand-charcoal uppercase tracking-widest">1. Select Denomination</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
         {amounts.map((amt) => (
          <button
           key={amt}
           onClick={() => setFormData({ ...formData, amount: amt })}
           className={`py-4 px-6 rounded-xl border-2 font-black transition-all ${formData.amount === amt ? "border-brand-gold bg-brand-gold/5 text-brand-charcoal scale-105 shadow-lg" : "border-gray-100 text-gray-400 hover:border-gray-200"}`}
          >
           ₦{amt.toLocaleString()}
          </button>
         ))}
        </div>
       </div>

       <div className="flex flex-col gap-6">
        <label className="text-xs font-black text-brand-charcoal uppercase tracking-widest">2. Choose Card Aesthetic</label>
        <div className="flex flex-wrap gap-4">
         {colors.map((color) => (
          <button
           key={color.value}
           onClick={() => setFormData({ ...formData, color: color.value })}
           className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center ${formData.color === color.value ? "border-brand-gold scale-125 shadow-lg" : "border-transparent hover:scale-110"}`}
           style={{ backgroundColor: color.value }}
           title={color.name}
          >
           {formData.color === color.value && <div className="w-2 h-2 rounded-full bg-brand-gold" />}
          </button>
         ))}
        </div>
       </div>

       <div className="flex flex-col gap-8 p-10 bg-brand-charcoal rounded-[32px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-gold/5 rounded-full blur-3xl" />

        <div className="flex flex-col gap-4 relative z-10">
         <label className="text-xs font-black text-brand-gold uppercase tracking-[0.2em]">3. Delivery Options</label>
         <div className="flex gap-4">
          <button
           onClick={() => setIsGift(false)}
           className={`flex-1 py-4 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] border transition-all ${!isGift ? "bg-brand-gold text-brand-charcoal border-brand-gold shadow-lg shadow-brand-gold/20" : "bg-white/5 text-white/40 border-white/10 hover:border-white/20"}`}
          >
           For Myself
          </button>
          <button
           onClick={() => setIsGift(true)}
           className={`flex-1 py-4 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] border transition-all ${isGift ? "bg-brand-gold text-brand-charcoal border-brand-gold shadow-lg shadow-brand-gold/20" : "bg-white/5 text-white/40 border-white/10 hover:border-white/20"}`}
          >
           For Someone Else
          </button>
         </div>
        </div>

        <AnimatePresence mode="wait">
         {isGift && (
          <motion.div
           initial={{ opacity: 0, height: 0 }}
           animate={{ opacity: 1, height: "auto" }}
           exit={{ opacity: 0, height: 0 }}
           className="flex flex-col gap-6 relative z-10"
          >
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
             <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Recipient Name</label>
             <input
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-sm font-bold focus:outline-none focus:border-brand-gold transition-all"
              placeholder="e.g. Sarah Jenkins"
              value={formData.recipientName}
              onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
             />
            </div>
            <div className="flex flex-col gap-2">
             <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Recipient Email</label>
             <input
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-sm font-bold focus:outline-none focus:border-brand-gold transition-all"
              placeholder="sarah@example.com"
              value={formData.recipientEmail}
              onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
             />
            </div>
           </div>
           <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Personalized Message</label>
            <textarea
             className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-sm font-bold focus:outline-none focus:border-brand-gold transition-all min-h-[120px] resize-none"
             placeholder="Wishing you a sensory experience like no other..."
             value={formData.message}
             onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
           </div>
          </motion.div>
         )}
        </AnimatePresence>

        <div className="pt-4 mt-2 relative z-10">
         <Button
          onClick={handlePurchase}
          isLoading={isLoading}
          className="w-full h-16 bg-brand-gold text-brand-charcoal font-black uppercase tracking-[0.2em] text-sm rounded-xl shadow-2xl shadow-brand-gold/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
         >
          Purchase Gift Card
         </Button>
         <p className="text-center text-[10px] text-white/30 font-bold uppercase tracking-widest mt-6">
          Secure Checkout • Powered by Bloom & Mist
         </p>
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

export default GiftCardPurchasePage;
