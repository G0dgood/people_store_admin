import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

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

const dealProducts = [
  { name: "Smart watches", discount: "-25%", image: "/images/watch.jpg" },
  { name: "Laptops", discount: "-15%", image: "/images/laptop.jpg" },
  { name: "GoPro cameras", discount: "-40%", image: "/images/camera.jpg" },
  { name: "Headphones", discount: "-25%", image: "/images/headphone.jpg" },
  { name: "Canon camaras", discount: "-25%", image: "/images/camera.jpg" },
];

const timerUnits = [
  { v: "04", l: "Days" },
  { v: "13", l: "Hour" },
  { v: "34", l: "Min" },
  { v: "56", l: "Sec" }
];

const DealsSection = () => {
  return (
    <section className="w-full bg-white border border-gray-200 md:rounded-lg flex flex-col md:flex-row overflow-hidden shadow-sm">
      <div className="w-full md:w-72 p-6 border-b md:border-b-0 md:border-r border-gray-100 flex md:flex-col justify-between md:justify-start items-center md:items-start gap-4 md:gap-6">
        <div className="flex flex-col">
          <h3 className="text-lg md:text-xl font-bold text-gray-900">Deals and offers</h3>
          <p className="text-gray-400 text-xs md:text-sm">Hygiene equipments</p>
        </div>
        <div className="flex gap-2">
          {timerUnits.map((t, idx) => (
            <div 
              key={idx} 
              className="flex flex-col items-center justify-center w-11 h-11 md:w-12 md:h-12 bg-[#F7F7F7] md:bg-gray-600 rounded-md text-gray-900 md:text-white border border-gray-100 md:border-none shadow-sm"
            >
              <span className="text-sm font-bold">{t.v}</span>
              <span className="text-[9px] md:text-[10px] opacity-60 font-medium">{t.l}</span>
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
          <Link 
            key={idx} 
            href="/products/detail" 
            className="flex-shrink-0"
          >
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 15 } }}
              className="w-[140px] md:w-[200px] p-4 md:p-6 flex flex-col items-center gap-2 md:gap-3 hover:bg-gray-50 transition-colors group cursor-pointer h-full"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 relative bg-white border border-gray-50 rounded-md p-2 flex items-center justify-center">
                <Image 
                  src={prod.image} 
                  alt={prod.name} 
                  fill 
                  className="object-contain group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <p className="text-xs md:text-sm text-center line-clamp-1 text-gray-600 group-hover:text-brand-blue transition-colors">
                {prod.name}
              </p>
              <span className="px-3 py-1 bg-[#FFE3E3] text-[#EB001B] text-[10px] md:text-xs font-bold rounded-full shadow-sm">
                {prod.discount}
              </span>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </section>
  );
};

export { DealsSection };
