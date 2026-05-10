"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { HiHome, HiSparkles, HiChatBubbleLeftRight, HiChevronRight } from "react-icons/hi2";

export default function NotFound() {
  const particles = Array.from({ length: 15 });

  return (
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-[#121212]">
      {/* Immersive Background Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/brandImage/brand_banner.png"
          alt="Atmospheric Mist"
          fill
          className="object-cover blur-[20px] scale-110 opacity-60  brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/80 via-transparent to-[#121212]" />
      </div>

      {/* Floating Particles Micro-animations */}
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            opacity: 0
          }}
          animate={{
            y: [null, "-20%", "10%"],
            opacity: [0, 0.4, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
          className="absolute w-1 h-1 bg-brand-gold-light rounded-full blur-[1px] z-10"
        />
      ))}

      {/* Glassmorphism Central Hub */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 w-full max-w-[580px] px-6"
      >
        <div className="bg-white/5 backdrop-blur-3xl rounded-[64px] border border-white/10 p-10 md:p-16 flex flex-col items-center text-center gap-10 shadow-2xl">
          {/* Error Header */}
          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter text-white opacity-10 select-none"
            >
              404
            </motion.div>
            <div className="flex flex-col gap-2 -mt-16 md:-mt-24">
              <span className="text-brand-gold font-black tracking-[0.6em] uppercase text-xs">Environment Alert</span>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight font-inter">
                Lost in the <br /><span className="text-[var(--brand-gold-light)]">Mist.</span>
              </h1>
            </div>
          </div>

          <p className="text-gray-400 text-sm md:text-lg max-w-sm leading-relaxed font-medium">
            The discovery path you were following has vanished into the atmosphere. Our curators are tracking the anomaly.
          </p>

          {/* Recovery Nav Paths */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <Link href="/" className="group flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-brand-gold flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <HiHome size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">Home</span>
            </Link>

            <Link href="/brands" className="group flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-[var(--brand-gold-light)] flex items-center justify-center text-[#121212] shadow-lg group-hover:scale-110 transition-transform">
                <HiSparkles size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">Brands</span>
            </Link>

            <Link href="/contact" className="group flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-[#121212] shadow-lg group-hover:scale-110 transition-transform">
                <HiChatBubbleLeftRight size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">Support</span>
            </Link>
          </div>

          <Link href="/" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--brand-gold-light)] hover:text-white transition-all group">
            Teleport to Safety <HiChevronRight className="group-hover:translate-x-2 transition-transform" size={16} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
