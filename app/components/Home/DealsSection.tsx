
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Button } from "../Button/Button";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";
import { useGetPublicDealsQuery, useGetPublicTimerQuery } from "@/lib/redux/services/boutiqueApi";
import { useSocket } from "@/app/context/SocketContext";
import { QuickViewModal } from "../Products/QuickViewModal";
import { ProductActionOverlay } from "../Products/ProductActionOverlay";
import { SectionHeaderRich } from "../ui/SectionHeaderRich";

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

const DealsSection = () => {
  const { addToCart } = useCart();
  const { data: timerResponse, refetch: refetchTimer } = useGetPublicTimerQuery();
  const { data: dealsResponse, isLoading: isLoadingDeals, refetch: refetchDeals } = useGetPublicDealsQuery();
  const { on, off } = useSocket();

  const [selectedQuickView, setSelectedQuickView] = useState<any>(null);

  const timerData = timerResponse?.data?.timer;
  const dealProducts = dealsResponse?.data && 'deals' in dealsResponse.data
    ? dealsResponse.data.deals
    : (Array.isArray(dealsResponse?.data) ? dealsResponse.data : []);

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
      price: (prod.product?.price * (1 - prod.discount / 100)).toString(),
      image: prod.product?.productImage || prod.image,
      stock: prod.product?.stock,
      isUnlimited: prod.product?.isUnlimited
    });
    toast.success("Added to cart");
  };

  if (isLoadingDeals || !timerData?.isRunning && totalSeconds <= 0) {
    if (isLoadingDeals) return null;
    return null;
  }

  return (
    <div className="flex flex-col gap-0 mt-8 mb-12">
      <SectionHeaderRich 
        title="Limited Offers" 
        mainHref="/products"
        exploreLabel="View All Deals"
        exploreHref="/products"
        className="!mt-0 !mb-6"
      />
      <section className="w-full bg-white flex flex-col md:flex-row overflow-hidden border border-gray-200">
        <div className="w-full md:w-80 p-8 border-b md:border-b-0 md:border-r border-gray-200 flex md:flex-col justify-between md:justify-center items-center md:items-start gap-6 bg-gray-50/50">
          <div className="flex flex-col gap-1 font-outfit">
            <p className="text-gray-900 text-sm md:text-base font-bold uppercase tracking-[0.2em]">Ends in:</p>
            <p className="text-gray-500 text-[10px] md:text-xs font-medium tracking-wide">Luxury Fragrance Event</p>
          </div>
          <div className="flex gap-2">
            {timerUnits.map((t, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-brand-charcoal text-white rounded-lg shadow-lg font-outfit"
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
          className="flex-1 flex overflow-hidden overflow-x-scroll scrollbar-none divide-x divide-gray-100"
        >
          {dealProducts?.map((prod, idx) => (
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
                  <div className="flex flex-col items-start gap-1 w-full font-outfit">
                    <p className="text-xs md:text-sm text-start line-clamp-1 text-gray-600 group-hover:text-brand-gold transition-colors font-medium">
                      {prod.product?.name || "Premium Fragrance"}
                    </p>
                    <div className="flex items-center justify-between gap-2 w-full">
                      <span className="text-sm md:text-base font-bold text-gray-900">
                        ₦{(prod.product?.price * (1 - prod.discount / 100)).toLocaleString()}
                      </span>
                      <span className="text-xs md:text-base text-gray-500 line-through decoration-brand-gray-500 font-normal font-outfit">
                        ₦{prod.product?.price?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
                <div className="flex items-center gap-2 pointer-events-auto transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <ProductActionOverlay
                    useAbsolute={false}
                    onQuickView={() => setSelectedQuickView({
                      ...prod.product,
                      id: prod.product?._id || prod.id,
                      image: prod.product?.productImage,
                      price: (prod.product?.price * (1 - prod.discount / 100))
                    })}
                    className="!opacity-100 !translate-x-0 !top-0 !right-0 shadow-lg"
                  />
                  <Button
                    onClick={(e) => handleAddToCart(e, prod)}
                    className="bg-brand-charcoal text-white hover:bg-brand-gold text-[10px] font-bold uppercase tracking-widest px-6 py-2 rounded-none shadow-lg"
                  >
                    Quick Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
        <QuickViewModal
          isOpen={!!selectedQuickView}
          onClose={() => setSelectedQuickView(null)}
          product={selectedQuickView}
          subtitle="Limited Offer"
          description={selectedQuickView?.description}
        />
      </section>
    </div>
  );
};

export { DealsSection };
