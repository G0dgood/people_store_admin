"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Button } from "../Button/Button";
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

const dealProducts = [
  { id: "d1", name: "Prada Paradoxe", discount: "-25%", image: "/Dealsandoffers/deal_prada.png", price: "₦85.00" },
  { id: "d2", name: "CK Everyone", discount: "-15%", image: "/Dealsandoffers/deal_ck.png", price: "₦55.00" },
  { id: "d3", name: "Versace Eros Flame", discount: "-40%", image: "/Dealsandoffers/deal_versace_eros.jpg", price: "₦95.00" },
  { id: "d4", name: "Polo Blue EDT", discount: "-25%", image: "/Dealsandoffers/deal_polo_blue.png", price: "₦75.00" },
  { id: "d5", name: "Polo Green EDT", discount: "-25%", image: "/Dealsandoffers/deal_polo_green.jpg", price: "₦72.00" },
];

const timerUnits = [
  { v: "04", l: "Days" },
  { v: "13", l: "Hour" },
  { v: "34", l: "Min" },
  { v: "56", l: "Sec" }
];

const DealsSection = () => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent, prod: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: prod.id,
      title: prod.name,
      price: prod.price,
      image: prod.image,
    });
    toast.success("Added to cart");
  };

  return (
    <section className="w-full bg-white flex flex-col md:flex-row overflow-hidden rounded-md border border-gray-200">
      <div className="w-full md:w-80 p-8 border-b md:border-b-0 md:border-r border-gray-100 flex md:flex-col justify-between md:justify-center items-center md:items-start gap-6 bg-gray-50/50">
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
            <Link href="/products/detail">
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 15 } }}
                className="w-[160px] md:w-[220px] p-6 md:p-8 flex flex-col items-center gap-4 hover:bg-gray-50/80 transition-all duration-500 cursor-pointer h-full"
              >
                <div className="w-28 h-28 md:w-40 md:h-40 relative bg-white rounded-xl shadow-sm p-4 flex items-center justify-center group-hover:shadow-md transition-shadow">
                  <div className="absolute top-2 right-2 z-10 bg-brand-gold text-white text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
                    {prod.discount}
                  </div>
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-xs md:text-sm text-center line-clamp-1 text-gray-600 group-hover:text-brand-blue transition-colors font-medium">
                  {prod.name}
                </p>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    onClick={(e) => handleAddToCart(e, prod)}
                    className="bg-black text-white hover:bg-brand-gold text-[10px] font-bold uppercase tracking-widest px-6 py-2 rounded-none transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  >
                    Quick Add
                  </Button>
                </div>
              </motion.div>
            </Link>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export { DealsSection };
