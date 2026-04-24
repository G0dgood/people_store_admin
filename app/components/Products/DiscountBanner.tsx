"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "../Button";
import { motion, AnimatePresence } from "framer-motion";

const BANNERS = [
  {
    id: 1,
    title: "Luxury Fragrance Exclusive",
    subtitle: "Up to 50% off on premium scents",
    image: "/web_images/luxury_perfume_exclusive_banner_1777030581224.png",
    buttonText: "Shop Now",
    bgColor: "#FF9017"
  },
  {
    id: 2,
    title: "Fresh Body Spray Collection",
    subtitle: "Buy 2 Get 1 Free on all body mists",
    image: "/web_images/body_spray_collection_banner_1777030504018.png",
    buttonText: "Claim Offer",
    bgColor: "#0D6EFD"
  },
  {
    id: 3,
    title: "The Oud Royal Collection",
    subtitle: "Special introductory prices on rare Oud",
    image: "/web_images/oud_fragrance_promo_banner_1777030520635.png",
    buttonText: "Discover",
    bgColor: "#8B5CF6"
  },
  {
    id: 4,
    title: "Premium Skincare Sets",
    subtitle: "30% discount on complete beauty rituals",
    image: "/web_images/skincare_set_discount_banner_1777030533843.png",
    buttonText: "View Sets",
    bgColor: "#10B981"
  },
  {
    id: 5,
    title: "Fragrance Discovery Set",
    subtitle: "New Arrival: Sample our entire signature line",
    image: "/web_images/fragrance_discovery_set_banner_1777030549051.png",
    buttonText: "Get Yours",
    bgColor: "#F59E0B"
  }
];

const DiscountBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 20000);
    return () => clearInterval(timer);
  }, []);

  const currentBanner = BANNERS[currentIndex];

  return (
    <div className="w-full h-32 border border-gray-200 flex items-center justify-between overflow-hidden relative px-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={currentBanner.image}
            alt={currentBanner.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-col gap-1 z-10">
        <motion.h3
          key={`title-${currentIndex}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-bold leading-tight text-white drop-shadow-md"
        >
          {currentBanner.title}
        </motion.h3>
        <motion.p
          key={`sub-${currentIndex}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-white opacity-90 drop-shadow-sm font-medium"
        >
          {currentBanner.subtitle}
        </motion.p>
      </div>

      <motion.div
        key={`btn-${currentIndex}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="z-10"
      >
        <Button
          variant="ghost"
          className="text-white font-bold h-11 px-8 hover:opacity-90 transition-all cursor-pointer rounded-md"
          style={{ backgroundColor: currentBanner.bgColor }}
        >
          {currentBanner.buttonText}
        </Button>
      </motion.div>

      {/* Slide Indicators */}
      <div className="absolute bottom-2 right-8 flex gap-1.5 z-20">
        {BANNERS.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-4 bg-white" : "w-1.5 bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
};

export { DiscountBanner };
