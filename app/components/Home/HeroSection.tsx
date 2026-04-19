import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Button } from "@/app/components/Button";



const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const bannerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
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

const categories = [
  "Signature Fragrance", "Clinical Skincare", "Boutique Gift Sets",
  "Body & Bath", "Men's Grooming", "Home Fragrance",
  "Travel Essentials", "Discovery Kits", "View All"
];

const HeroSection = () => {
  return (
    <section className="w-full bg-white border border-gray-200 p-0 md:p-5 flex flex-col lg:flex-row gap-5 overflow-hidden">
      {/* Sidebar - Desktop Only */}
      {/* <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-64 flex flex-col gap-1 hidden lg:flex"
      >
        {categories.map((cat, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Button
              variant="ghost"
              className={`justify-start w-full px-4 py-2.5 text-sm rounded-lg transition-colors cursor-pointer border-none font-normal
                ${idx === 0 ? "bg-[#E5F1FF] font-black text-gray-900" : "text-gray-600 hover:bg-gray-50"}`}
            >
              {cat}
            </Button>
          </motion.div>
        ))}
      </motion.div> */}

      {/* Banner */}
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
        />
        <div className="absolute inset-0 p-6 md:p-12 lg:p-20 flex flex-col justify-center gap-6 md:gap-10 bg-black/10">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.1, delayChildren: 0.4 }}
            className="flex flex-col gap-2"
          >
            <motion.h2 variants={textVariants} className="text-xl md:text-2xl font-medium text-white uppercase tracking-[0.3em] opacity-90">Latest trending</motion.h2>
            <motion.h1 variants={textVariants} className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">Boutique<br/>Collections</motion.h1>
          </motion.div>
          <motion.div variants={textVariants} initial="hidden" animate="visible" transition={{ delay: 0.7 }}>
            <Link href="/products">
              <Button
                variant="ghost"
                className="w-fit bg-white text-black hover:bg-brand-red hover:text-white font-black border-none px-10 h-12 md:h-14 uppercase text-[12px] tracking-widest transition-all duration-300 active:scale-95"
              >
                Learn more
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export { HeroSection };
