import React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Icon } from "@/app/components/Icon";
import { SectionHeaderRich } from "../ui/SectionHeaderRich";
import { useGetCategoriesQuery } from "@/lib/redux/services/categoryApi";
import { CategorySectionSkeleton } from "../Skeleton/CategorySectionSkeleton";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const ArtisanalCollections = () => {
  const { data: response, isLoading } = useGetCategoriesQuery();
  const categories = response?.data && 'categories' in response.data
    ? response.data.categories
    : (Array.isArray(response?.data) ? response.data : []);

  const displayItems = categories.slice(0, 4).map(cat => ({
    title: cat.name,
    image: cat.image || "/web_images/Mask group copy.png",
    icon: "category"
  }));

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (displayItems.length === 0) return null;

  return (
    <section className="w-full">
      <SectionHeaderRich
        title="Artisanal Collections"
        mainHref="/products?search"
        exploreLabel="Explore All Selection"
        exploreHref="/products?search"
      />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {displayItems.map((service, idx) => (
          <Link key={idx} href={`/products?category=${encodeURIComponent(service.title)}`}>
            <motion.div
              variants={itemVariants}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer relative h-full"
            >
              <div className="h-40 relative overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-110 duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors"></div>
              </div>
              <div className="p-5 pt-8 relative bg-white">

                <h4 className="text-[13px] font-bold uppercase tracking-widest leading-relaxed text-gray-900 group-hover:text-brand-gold transition-colors">
                  {service.title}
                </h4>
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.2em] mt-1 block">Curated Category</span>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </section>
  );
};

export { ArtisanalCollections };
