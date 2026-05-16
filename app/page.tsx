
"use client";

import React from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { HeroSection } from "@/app/components/Home/HeroSection";
import { DealsSection } from "@/app/components/Home/DealsSection";
import { ArtisanalCollections } from "@/app/components/Home/ArtisanalCollections";
import RecommendedItems from "./components/Home/RecommendedItems";
import RecentlyViewed from "./components/Home/RecentlyViewed";
import { useGetPublicBrandsQuery } from "@/lib/redux/services/boutiqueApi";
import { CategorySectionSkeleton } from "./components/Skeleton/CategorySectionSkeleton";
import { BrandCategorySection } from "./components/Home/BrandCategorySection";
import { RegionSuppliers } from "./components/Home/RegionSuppliers";
import NewArrivals from "./components/NewArrivals";
import { TopBrands } from "./components/Home/TopBrands";


const Home = () => {
  const { data: brandsData, isLoading: isLoadingBrands } = useGetPublicBrandsQuery();
  const brands = brandsData?.data && 'brands' in brandsData.data
    ? brandsData.data.brands
    : (Array.isArray(brandsData?.data) ? brandsData.data : []);


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
        <TopBrands />
        {/* <ArtisanalCollections /> */}
        <NewArrivals />
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
