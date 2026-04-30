"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Button } from "../Button/Button";
import { FavoriteButton } from "../Other";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

import { useState, useEffect, useMemo } from "react";
import { useGetPublicDealsQuery, useGetPublicTimerQuery } from "@/lib/redux/services/boutiqueApi";
import { useSocket } from "@/app/context/SocketContext";

const DealsSection = () => {
  const { addToCart } = useCart();
  const { data: timerResponse, refetch: refetchTimer } = useGetPublicTimerQuery();
  const { data: dealsResponse, isLoading: isLoadingDeals, refetch: refetchDeals } = useGetPublicDealsQuery();
  const { on, off } = useSocket();

  const timerData = timerResponse?.data?.timer;
  const dealProducts = dealsResponse?.data || [];

  // Local timer state
  const initialSeconds = useMemo(() => {
    if (!timerData) return 0;
    return (
      parseInt(timerData.days) * 86400 +
      parseInt(timerData.hours) * 3600 +
      parseInt(timerData.minutes) * 60 +
      parseInt(timerData.seconds)
    );
  }, [timerData]);

  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);

  useEffect(() => {
    setTotalSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerData?.isRunning && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerData?.isRunning, totalSeconds]);

  // Sync with global updates
  useEffect(() => {
    const handleTimerUpdate = () => refetchTimer();
    const handleDealUpdate = () => refetchDeals();

    on("TIMER_UPDATED", handleTimerUpdate);
    on("OFFER_UPDATED", handleDealUpdate);
    on("OFFER_DELETED", handleDealUpdate);

    return () => {
      off("TIMER_UPDATED", handleTimerUpdate);
      off("OFFER_UPDATED", handleDealUpdate);
      off("OFFER_DELETED", handleDealUpdate);
    };
  }, [on, off, refetchTimer, refetchDeals]);

  const timerUnits = useMemo(() => {
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    return [
      { v: d.toString().padStart(2, "0"), l: "Days" },
      { v: h.toString().padStart(2, "0"), l: "Hour" },
      { v: m.toString().padStart(2, "0"), l: "Min" },
      { v: s.toString().padStart(2, "0"), l: "Sec" }
    ];
  }, [totalSeconds]);

  const handleAddToCart = (e: React.MouseEvent, prod: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: prod.product?._id || prod.id,
      title: prod.product?.name || prod.name,
      price: prod.product?.price || 0,
      image: prod.product?.productImage || prod.image,
    });
    toast.success("Added to cart");
  };

  if (isLoadingDeals || !timerData?.isRunning && totalSeconds <= 0) {
    if (isLoadingDeals) return null; // Or skeleton
    return null; // Hide if no deals or timer expired
  }

  return (
    <section className="w-full bg-white flex flex-col md:flex-row overflow-hidden rounded-md border border-gray-200">
      <div className="w-full md:w-80 p-8 border-b md:border-b-0 md:border-r border-gray-200 flex md:flex-col justify-between md:justify-center items-center md:items-start gap-6 bg-gray-50/50">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl md:text-2xl font-outfit font-bold text-gray-900 uppercase tracking-wider">Limited <span className="text-brand-gold">Offers</span></h3>
          <p className="text-gray-500 text-xs md:text-sm font-medium tracking-wide">Curated Luxury Fragrances</p>
        </div>
        <div className="flex gap-2">
          {timerUnits.map((t, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-black text-white rounded-lg shadow-lg"
            >
              <span className="text-sm md:text-base font-bold text-brand-gold">{t.v}</span>
              <span className="text-[8px] md:text-[9px] uppercase tracking-widest font-bold opacity-60">{t.l}</span>
            </div>
          ))}
        </div>
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="flex-1 flex overflow-x-auto scrollbar-none divide-x divide-gray-100"
      >
        {dealProducts.map((prod, idx) => (
          <div key={idx} className="flex-shrink-0 relative group">
            <Link href={`/products/detail?id=${prod.product?._id || prod.id}`}>
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 15 } }}
                className="w-[160px] md:w-[220px] p-6 md:p-8 flex flex-col items-center gap-4 hover:bg-gray-50/80 transition-all duration-500 cursor-pointer h-full"
              >
                <div className="w-28 h-28 md:w-40 md:h-40 relative bg-white p-4 flex items-center justify-center transition-shadow">
                  <div className="absolute top-2 right-2 z-10 bg-brand-gold text-white text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
                    -{prod.discount}%
                  </div>
                  <Image
                    src={prod.product?.productImage || "/placeholder.png"}
                    alt={prod.product?.name || "Product"}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 160px, 220px"
                  />
                </div>
                <p className="text-xs md:text-sm text-center line-clamp-1 text-gray-600 group-hover:text-brand-gold transition-colors font-medium">
                  {prod.product?.name || "Premium Fragrance"}
                </p>
              </motion.div>
            </Link>

            {/* Hover Actions */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none z-10">
              <div className="flex gap-2 pointer-events-auto">
                <FavoriteButton 
                  item={{
                    id: prod.product?._id || prod.id,
                    title: prod.product?.name || prod.name,
                    price: `\u20A6${(prod.product?.price || 0).toLocaleString()}`,
                    image: prod.product?.productImage || prod.image,
                  } as any}
                  variant="outline"
                  size="sm"
                  className="!w-10 !h-10 bg-white border-transparent hover:border-brand-gold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                />
                <Button
                  onClick={(e) => handleAddToCart(e, prod)}
                  className="bg-black text-white hover:bg-brand-gold text-[10px] font-bold uppercase tracking-widest px-6 py-2 rounded-none transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
                >
                  Quick Add
                </Button>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export { DealsSection };
