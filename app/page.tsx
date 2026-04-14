"use client";

import React from "react";
import Image from "next/image";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { HeroSection } from "@/app/components/Home/HeroSection";
import { HeroUserCard } from "@/app/components/Home/HeroUserCard";
import { DealsSection } from "@/app/components/Home/DealsSection";
import { CategorySection } from "@/app/components/Home/CategorySection";
import { InquiryForm } from "@/app/components/Home/InquiryForm";
import { ExtraServices } from "@/app/components/Home/ExtraServices";
import { RegionSuppliers } from "@/app/components/Home/RegionSuppliers";
import { Newsletter } from "@/app/components/Home/Newsletter";
import Link from "next/link";

const homeOutdoorProducts = [
 { name: "Soft chairs", price: "19", image: "/images/chair.jpg" },
 { name: "Kitchen mixer", price: "25", image: "/images/Kitchen mixer.png" },
 { name: "Smart watch", price: "11", image: "/images/watch.jpg" },
 { name: "Home plant", price: "15", image: "/images/plant.jpg" },
 { name: "Coffee maker", price: "19", image: "/images/Coffee maker.png" },
 { name: "Bed linens", price: "28", image: "/images/cloth.jpg" },
 { name: "Kitchen pot", price: "12", image: "/images/pot.jpg" },
 { name: "Home hanger", price: "10", image: "/images/hanger.jpg" }
];

const electronicsProducts = [
 { name: "Smart watches", price: "19", image: "/images/watch.jpg" },
 { name: "Cameras", price: "89", image: "/images/camera.jpg" },
 { name: "Headphones", price: "10", image: "/images/headphone.jpg" },
 { name: "Smartphones", price: "19", image: "/images/iphone.jpg" },
 { name: "Laptops", price: "19", image: "/images/laptop.jpg" },
 { name: "Gaming sets", price: "19", image: "/images/game_headphone.jpg" },
 { name: "Tablets", price: "19", image: "/images/tablet.jpg" },
 { name: "Accessories", price: "19", image: "/images/jug.jpg" }
];

const recommendedItems = [
 { title: "T-shirts with multiple colors, for men", price: "$10.30", image: "/images/shirt.jpg" },
 { title: "Jeans shorts for men blue color", price: "$10.30", image: "/images/shorts.jpg" },
 { title: "Brown winter coat medium size", price: "$12.50", image: "/images/jacket.jpg" },
 { title: "Jeans bag for travel for men", price: "$34.00", image: "/images/bag.jpg" },
 { title: "Leather wallet black color for men", price: "$99.00", image: "/images/wallet.jpg" },
 { title: "Canon camera black, 100x zoom", price: "$9.99", image: "/images/camera.jpg" },
 { title: "Headphone for gaming with mic", price: "$8.99", image: "/images/game_headphone.jpg" },
 { title: "Electric kettle 1.2L glass", price: "$10.30", image: "/images/pot.jpg" },
];

const Home = () => {
 return (
  <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-sans text-black">
   <Header />

   <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-4 md:py-8 flex flex-col gap-8">

    {/* Top Hero Layout */}
    <div className="flex flex-col xl:flex-row gap-5">
     <div className="flex-1">
      <HeroSection />
     </div>
     <HeroUserCard />
    </div>

    <DealsSection />

    <CategorySection
     title="Home and outdoor"
     bannerImage="/web_images/Group 969.png"
     products={homeOutdoorProducts}
    />

    <CategorySection
     title="Consumer electronics and gadgets"
     bannerImage="/web_images/Group 970.png"
     products={electronicsProducts}
    />

    <InquiryForm />

    {/* Recommended Items */}
    <section className="w-full">
     <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-gray-900">Recommended items</h3>
     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
      {recommendedItems.map((item, idx) => (
       <Link
        key={idx}
        href="/products/detail"
        className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer group"
       >
        <div className="w-full aspect-square relative mb-2">
         <Image src={item.image} alt={item.title} fill className="object-contain group-hover:scale-105 transition-transform" />
        </div>
        <div className="flex flex-col gap-1">
         <span className="font-bold text-gray-900">{item.price}</span>
         <p className="text-sm text-gray-500 line-clamp-2 leading-tight group-hover:text-brand-blue transition-colors">{item.title}</p>
        </div>
       </Link>
      ))}
     </div>
    </section>

    <ExtraServices />

    <RegionSuppliers />


   </main>
   <Newsletter />

   <Footer />
  </div>
 );
};

export default Home;
