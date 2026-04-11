import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Button } from "@/app/components/Button";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

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
  "Automobiles", "Clothes and wear", "Home interiors",
  "Computer and tech", "Tools, equipments", "Sports and outdoor",
  "Animal and pets", "Machinery tools", "More category"
];

const HeroSection = () => {
  return (
    <section className="w-full bg-white border border-gray-200 rounded-lg p-0 md:p-5 flex flex-col lg:flex-row gap-5 overflow-hidden shadow-sm">
      {/* Sidebar - Desktop Only */}
      <motion.div 
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
                ${idx === 1 ? "bg-[#E5F1FF] font-black text-gray-900" : "text-gray-600 hover:bg-gray-50"}`}
            >
              {cat}
            </Button>
          </motion.div>
        ))}
      </motion.div>

      {/* Banner */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={bannerVariants}
        className="flex-1 relative md:rounded-md overflow-hidden min-h-[250px] md:min-h-[400px]"
      >
        <Image
          src="/web_images/Mask group.png"
          alt="Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-center gap-4 md:gap-6 bg-black/5">
          <motion.div 
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.1, delayChildren: 0.4 }}
            className="flex flex-col"
          >
            <motion.h2 variants={textVariants} className="text-xl md:text-3xl font-normal text-gray-900">Latest trending</motion.h2>
            <motion.h1 variants={textVariants} className="text-2xl md:text-4xl font-bold text-gray-900">Electronic items</motion.h1>
          </motion.div>
          <motion.div variants={textVariants} initial="hidden" animate="visible" transition={{ delay: 0.7 }}>
            <Link href="/products">
              <Button 
                variant="ghost" 
                className="w-fit bg-white text-gray-900 hover:bg-gray-100 font-bold border-none shadow-md px-6 h-10 md:h-11"
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
