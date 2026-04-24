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
  priority?: boolean;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  bannerImage,
  products,
  reverse = false,
  priority = false
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
    <section className={`w-full bg-white flex flex-col md:flex-row overflow-hidden ${reverse ? "md:flex-row-reverse" : ""}`}>
      {/* Category Banner */}
      <div className="w-full md:w-80 relative min-h-[200px] md:min-h-0 group overflow-hidden">
        <Image
          src={bannerImage}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-1000"
          sizes="(max-width: 768px) 100vw, 320px"
          priority={priority}
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
          <h3 className="text-xl md:text-2xl font-outfit font-light text-white uppercase tracking-[0.2em] mb-4 drop-shadow-lg">
            {title}
          </h3>
          <Link href="/products">
            <Button
              variant="ghost"
              className="bg-white text-black hover:bg-brand-gold hover:text-white font-bold w-fit py-2.5 px-6 h-auto text-[10px] uppercase tracking-[0.2em] border-none transition-all active:scale-95 shadow-lg"
            >
              Shop Collection
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
        className="flex-1 grid grid-cols-2 md:grid-cols-4"
      >
        {products.map((item, idx) => (
          <div key={idx} className="flex h-full relative group">
            <Link
              href="/products/detail"
              className="flex flex-col p-4 md:p-6 gap-3 hover:bg-gray-50 transition-all duration-500 cursor-pointer w-full h-full pb-16 border-r border-b border-gray-200"
            >
              <motion.div variants={itemVariants} className="flex flex-col gap-4 h-full">
                <div className="w-full aspect-square relative flex-shrink-0 bg-gray-50/50 rounded-xl overflow-hidden">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-[11px] md:text-[13px] font-bold uppercase tracking-wider text-gray-900 group-hover:text-brand-gold transition-colors leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-[10px] md:text-xs text-gray-500 font-medium tracking-wide">
                    ₦{item.price}
                  </p>
                </div>
              </motion.div>
            </Link>

            {/* Overlay Actions */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300">
              <Button
                onClick={(e) => handleAddToCart(e, item)}
                className="flex-1 bg-black text-white hover:bg-brand-gold text-[9px] h-8 font-bold uppercase tracking-widest transition-all rounded-none"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export { CategorySection };
