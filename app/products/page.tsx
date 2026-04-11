"use client";

import React, { useState } from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Icon } from "@/app/components/Icon";
import { FilterSidebar } from "@/app/components/Products/FilterSidebar";
import { ListingControlBar } from "@/app/components/Products/ListingControlBar";
import { ProductGridItem, ProductListItem } from "@/app/components/Products/ProductItems";
import { Pagination } from "@/app/components/Navigation/Pagination";
import Link from "next/link";

const ProductsPage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const products = [
    {
      id: "1",
      title: "Canon EOS R5 Mirrorless Camera with 24-105mm Lens Black, ultra high resolution",
      price: "$998.00",
      originalPrice: "$1,128.00",
      rating: 4.8,
      orders: 154,
      shipping: "Free Shipping",
      description: "Experience the ultimate in photography with the Canon EOS R5. featuring a 45MP full-frame CMOS sensor and 8K video recording capabilities. This bundle includes the versatile 24-105mm lens for all your professional needs.",
      image: "/images/camera.jpg"
    },
    {
      id: "2",
      title: "Apple iPhone 14 Pro Max 128GB Deep Purple, unlocked and optimized for global speed",
      price: "$1,099.00",
      rating: 4.9,
      orders: 2310,
      shipping: "Fast Shipping",
      description: "The latest flagship from Apple featuring the Dynamic Island, 48MP main camera, and the lightning-fast A16 Bionic chip. Experience the best in mobile technology and premium design.",
      image: "/images/iphone.jpg"
    },
    {
      id: "3",
      title: "Sony WH-1000XM5 Noise Canceling Headphones with Auto NC Optimizer",
      price: "$348.00",
      originalPrice: "$399.00",
      rating: 4.7,
      orders: 890,
      shipping: "Free Shipping",
      description: "Industry-leading noise cancellation with two processors and eight microphones. Experience crystal clear sound and ultimate comfort with the newest Sony flagship headphones.",
      image: "/images/headphone.jpg"
    },
    {
      id: "4",
      title: "Samsung Galaxy Watch5 Pro Bluetooth SM-R920NZKAXAA Gray Titanium",
      price: "$449.00",
      rating: 4.5,
      orders: 450,
      shipping: "Free Shipping",
      description: "Advanced sleep coaching, improved battery life, and durability for your outdoor adventures. The perfect companion for your Samsung ecosystem.",
      image: "/images/watch.jpg"
    },
    {
      id: "5",
      title: "Microsoft Surface Laptop 5 13.5\" Touchscreen with Intel Core i7",
      price: "$1,299.00",
      originalPrice: "$1,499.00",
      rating: 4.6,
      orders: 210,
      shipping: "Free Shipping",
      description: "Blazing fast performance, sleek design, and a bright touchscreen for maximum productivity. Available in multiple premium finishes to fit your style.",
      image: "/images/laptop.jpg"
    },
    {
      id: "6",
      title: "GoPro HERO11 Black Waterproof Action Camera with 5.3K Video",
      price: "$399.00",
      rating: 4.8,
      orders: 1200,
      shipping: "Free Shipping",
      description: "Record your most extreme adventures in stunning detail with HyperSmooth 5.0 stabilization. Durable and waterproof to handle any environment.",
      image: "/images/camera.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-sans text-black">
      <Header />

      <main className="flex-1 max-w-[1440px] mx-auto px-4 md:px-6 py-4 md:py-6 flex flex-col gap-6 w-full">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-400 overflow-x-auto whitespace-nowrap scrollbar-none pb-2">
           <Link href="/" className="hover:text-brand-blue">Home</Link>
           <Icon name="chevron_right" size="xs" />
           <Link href="#" className="hover:text-brand-blue">Clothings</Link>
           <Icon name="chevron_right" size="xs" />
           <Link href="#" className="hover:text-brand-blue">Men's wear</Link>
           <Icon name="chevron_right" size="xs" />
           <span className="text-gray-600 font-medium">Summer clothing</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Sidebar */}
          <div className="w-full lg:w-64">
            <FilterSidebar />
          </div>

          {/* Listing Area */}
          <div className="flex-1 flex flex-col gap-4 w-full">
             <ListingControlBar 
               viewMode={viewMode} 
               onViewModeChange={setViewMode} 
               count={12906} 
             />

             <div className={`
                ${viewMode === "grid" 
                  ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-5" 
                  : "flex flex-col gap-3 md:gap-4"}
              `}>
                 {products.map(product => (
                   viewMode === "grid" 
                     ? <ProductGridItem key={product.id} product={product} />
                     : <ProductListItem key={product.id} product={product} />
                 ))}
             </div>

             {/* Bottom Pagination */}
             <div className="mt-4 flex justify-end">
                <Pagination totalPages={5} currentPage={1} onPageChange={() => {}} />
             </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;
