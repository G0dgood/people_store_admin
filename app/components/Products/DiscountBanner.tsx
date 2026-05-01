"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "../Button";
import { motion, AnimatePresence } from "framer-motion";
import { useGetPublicCouponsQuery } from "@/lib/redux/services/boutiqueApi";
import { useSocket } from "@/app/context/SocketContext";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";

const DiscountBanner = () => {
  const { data: response, isLoading, refetch } = useGetPublicCouponsQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { socket } = useSocket();
  const { applyCoupon, cartItems } = useCart();

  const coupons = response?.data?.filter(c => c?.status === "Active") || [];

  const banners = coupons.map(c => ({
    id: c._id,
    title: c?.title,
    subtitle: c?.description,
    image: c.image || "/web_images/luxury_perfume_exclusive_banner_1777030581224.png",
    code: c.code,
    buttonText: `Use ${c.code}`,
    bgColor: c.bgColor || "#C5A028",
    imagePosition: c.imagePosition || "center",
    thumbnailUrl: c.thumbnailUrl,
    mediaType: c.mediaType || "image"
  }));

  // Socket listener for real-time updates
  useEffect(() => {
    if (!socket) return;

    socket.on("couponUpdate", () => {
      refetch();
    });

    return () => {
      socket.off("couponUpdate");
    };
  }, [socket, refetch]);

  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 20000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleUseCoupon = async (code: string) => {
    try {
      // 1. Copy to clipboard for convenience
      await navigator.clipboard.writeText(code);
      
      // 2. If cart has items, try to apply it immediately
      if (cartItems.length > 0) {
        try {
          await applyCoupon(code);
          toast.success("Artisanal Code Applied!", {
            description: `The promotion ${code} has been synchronized with your cart.`,
          });
        } catch (err: any) {
          // If application fails (e.g. min amount), still notify about clipboard
          toast.info("Code Copied!", {
            description: `Promotion ${code} copied. Note: ${err.data?.message || "Minimum requirements may apply"}.`,
          });
        }
      } else {
        toast.success("Code Copied!", {
          description: `Promotion ${code} is ready for your next artisanal selection.`,
        });
      }
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-32 bg-gray-50 animate-pulse rounded-sm border border-gray-100 flex items-center justify-center">
        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Loading Exclusive Offers...</span>
      </div>
    );
  }

  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

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
          {currentBanner.mediaType === "video" ? (
            <video
              src={currentBanner.image as string}
              poster={currentBanner.thumbnailUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover transition-all duration-700"
              style={{ objectPosition: currentBanner.imagePosition }}
            />
          ) : (
            <Image
              src={currentBanner.image as string}
              alt={currentBanner.title as string}
              fill
              className="object-cover transition-all duration-700"
              style={{ objectPosition: currentBanner.imagePosition }}
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-col gap-1 z-10">
        <motion.h3
          key={`title-${currentIndex}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-black leading-tight text-white drop-shadow-md uppercase tracking-tight"
        >
          {currentBanner.title}
        </motion.h3>
        <motion.p
          key={`sub-${currentIndex}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-white opacity-90 drop-shadow-sm font-bold italic"
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
          onClick={() => handleUseCoupon(currentBanner.code)}
          className="text-white font-black h-11 px-8 hover:opacity-90 transition-all cursor-pointer rounded-md uppercase tracking-widest text-[11px] shadow-lg"
          style={{ backgroundColor: currentBanner.bgColor }}
        >
          {currentBanner.buttonText}
        </Button>
      </motion.div>

      {/* Slide Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-2 right-8 flex gap-1.5 z-20">
          {banners.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-4 bg-white" : "w-1.5 bg-white/40"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export { DiscountBanner };
