import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Button } from "@/app/components/Button/Button";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { ProductGridItem } from "../Products/ProductItems";
import { QuickViewModal } from "../Products/QuickViewModal";

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

interface CategoryProduct {
  isUnlimited: boolean | undefined;
  stock: number;
  id?: string;
  name: string;
  price: string;
  image: string;
  media?: { type: string, url: string }[];
}

interface CategorySectionProps {
  title: string;
  category?: string;
  brandName?: string;
  bannerImage: string;
  products: CategoryProduct[];
  reverse?: boolean;
  priority?: boolean;
  productDetailPath?: string;
  showBanner?: boolean;
  columns?: number;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  category,
  brandName,
  bannerImage,
  products,
  reverse = false,
  priority = false,
  productDetailPath,
  showBanner = true,
  columns = 4
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const showNav = products.length > columns;

  return (
    <>
      <section className={`w-full bg-white flex flex-col md:flex-row overflow-hidden border-b border-gray-200 ${showBanner ? "border-l border-r border-t -mt-px" : ""} ${reverse ? "md:flex-row-reverse" : ""}`}>
        {/* Category Banner */}
        {showBanner && (
          <Link 
            href={brandName ? `/products?brand=${encodeURIComponent(brandName)}` : "/products"}
            className="w-full md:w-80 relative min-h-[200px] md:min-h-0 group overflow-hidden border-r border-gray-200 block cursor-pointer z-10"
          >
            <Image
              src={bannerImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-1000"
              sizes="(max-width: 768px) 100vw, 320px"
              priority={priority}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
          </Link>
        )}

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
            className={`flex-1 h-full overflow-hidden !overflow-x-auto scrollbar-none flex ${showNav ? "snap-x snap-mandatory" : `grid grid-cols-2 ${columns === 5 ? "md:grid-cols-5" : "md:grid-cols-4"}`} border-t border-l border-gray-200 -m-[1px] pb-[1px]`}
          >
            {products?.map((item, idx) => (
              <div key={idx} className={`shrink-0 ${showNav ? `w-1/2 ${columns === 5 ? "md:w-1/5" : "md:w-1/4"} snap-start` : "w-full h-full"}`}>
                <ProductGridItem
                  product={{
                    id: item.id || `cat-${item.name}-${item.price}`,
                    title: item.name,
                    price: `₦${item.price}`,
                    image: item.image,
                    stock: item.stock,
                    isUnlimited: item.isUnlimited ?? false,
                    rating: 5,
                    orders: 0,
                    shipping: "Standard",
                    description: "",
                    media: item.media,
                    detailUrl: productDetailPath
                      ? `${productDetailPath}${productDetailPath.includes("?") ? "&" : "?"}id=${item.id}`
                      : undefined,
                    onQuickView: handleQuickView
                  }}
                  variant="joined"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={selectedProduct}
      />
    </>
  );
};

export { CategorySection };
