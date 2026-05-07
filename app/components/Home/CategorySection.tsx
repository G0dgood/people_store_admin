"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Button } from "@/app/components/Button/Button";
import { FavoriteButton } from "../Other";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";
import { Icon } from "../Icon";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { StockWarning } from "../StockWarning";

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
  isUnlimited: boolean | undefined;
  stock: number;
  id?: string;
  name: string;
  price: string;
  image: string;
}

interface CategorySectionProps {
  title: string;
  category?: string;
  brandName?: string;
  bannerImage: string;
  products: CategoryProduct[];
  reverse?: boolean;
  priority?: boolean;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  category,
  brandName,
  bannerImage,
  products,
  reverse = false,
  priority = false
}) => {
  const { addToCart } = useCart();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const showNav = products.length > 4;

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
          <div className="flex flex-col gap-1 mb-4">
            {category && (
              <span className="text-[10px] text-white/80 uppercase tracking-[0.4em] font-bold">
                {category}
              </span>
            )}
            <h3 className="text-xl md:text-2xl font-outfit font-light text-white tracking-[0.2em] drop-shadow-lg">
              {title}
            </h3>
          </div>
          <Link href={brandName ? `/products?brand=${encodeURIComponent(brandName)}` : "/products"}>
            <Button
              variant="ghost"
              className="bg-white text-black hover:bg-brand-gold hover:text-white font-bold w-fit py-2.5 px-6 h-auto text-[10px] uppercase tracking-[0.2em] border-none transition-all active:scale-95 shadow-lg"
            >
              Shop Collection
            </Button>
          </Link>
        </div>
      </div>

      {/* Product Grid / Scrollable Area */}
      <div className="flex-1 relative group/section overflow-hidden">
        {showNav && (
          <>
            <button
              onClick={() => scroll("left")}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full flex items-center justify-center text-gray-900 opacity-0 group-hover/section:opacity-100 transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold shadow-lg"
            >
              <HiChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full flex items-center justify-center text-gray-900 opacity-0 group-hover/section:opacity-100 transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold shadow-lg"
            >
              <HiChevronRight size={20} />
            </button>
          </>
        )}

        <motion.div
          ref={scrollRef}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className={`flex-1 h-full overflow-x-auto scrollbar-none flex ${showNav ? "snap-x snap-mandatory" : "grid grid-cols-2 md:grid-cols-4"}`}
        >
          {products?.map((item, idx) => (
            <div
              key={idx}
              className={`relative group shrink-0 ${showNav ? "w-1/2 md:w-1/4 snap-start" : "w-full h-full"}`}
            >
              <Link
                href={`/products/detail?id=${item.id}`}
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
                    <h4 className="text-[10px] md:text-[12px] font-bold tracking-wider text-gray-900 group-hover:text-brand-gold transition-colors leading-tight">
                      {item.name}
                    </h4>
                    <div>

                      <p className="text-[10px] md:text-xs text-gray-500 font-medium tracking-wide mb-1">
                        ₦{item.price}
                      </p>
                      <StockWarning
                        stock={item.stock}
                        quantity={0}
                        isUnlimited={item.isUnlimited}
                      />
                    </div>
                  </div>
                </motion.div>
              </Link>

              {/* Heart Icon */}
              <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <FavoriteButton
                  item={{
                    id: item.id || `cat-${item.name}-${item.price}`,
                    title: item.name,
                    price: `₦${item.price}`,
                    image: item.image,
                  } as any}
                  variant="ghost"
                  size="md"
                  className="bg-white/60 hover:bg-white backdrop-blur-sm  "
                />
              </div>

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
      </div>
    </section>
  );
};

export { CategorySection };
