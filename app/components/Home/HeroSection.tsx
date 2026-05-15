import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/app/components/Button";
import { useGetPublicAdvertConfigQuery, useGetPublicAdvertsQuery } from "@/lib/redux/services/boutiqueApi";
import { useSocket } from "@/app/context/SocketContext";
import { CarouselIndicators } from "./CarouselIndicators";

const bannerVariants: Variants = {
  enter: { opacity: 0, scale: 1.05 },
  center: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.8 }
  }
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const HeroSection = () => {
  const { data: advertConfig, isLoading: isConfigLoading, refetch: refetchConfig } = useGetPublicAdvertConfigQuery();
  const { data: allAdverts, isLoading: isAdvertsLoading, refetch: refetchAdverts } = useGetPublicAdvertsQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { on, off } = useSocket();

  useEffect(() => {
    const handleUpdate = () => {
      refetchConfig();
      refetchAdverts();
    };
    on("ADVERT_UPDATED", handleUpdate);
    return () => off("ADVERT_UPDATED", handleUpdate);
  }, [on, off, refetchConfig, refetchAdverts]);

  const activeConfig = useMemo(() => {
    if (advertConfig && (advertConfig.backgroundImages?.length || 0) > 0) return advertConfig;
    if (allAdverts && allAdverts.length > 0) {
      return allAdverts.find(a => (a as any).isLive) || allAdverts[0];
    }
    return null;
  }, [advertConfig, allAdverts]);

  const backgrounds = activeConfig?.backgroundImages || [];
  const cycleDuration = activeConfig?.cycleDuration || 5;
  const isLoading = isConfigLoading && isAdvertsLoading;

  useEffect(() => {
    if (backgrounds.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgrounds.length);
    }, cycleDuration * 1000);
    return () => clearInterval(interval);
  }, [backgrounds.length, cycleDuration]);

  if (isLoading) {
    return <div className="w-full min-h-[250px] md:min-h-[400px] bg-gray-100 animate-pulse"></div>;
  }

  // Fallback to default if no configuration or images exist
  if (backgrounds.length === 0) {
    return (
      <section className="w-full bg-white p-0 flex flex-col lg:flex-row gap-5 overflow-hidden">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={bannerVariants}
          className="flex-1 relative overflow-hidden min-h-[250px] md:min-h-[400px]"
        >
          <Image
            src="/brandImage/brand_banner.png"
            alt="Banner"
            fill
            className="object-cover"
            priority
            loading="eager"
            sizes="(max-width: 768px) 100vw, 80vw"
          />
          <div className="absolute inset-0 p-6 md:p-12 lg:p-24 flex flex-col justify-center gap-8 md:gap-12 bg-black/30">
            <motion.div
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.1, delayChildren: 0.4 }}
              className="flex flex-col gap-4"
            >
              <motion.h2 variants={textVariants} className="text-sm md:text-base font-medium text-brand-gold uppercase tracking-[0.5em] opacity-90">Experience Pure Luxury</motion.h2>
              <motion.h1 variants={textVariants} className="text-4xl md:text-7xl font-outfit font-light text-white uppercase tracking-[0.1em] leading-[1.1]">
                The <span className="font-bold">Boutique</span><br />Collections
              </motion.h1>
              <motion.p variants={textVariants} className="text-white/80 text-sm md:text-lg max-w-lg font-light tracking-wide leading-relaxed hidden md:block">
                Discover our curated selection of world-class fragrances and clinical skincare, tailored for the discerning individual.
              </motion.p>
            </motion.div>
            <motion.div variants={textVariants} initial="hidden" animate="visible" transition={{ delay: 0.7 }}>
              <Link href="/products">
                <Button
                  variant="ghost"
                  className="w-fit bg-white text-black hover:bg-brand-gold hover:text-white font-bold border-none px-12 h-14 md:h-16 uppercase text-[11px] tracking-[0.2em] transition-all duration-500 active:scale-95 shadow-xl"
                >
                  Explore More
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    );
  }

  const activeBg = backgrounds[currentIndex];
  const title = activeBg.title || advertConfig?.title || "";
  const highlight = activeBg.titleHighlight || advertConfig?.titleHighlight || "";
  const description = activeBg.description || advertConfig?.description || "";
  const showTitle = advertConfig?.showTitle ?? true;
  const showHighlight = advertConfig?.showHighlight ?? true;
  const showDescription = advertConfig?.showDescription ?? true;

  return (
    <section className="w-full bg-white p-0 flex flex-col lg:flex-row gap-5 overflow-hidden">
      <div className="flex-1 relative overflow-hidden min-h-[250px] md:min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial="enter"
            animate="center"
            exit="exit"
            variants={bannerVariants}
            className="absolute inset-0"
          >
            <Link 
              href={`/products?search=${encodeURIComponent(title)}`}
              className="absolute inset-0 cursor-pointer block z-10"
            >
              <Image
                src={activeBg.url || "/brandImage/brand_banner.png"}
                alt={title || "Dynamic Banner"}
                fill
                className="object-cover"
                style={{
                  objectPosition: `${activeBg.positionX || 50}% ${activeBg.positionY || 50}%`
                }}
                priority
                loading="eager"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </Link>
            {/* Overlay content removed to focus on visuals */}
          </motion.div>
        </AnimatePresence>

        <CarouselIndicators
          total={backgrounds.length}
          currentIndex={currentIndex}
          onSelect={setCurrentIndex}
        />
      </div>
    </section>
  );
};

export { HeroSection };
