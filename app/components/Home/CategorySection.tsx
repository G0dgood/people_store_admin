"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Button } from "@/app/components/Button/Button";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";

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
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

interface CategoryProduct {
  id?: string;
  name: string;
  price: string;
  image: string;
}

interface CategorySectionProps {
  title: string;
  bannerImage: string;
  products: CategoryProduct[];
  reverse?: boolean;
}

const CategorySection: React.FC<CategorySectionProps> = ({ 
  title, 
  bannerImage, 
  products,
  reverse = false 
}) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent, item: CategoryProduct) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: item.id || `cat-${item.name}-${item.price}`,
      title: item.name,
      price: `₦${item.price}`,
      image: item.image,
    });
    toast.success("Added to cart");
  };

  return (
    <section className={`w-full bg-white border border-gray-200 md:rounded-lg flex flex-col md:flex-row shadow-sm overflow-hidden ${reverse ? "md:flex-row-reverse" : ""}`}>
      {/* Category Banner */}
      <div className="w-full md:w-72 relative min-h-[150px] md:min-h-0 group overflow-hidden">
        <Image 
          src={bannerImage} 
          alt={title} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors"></div>
        <div className="absolute top-4 left-4 md:top-6 md:left-6 max-w-[200px] flex flex-col gap-3 md:gap-4 z-10">
          <h3 className="text-lg md:text-xl font-bold leading-tight text-gray-900 drop-shadow-sm">
            {title}
          </h3>
          <Link href="/products">
            <Button 
              variant="ghost"
              className="bg-white !text-gray-900 hover:bg-gray-100 font-bold w-fit py-1.5 px-3 md:py-2 md:px-5 h-auto text-xs md:text-sm border-none shadow-md transition-all active:scale-95"
            >
              Source now
            </Button>
          </Link>
        </div>
      </div>

      {/* Product Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="flex-1 grid grid-cols-2 md:grid-cols-4 divide-x divide-y divide-gray-100"
      >
        {products.map((item, idx) => (
          <div key={idx} className="flex h-full relative group">
            <Link 
              href="/products/detail"
              className="flex flex-col p-4 md:p-5 gap-2 hover:bg-gray-50 transition-colors cursor-pointer w-full h-full pb-14"
            >
              <motion.div variants={itemVariants} className="flex justify-between gap-3 h-full">
                <div className="flex flex-col">
                  <h4 className="text-xs md:text-sm font-medium text-gray-700 group-hover:text-brand-blue transition-colors leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-[10px] md:text-xs text-gray-400 mt-1">
                    From <br className="hidden md:block" />
                    <span className="font-bold text-gray-900">₦{item.price}</span>
                  </p>
                </div>
                <div className="w-16 h-16 md:w-20 md:h-20 relative flex-shrink-0">
                  {item.image && (
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-contain group-hover:translate-y-[-2px] transition-transform duration-300" 
                    />
                  )}
                </div>
              </motion.div>
            </Link>
            
            {/* Overlay Actions */}
            <div className="absolute bottom-3 left-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0 duration-200">
               <Link href="/products/detail" className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full text-[9px] h-7 font-bold border border-gray-100 px-0">
                    View
                  </Button>
               </Link>
               <Button 
                onClick={(e) => handleAddToCart(e, item)}
                variant="primary" 
                size="sm" 
                className="flex-1 text-[9px] h-7 font-bold shadow-none px-0"
               >
                 + Cart
               </Button>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export { CategorySection };
