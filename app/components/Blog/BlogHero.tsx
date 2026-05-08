"use client";

import React from "react";
import { motion } from "framer-motion";

export const BlogHero: React.FC = () => {
  return (
    <div className="relative w-full bg-neutral-900 pt-32 pb-20 overflow-hidden">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-gold/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-brand-gold/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-12 bg-brand-gold" />
            <span className="text-xs font-bold text-brand-gold uppercase tracking-[0.4em]">The Journal</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-outfit font-light text-white mb-8 leading-[1.1] tracking-tight">
            Olfactory <span className="font-bold italic">Stories</span> & Curated Insights
          </h1>
          
          <p className="text-lg md:text-xl font-outfit font-light text-gray-400 max-w-xl leading-relaxed">
            Delve into the art of perfumery, from historical origins to modern masterpiece curation. Your guide to the world of fine scents.
          </p>
        </motion.div>
      </div>
      
      {/* Subtle Bottom Border/Line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10" />
    </div>
  );
};
