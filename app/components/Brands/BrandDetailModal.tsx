"use client";

import React from "react";
import Modal from "../Modal/Modal";
import Image from "next/image";
import { HiStar, HiXMark, HiChevronRight, HiShoppingBag } from "react-icons/hi2";
import { Button } from "../Button/Button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useGetProductsQuery } from "@/lib/redux/services/productApi";
import { ProductSkeleton } from "../Skeleton/ProductSkeleton";
import { Icon } from "../Icon";

interface BrandDetailModalProps {
 isOpen: boolean;
 onClose: () => void;
 brand: any;
}

export const BrandDetailModal: React.FC<BrandDetailModalProps> = ({
 isOpen,
 onClose,
 brand,
}) => {
 const { data: productsResponse, isLoading: isLoadingProducts } = useGetProductsQuery(
  brand ? { brand: brand.name, limit: 4 } : undefined,
  { skip: !brand || !isOpen }
 );

 if (!brand) return null;

 const products = productsResponse?.data?.products || [];

 return (
  <Modal
   isOpen={isOpen}
   onClose={onClose}
   size="lg"
   className="!p-0 overflow-hidden"
  >
   <div className="relative w-full h-full flex flex-col">
    {/* Close Button */}
    <button
     onClick={onClose}
     className="absolute top-6 right-6 z-50 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all border border-white/20 shadow-xl"
    >
     <Icon name="close" size="md" />
    </button>

    {/* Banner Section */}
    <div className="relative w-full h-72 md:h-96">
     <Image
      src={brand.logo || "/placeholder.png"}
      alt={brand.name}
      fill
      className="object-cover"
      sizes="(max-width: 1024px) 100vw, 800px"
     />
     <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />

     <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
      <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       className="flex flex-col gap-2"
      >
       <div className="flex items-center gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold bg-brand-charcoal/5 px-3 py-1 rounded-full backdrop-blur-sm">Artisanal House</span>
        <div className="flex items-center gap-1">
         <Icon name="star" size="sm" className="text-brand-gold" />
         <span className="text-sm font-bold text-gray-900">{brand.rating ? Number(brand.rating).toFixed(1) : "New"}</span>
        </div>
       </div>
       <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none">{brand.name}</h2>
      </motion.div>
     </div>
    </div>

    {/* Content Section */}
    <div className="p-8 md:p-12 bg-white flex flex-col gap-10">
     <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
       <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Heritage & Legacy</h4>
       <p className="text-gray-600 text-lg leading-relaxed font-medium italic">
        "Distilling generations of artisanal wisdom into modern olfactory experiences. A signature of timeless elegance and unparalleled quality."
       </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
       <div className="flex flex-col gap-1 border-l-2 border-brand-gold pl-4">
        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Inventory</span>
        <span className="text-xl font-bold text-gray-900">{brand.inventoryCount || 0}+ Pieces</span>
       </div>
       <div className="flex flex-col gap-1 border-l-2 border-brand-gold pl-4">
        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Category</span>
        <span className="text-xl font-bold text-gray-900 truncate">{brand.category || "Luxury Perfume"}</span>
       </div>
       <div className="flex flex-col gap-1 border-l-2 border-brand-gold pl-4">
        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Status</span>
        <span className="text-xl font-bold text-brand-gold">{brand.status || "Active"}</span>
       </div>
      </div>
     </div>

     <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
       <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Signature Collection</h4>
       <Link
        href={`/products?brand=${encodeURIComponent(brand.name)}`}
        className="text-[10px] font-bold text-brand-gold uppercase tracking-widest hover:tracking-[0.2em] transition-all"
       >
        View All
       </Link>
      </div>

      {isLoadingProducts ? (
       <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
         <ProductSkeleton key={i} viewMode="grid" />
        ))}
       </div>
      ) : products.length > 0 ? (
       <div className="grid grid-cols-2 gap-6">
        {products.map((p: any) => (
         <div key={p._id} className="group cursor-pointer">
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4">
           <Image
            src={p.productImage || "/placeholder.png"}
            alt={p.name}
            fill
            className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
            sizes="250px"
           />
          </div>
          <h5 className="text-[14px] font-bold text-gray-900 truncate mb-1">{p.name}</h5>
          <p className="text-[13px] text-brand-gold font-black">₦{p.price.toLocaleString()}</p>
         </div>
        ))}
       </div>
      ) : (
       <div className="py-10 bg-gray-50 rounded-3xl flex flex-col items-center justify-center text-center gap-3">
        <Icon name="shopping_bag" size="lg" className="text-gray-200" />
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No pieces currently listed</span>
       </div>
      )}
     </div>

     <div className="flex flex-col md:flex-row gap-4 mt-4">
      <Link
       href={`/products?brand=${encodeURIComponent(brand.name)}`}
       className="flex-1"
      >
       <Button className="w-full h-16 bg-brand-charcoal text-white hover:bg-brand-gold font-bold uppercase text-xs tracking-[0.2em] shadow-xl group transition-all">
        Discover Collection <Icon name="chevron_right" size="sm" className="ml-2 group-hover:translate-x-1 transition-transform" />
       </Button>
      </Link>
      <Button
       variant="outline"
       onClick={onClose}
       className="px-8 h-16 text-gray-400 border-gray-200 hover:text-gray-900 hover:border-gray-900 font-bold uppercase text-[10px] tracking-widest"
      >
       Close Explorer
      </Button>
     </div>
    </div>
   </div>
  </Modal>
 );
};
