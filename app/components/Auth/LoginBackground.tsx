"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Icon } from "../Icon";
import { getAdvertConfig, BackgroundAsset } from "../../utils/advertState";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

export const LoginBackground = () => {
  const [images, setImages] = useState<BackgroundAsset[]>([{ url: "/web_images/luxury_perfume_exclusive_banner_1777030581224.png", positionX: 50, positionY: 50 }]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [duration, setDuration] = useState(8);

  useEffect(() => {
    const config = getAdvertConfig();
    if (config.backgroundImages?.length > 0) {
      setImages(config.backgroundImages);
    }
    setDuration(config.cycleDuration || 8);

    const handleUpdate = () => {
      const newConfig = getAdvertConfig();
      if (newConfig.backgroundImages?.length > 0) {
        setImages(newConfig.backgroundImages);
        if (currentIndex >= newConfig.backgroundImages.length) {
          setCurrentIndex(0);
        }
      }
      setDuration(newConfig.cycleDuration || 8);
    };

    window.addEventListener("advertConfigUpdated", handleUpdate);
    return () => window.removeEventListener("advertConfigUpdated", handleUpdate);
  }, [currentIndex]);

  // Auto-cycle based on dynamic per-slide duration
  useEffect(() => {
    if (images.length <= 1) return;
    
    const currentSlide = images[currentIndex];
    const slideDuration = currentSlide?.duration || duration;
    
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, slideDuration * 1000);
    
    return () => clearTimeout(timer);
  }, [currentIndex, images, duration]);

  // Broadcast current slide payload for synchronization
  useEffect(() => {
    if (images[currentIndex]) {
      const event = new CustomEvent("advertSlideChanged", {
        detail: {
          index: currentIndex,
          category: images[currentIndex].linkedCategory,
          // Narrative Overrides
          title: images[currentIndex].title,
          titleHighlight: images[currentIndex].titleHighlight,
          description: images[currentIndex].description,
          stats: images[currentIndex].stats,
          featuredItems: images[currentIndex].featuredItems,
          inventoryLayout: images[currentIndex].inventoryLayout
        }
      });
      window.dispatchEvent(event);
    }
  }, [currentIndex, images]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <>
      {/* Immersive Background Advert with Cross-Fade */}
      <div className="fixed inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={images[currentIndex]?.url}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentIndex]?.url || "/web_images/luxury_perfume_exclusive_banner_1777030581224.png"}
              alt="Premium Workspace"
              fill
              className="object-cover transition-all duration-1000"
              style={{ 
                objectPosition: `${images[currentIndex]?.positionX || 50}% ${images[currentIndex]?.positionY || 50}%` 
              }}
              priority
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Ambient Overlay */}
        <div className="absolute inset-0 bg-black/20 backdrop-brightness-[0.9]" />
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <div className="fixed inset-x-0 top-1/2 -translate-y-1/2 z-20 flex justify-between px-6 lg:px-12 pointer-events-none">
           <motion.button
             whileHover={{ scale: 1.1, x: 5 }}
             whileTap={{ scale: 0.9 }}
             onClick={handlePrev}
             className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white pointer-events-auto shadow-2xl hover:bg-white/20 transition-all opacity-40 hover:opacity-100"
           >
             <HiChevronLeft size={24} />
           </motion.button>
           
           <motion.button
             whileHover={{ scale: 1.1, x: -5 }}
             whileTap={{ scale: 0.9 }}
             onClick={handleNext}
             className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white pointer-events-auto shadow-2xl hover:bg-white/20 transition-all opacity-40 hover:opacity-100"
           >
             <HiChevronRight size={24} />
           </motion.button>
        </div>
      )}

      {/* Bottom Indicators (Dashes) */}
      {images.length > 1 && (
        <div className="fixed bottom-10 inset-x-0 z-20 flex justify-center gap-2 pointer-events-none">
           {images.map((_, i) => (
             <button
               key={i}
               onMouseEnter={() => setCurrentIndex(i)}
               onClick={() => setCurrentIndex(i)}
               className={`h-1.5 rounded-full transition-all pointer-events-auto
                 ${currentIndex === i ? "w-8 bg-brand-gold shadow-[0_0_15px_rgba(184,146,80,0.5)]" : "w-3 bg-white/30 hover:bg-white/60"}
               `}
             />
           ))}
        </div>
      )}

      {/* Decorative Background Icon */}
      <div className="fixed bottom-24 right-24 z-0 hidden lg:block opacity-[0.05] pointer-events-none">
        <Icon name="verified" folder="icon" size="lg" className="text-brand-gold scale-[15]" />
      </div>
    </>
  );
};
