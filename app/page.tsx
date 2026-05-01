"use client";

import React from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { HeroSection } from "@/app/components/Home/HeroSection";
import { HeroUserCard } from "@/app/components/Home/HeroUserCard";
import { DealsSection } from "@/app/components/Home/DealsSection";
import { CategorySection } from "@/app/components/Home/CategorySection";
import { InquiryForm } from "@/app/components/Home/InquiryForm";
import { ArtisanalCollections } from "@/app/components/Home/ArtisanalCollections";
import { RegionSuppliers } from "@/app/components/Home/RegionSuppliers";
import RecommendedItems from "./components/Home/RecommendedItems";
import RecentlyViewed from "./components/Home/RecentlyViewed";
import { useGetPublicBrandsQuery, useGetPublicProductsQuery } from "@/lib/redux/services/boutiqueApi";
import { CategorySectionSkeleton } from "./components/Skeleton/CategorySectionSkeleton";

const BrandCategorySection = ({ brand, index }: { brand: any, index: number }) => {
 const { data: productsData } = useGetPublicProductsQuery({
  brand: brand._id,
  limit: 8
 });

 const formattedProducts = (productsData?.data?.products || []).map((p: any) => ({
  id: p._id,
  name: p.name,
  price: p.price.toString(),
  image: p.productImage || "/placeholder.png"
 }));

 if (formattedProducts.length === 0) return null;

 return (
  <CategorySection
   title={brand.name}
   category={brand.category}
   brandName={brand.name}
   bannerImage={brand.coverImage || brand.logo || "/brandImage/brand_banner.png"}
   products={formattedProducts}
   priority={index === 0}
  />
 );
};

const Home = () => {
 const { data: brandsData, isLoading: isLoadingBrands } = useGetPublicBrandsQuery();
 const brands = brandsData?.data || [];


 return (
  <div className="min-h-screen bg-white flex flex-col font-sans text-black">
   <Header />

   <div className="flex-1 w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-4 md:py-8 flex flex-col gap-8">

    {/* Top Hero Layout */}
    <div className="flex flex-col xl:flex-row gap-5">
     <div className="flex-1">
      <HeroSection />
     </div>
     {/* <HeroUserCard /> */}
    </div>

    <DealsSection />

    <div>
     {/* Dynamic Brand Sections */}
     {isLoadingBrands ? (
      <>
       <CategorySectionSkeleton />
       <CategorySectionSkeleton />
       <CategorySectionSkeleton />
      </>
     ) : (
      brands?.map((brand: any, idx: number) => (
       <BrandCategorySection key={brand._id} brand={brand} index={idx} />
      ))
     )}

    </div>


    {/* <InquiryForm /> */}

    <RecentlyViewed />
    <RecommendedItems />

    <ArtisanalCollections />

    {/* <RegionSuppliers /> */}

   </div>

   <Footer />
  </div>
 );
};

export default Home;
