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

import { useSearchParams } from "next/navigation";
import { useGetPublicProductByIdQuery, useGetPublicRelatedProductsQuery } from "@/lib/redux/services/boutiqueApi";
import { ProductDetailSkeleton } from "@/app/components/Skeleton/ProductDetailSkeleton";

export default function ProductDetailPage() {
   const searchParams = useSearchParams();
   const id = searchParams.get("id");

   const { data: productResponse, isLoading } = useGetPublicProductByIdQuery(id || "", {
      skip: !id
   });

   const { data: relatedResponse, isLoading: isLoadingRelated } = useGetPublicRelatedProductsQuery(id || "", {
      skip: !id
   });

   const product = productResponse?.data;
   const relatedProducts = (relatedResponse?.data || []).map(p => ({
      id: p._id,
      name: p.name,
      price: `₦${p.price.toLocaleString()}`,
      image: p.productImage || "/placeholder.png"
   }));

   if (isLoading) {
      return (
         <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <div className="flex-1 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-4 md:py-8 w-full">
               <ProductDetailSkeleton />
            </div>
            <Footer />
         </div>
      );
   }

   if (!product) {
      return (
         <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
               <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
               <Link href="/products" className="text-brand-gold hover:underline font-bold uppercase tracking-widest text-xs">Return to Boutique</Link>
            </div>
            <Footer />
         </div>
      );
   }

   return (
      <div className="flex flex-col min-h-screen bg-white">
         <Header />

         <div className="flex-1 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-4 md:py-8 flex flex-col gap-6 md:gap-10 w-full">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 overflow-x-auto whitespace-nowrap scrollbar-none pb-2 border-b border-gray-200">
               <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
               <Icon name="chevron_right" size="xs" />
               <Link href="/products" className="hover:text-brand-gold transition-colors">Boutique</Link>
               {product.category && (
                 <>
                   <Icon name="chevron_right" size="xs" />
                   <Link href={`/products?category=${product.category.name}`} className="hover:text-brand-gold transition-colors">{product.category.name}</Link>
                 </>
               )}
               <Icon name="chevron_right" size="xs" />
               <span className="text-gray-900 font-bold whitespace-nowrap">{product.name}</span>
            </div>

            {/* Top Product Section */}
            <div className="bg-white flex flex-col lg:flex-row gap-8 lg:gap-16">
               <div className="flex-1">
                  <ProductGallery 
                    images={[product.productImage]} 
                    title={product.name}
                  />
               </div>
               <div className="flex-1">
                  <ProductDetailsInfo product={product} />
               </div>
               {/* <SupplierCard /> */}
            </div>

            {/* Mid Section: Tabs + You May Like */}
            <div className="flex flex-col lg:flex-row gap-12 items-start mt-8">
               <div className="flex-1 w-full">
                  <ProductTabs product={product} />
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
