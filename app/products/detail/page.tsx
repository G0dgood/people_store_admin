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
      { name: "Xiaomi Redmi 8 Original", price: "$32.00", image: "/images/iphone.jpg" },
      { name: "Xiaomi Redmi 8 Original", price: "$32.00", image: "/images/tablet.jpg" },
      { name: "Xiaomi Redmi 8 Original", price: "$32.00", image: "/images/laptop.jpg" },
      { name: "Xiaomi Redmi 8 Original", price: "$32.00", image: "/images/game_headphone.jpg" },
      { name: "Xiaomi Redmi 8 Original", price: "$32.00", image: "/images/watch.jpg" },
      { name: "Xiaomi Redmi 8 Original", price: "$32.00", image: "/images/camera.jpg" },
   ];

   return (
      <div className="flex flex-col min-h-screen bg-[#F7FAFC]">
         <Header />

         <main className="flex-1 max-w-[1440px] mx-auto px-4 md:px-6 py-4 md:py-6 flex flex-col gap-6 md:gap-8 w-full">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-gray-400 overflow-x-auto whitespace-nowrap scrollbar-none pb-2">
               <Link href="/" className="hover:text-brand-blue">Home</Link>
               <Icon name="chevron_right" size="xs" />
               <Link href="/products" className="hover:text-brand-blue">Clothings</Link>
               <Icon name="chevron_right" size="xs" />
               <Link href="#" className="hover:text-brand-blue">Men's wear</Link>
               <Icon name="chevron_right" size="xs" />
               <span className="text-gray-600 font-medium whitespace-nowrap">Summer clothing</span>
            </div>

            {/* Top Product Section */}
            <div className="bg-white border border-gray-200 md:rounded-lg p-4 md:p-6 flex flex-col lg:flex-row gap-6 md:gap-8">
               <ProductGallery />
               <ProductDetailsInfo />
               <div className="w-px bg-gray-100 hidden lg:block"></div>
               <SupplierCard />
            </div>

            {/* Mid Section: Tabs + You May Like */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
               <ProductTabs />
               <YouMayLike />
            </div>

            <RelatedProducts products={relatedProducts} />

            {/* Bottom Banner */}
            <DiscountBanner />
         </main>

         <Footer />
      </div>
   );
}
