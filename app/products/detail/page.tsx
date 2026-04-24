"use client";

import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Icon } from "@/app/components/Icon";
import { ProductGallery } from "@/app/components/Products/ProductGallery";
import { ProductDetailsInfo } from "@/app/components/Products/ProductDetailsInfo";
import { ProductTabs } from "@/app/components/Products/ProductTabs";
import { YouMayLike } from "@/app/components/Products/YouMayLike";
import { DiscountBanner } from "@/app/components/Products/DiscountBanner";
import { RelatedProducts } from "@/app/components/Products/RelatedProducts";

export default function ProductDetailPage() {
   const relatedProducts = [
      { name: "Aura Pink Blossom", price: "₦40.00", image: "/web_images/perfume_product_1_square_1777031387712.png" },
      { name: "Aurore Noire Intense", price: "₦150.00", image: "/web_images/perfume_product_2_square_1777031402357.png" },
      { name: "Oceania Fresh Mist", price: "₦85.00", image: "/web_images/perfume_product_3_square_1777031417355.png" },
      { name: "Royale Luxe Parfum", price: "₦220.00", image: "/web_images/perfume_product_4_square_1777031431419.png" },
      { name: "Silver Aura Modern", price: "₦95.00", image: "/web_images/perfume_product_5_square_1777031445408.png" },
      { name: "Cedarwood & Amber Vintage", price: "₦110.00", image: "/web_images/perfume_product_6_square_1777031459453.png" },
   ];

   return (
      <div className="flex flex-col min-h-screen bg-white">
         <Header />

         <div className="flex-1 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-4 md:py-8 flex flex-col gap-6 md:gap-10 w-full">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 overflow-x-auto whitespace-nowrap scrollbar-none pb-2 border-b border-gray-200">
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
