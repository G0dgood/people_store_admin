"use client";

import React from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { HeroSection } from "@/app/components/Home/HeroSection";
import { HeroUserCard } from "@/app/components/Home/HeroUserCard";
import { DealsSection } from "@/app/components/Home/DealsSection";
import { CategorySection } from "@/app/components/Home/CategorySection";
import { InquiryForm } from "@/app/components/Home/InquiryForm";
import { ExtraServices } from "@/app/components/Home/ExtraServices";
import { RegionSuppliers } from "@/app/components/Home/RegionSuppliers";
import RecommendedItems from "./components/Home/RecommendedItems";


const fragranceProducts = [
 { name: "Midnight Bloom", price: "85", image: "/brandImage/product_1.png" },
 { name: "Gucci Guilty", price: "155", image: "/brandImage/gucci_guilty.png" },
 { name: "Gucci Intense Oud", price: "165", image: "/brandImage/product_gucci.png" },
 { name: "Fendi Fan di Fendi", price: "135", image: "/brandImage/product_fendi_2.jpeg" },
 { name: "Amber Wood", price: "110", image: "/brandImage/product_5.png" },
 { name: "Fendi Furiosa", price: "155", image: "/brandImage/product_fendi_3.jpeg" },
 { name: "Jasmine Night", price: "88", image: "/brandImage/product_7.png" },
 { name: "Sandalwood Essence", price: "92", image: "/brandImage/product_8.png" }
];

const skincareProducts = [
 { name: "Hyaluronic Serum", price: "45", image: "/brandImage/product_9.png" },
 { name: "Retinol Cream", price: "58", image: "/brandImage/product_10.png" },
 { name: "Vitamin C Glow", price: "42", image: "/brandImage/product_11.png" },
 { name: "Cleansing Balm", price: "35", image: "/brandImage/product_12.png" },
 { name: "Eye Repair Gel", price: "38", image: "/brandImage/product_13.png" },
 { name: "Hydrating Mist", price: "28", image: "/brandImage/product_9.png" },
 { name: "SPF 50 Shield", price: "32", image: "/brandImage/product_10.png" },
 { name: "Night Recovery", price: "65", image: "/brandImage/product_11.png" }
];



const Home = () => {
 return (
  <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-sans text-black">
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

    <CategorySection
     title="Signature Fragrance"
     bannerImage="/brandImage/brand_banner.png"
     products={fragranceProducts}
    />

    <CategorySection
     title="Advanced Skincare"
     bannerImage="/brandImage/serene_story.png"
     products={skincareProducts}
    />

    <InquiryForm />

    <RecommendedItems />

    {/* <ExtraServices /> */}

    {/* <RegionSuppliers /> */}


   </div>


   <Footer />
  </div>
 );
};

export default Home;
