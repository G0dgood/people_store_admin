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
    <section className="w-full bg-white border border-[#1C1C1C1A] rounded-[6px] md:rounded-lg flex flex-col md:flex-row overflow-hidden">
      <div className="w-full md:w-72 p-6 border-b md:border-b-0 md:border-r border-gray-100 flex md:flex-col justify-between md:justify-start items-center md:items-start gap-4 md:gap-6">
        <div className="flex flex-col">
          <h3 className="text-lg md:text-xl font-bold text-gray-900">Deals and offers</h3>
          <p className="text-gray-400 text-xs md:text-sm">Luxury Fragrance</p>
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
          <div key={idx} className="flex-shrink-0 relative group">
            <Link href="/products/detail">
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 15 } }}
                className="w-[140px] md:w-[200px] p-4 md:p-6 flex flex-col items-center gap-2 md:gap-3 hover:bg-gray-50 transition-colors cursor-pointer h-full"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 relative bg-white border border-gray-50 rounded-md p-2 flex items-center justify-center">
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
                <span className="px-3 py-1 bg-[#FFE3E3] text-[#EB001B] text-[10px] md:text-xs font-bold rounded-full shadow-sm">
                  {prod.discount}
                </span>

                {/* Hover Actions */}
                <div className="mt-2 flex flex-col gap-2 w-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="flex-1 text-[9px] h-7 font-bold border-gray-200">
                      Details
                    </Button>
                    <Button
                      onClick={(e) => handleAddToCart(e, prod)}
                      variant="primary"
                      size="sm"
                      className="flex-1 text-[9px] h-7 font-bold shadow-none"
                    >
                      + Cart
                    </Button>
                  </div>
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
