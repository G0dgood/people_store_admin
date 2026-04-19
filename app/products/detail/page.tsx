"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Icon } from "@/app/components/Icon";
import { ProductGallery } from "@/app/components/Products/ProductGallery";
import { ProductDetailsInfo } from "@/app/components/Products/ProductDetailsInfo";
import { SupplierCard } from "@/app/components/Products/SupplierCard";
import { ProductTabs } from "@/app/components/Products/ProductTabs";
import { YouMayLike } from "@/app/components/Products/YouMayLike";
import { DiscountBanner } from "@/app/components/Products/DiscountBanner";
import { RelatedProducts } from "@/app/components/Products/RelatedProducts";

export default function ProductDetailPage() {
   const relatedProducts = [
      { name: "Xiaomi Redmi 8 Original", price: "₦32.00", image: "/images/iphone.jpg" },
      { name: "Xiaomi Redmi 8 Original", price: "₦32.00", image: "/images/tablet.jpg" },
      { name: "Xiaomi Redmi 8 Original", price: "₦32.00", image: "/images/laptop.jpg" },
      { name: "Xiaomi Redmi 8 Original", price: "₦32.00", image: "/images/game_headphone.jpg" },
      { name: "Xiaomi Redmi 8 Original", price: "₦32.00", image: "/images/watch.jpg" },
      { name: "Xiaomi Redmi 8 Original", price: "₦32.00", image: "/images/camera.jpg" },
   ];

   return (
      <div className="flex flex-col min-h-screen bg-white">
         <Header />

         <div className="flex-1 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-4 md:py-8 flex flex-col gap-6 md:gap-10 w-full">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 overflow-x-auto whitespace-nowrap scrollbar-none pb-2 border-b border-gray-100">
               <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
               <Icon name="chevron_right" size="xs" />
               <Link href="/products" className="hover:text-brand-gold transition-colors">Fragrances</Link>
               <Icon name="chevron_right" size="xs" />
               <Link href="#" className="hover:text-brand-gold transition-colors">Women's</Link>
               <Icon name="chevron_right" size="xs" />
               <span className="text-gray-900 font-bold whitespace-nowrap">Signature Collection</span>
            </div>

            {/* Top Product Section */}
            <div className="bg-white flex flex-col lg:flex-row gap-8 lg:gap-16">
               <div className="flex-1">
                  <ProductGallery />
               </div>
               <div className="flex-1">
                  <ProductDetailsInfo />
               </div>
               {/* <SupplierCard /> */}
            </div>

            {/* Mid Section: Tabs + You May Like */}
            <div className="flex flex-col lg:flex-row gap-12 items-start mt-8">
               <div className="flex-1 w-full">
                  <ProductTabs />
               </div>
               <div className="w-full lg:w-80">
                  <YouMayLike />
               </div>
            </div>

            <RelatedProducts products={relatedProducts} />

            {/* Bottom Banner */}
            <DiscountBanner />
         </div>

         <Footer />
      </div>
   );
}
