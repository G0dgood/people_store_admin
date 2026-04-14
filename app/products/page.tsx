"use client";

import React, { useState } from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Icon } from "@/app/components/Icon";
import { FilterSidebar } from "@/app/components/Products/FilterSidebar";
import { ListingControlBar } from "@/app/components/Products/ListingControlBar";
import { ProductGridItem, ProductListItem } from "@/app/components/Products/ProductItems";
import { ProductMobileHeader } from "@/app/components/Products/ProductMobileHeader";
import { CategoryChips } from "@/app/components/Products/CategoryChips";
import { RecommendedProducts } from "@/app/components/Products/RecommendedProducts";
import { Pagination } from "@/app/components/Navigation/Pagination";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

interface FilterState {
  category: string | null;
  brands: string[];
  priceRange: [number, number];
  condition: string;
  ratings: number[];
}

const ProductsPage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    brands: ["Samsung"], // matching initial UI state
    priceRange: [200, 800],
    condition: "Any",
    ratings: [],
  });

  const categories = ["Tablets", "Phones", "Ipads", "Ipod", "Accessories", "Laptops"];

  const products = [
    {
      id: "1",
      title: "Canon EOS R5 Mirrorless Camera with 24-105mm Lens Black, ultra high resolution",
      price: "₦998.00",
      originalPrice: "₦1,128.00",
      rating: 4.8,
      orders: 154,
      shipping: "Free Shipping",
      description: "Experience the ultimate in photography with the Canon EOS R5. featuring a 45MP full-frame CMOS sensor and 8K video recording capabilities. This bundle includes the versatile 24-105mm lens for all your professional needs.",
      image: "/images/camera.jpg",
      category: "Electronics",
      brand: "Canon",
      condition: "Brand new"
    },
    {
      id: "2",
      title: "Apple iPhone 14 Pro Max 128GB Deep Purple, unlocked and optimized for global speed",
      price: "₦1,099.00",
      rating: 4.9,
      orders: 2310,
      shipping: "Fast Shipping",
      description: "The latest flagship from Apple featuring the Dynamic Island, 48MP main camera, and the lightning-fast A16 Bionic chip. Experience the best in mobile technology and premium design.",
      image: "/images/iphone.jpg",
      category: "Smartphones",
      brand: "Apple",
      condition: "Brand new"
    },
    {
      id: "3",
      title: "Sony WH-1000XM5 Noise Canceling Headphones with Auto NC Optimizer",
      price: "₦348.00",
      originalPrice: "₦399.00",
      rating: 4.7,
      orders: 890,
      shipping: "Free Shipping",
      description: "Industry-leading noise cancellation with two processors and eight microphones. Experience crystal clear sound and ultimate comfort with the newest Sony flagship headphones.",
      image: "/images/headphone.jpg",
      category: "Modern tech",
      brand: "Sony",
      condition: "Brand new"
    },
    {
      id: "4",
      title: "Samsung Galaxy Watch5 Pro Bluetooth SM-R920NZKAXAA Gray Titanium",
      price: "₦449.00",
      rating: 4.5,
      orders: 450,
      shipping: "Free Shipping",
      description: "Advanced sleep coaching, improved battery life, and durability for your outdoor adventures. The perfect companion for your Samsung ecosystem.",
      image: "/images/watch.jpg",
      category: "Electronics",
      brand: "Samsung",
      condition: "Refurbished"
    },
    {
      id: "5",
      title: "Microsoft Surface Laptop 5 13.5\" Touchscreen with Intel Core i7",
      price: "₦1,299.00",
      originalPrice: "₦1,499.00",
      rating: 4.6,
      orders: 210,
      shipping: "Free Shipping",
      description: "Blazing fast performance, sleek design, and a bright touchscreen for maximum productivity. Available in multiple premium finishes to fit your style.",
      image: "/images/laptop.jpg",
      category: "Modern tech",
      brand: "Microsoft",
      condition: "Brand new"
    },
    {
      id: "6",
      title: "GoPro HERO11 Black Waterproof Action Camera with 5.3K Video",
      price: "₦399.00",
      rating: 4.8,
      orders: 1200,
      shipping: "Free Shipping",
      description: "Record your most extreme adventures in stunning detail with HyperSmooth 5.0 stabilization. Durable and waterproof to handle any environment.",
      image: "/images/camera.jpg",
      category: "Electronics",
      brand: "GoPro",
      condition: "Brand new"
    }
  ];

  const filteredProducts = React.useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (filters.category && product.category !== filters.category) return false;

      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) return false;

      // Price filter
      const price = parseFloat(product.price.replace(/[₦$,]/g, ""));
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;

      // Condition filter
      if (filters.condition !== "Any" && product.condition !== filters.condition) return false;

      // Rating filter (show all if none selected, or match any selected min rating)
      if (filters.ratings.length > 0) {
        const minRating = Math.min(...filters.ratings);
        if (product.rating < minRating) return false;
      }

      return true;
    });
  }, [filters, products]);

  return (
  <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-sans text-black">
    {/* Desktop Header */}
    <div className="hidden md:block">
      <Header />
    </div>
    
    {/* Mobile Header */}
    <ProductMobileHeader title={filters.category || "Mobile accessory"} />

    <main className="flex-1 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-0 md:py-6 flex flex-col gap-0 md:gap-6 w-full">
      {/* Category Chips (Mobile only) */}
      <CategoryChips 
        categories={categories}
        selectedCategory={filters.category}
        onSelect={(cat) => setFilters(prev => ({ ...prev, category: cat }))}
        className="md:hidden"
      />

     {/* Breadcrumbs */}
     <div className="hidden md:flex items-center gap-2 text-sm text-gray-400 overflow-x-auto whitespace-nowrap scrollbar-none pb-2 px-4 md:px-0">
     <Link href="/" className="hover:text-brand-blue">Home</Link>
     <Icon name="chevron_right" size="xs" />
     <Link href="#" className="hover:text-brand-blue">Clothings</Link>
     <Icon name="chevron_right" size="xs" />
     <Link href="#" className="hover:text-brand-blue">Men's wear</Link>
     <Icon name="chevron_right" size="xs" />
     <span className="text-gray-600 font-medium">Summer clothing</span>
    </div>

    <div className="flex flex-col lg:flex-row gap-6 items-start px-4 md:px-0 mt-3 md:mt-0">
     {/* Sidebar (Desktop only) */}
     <div className="hidden lg:block w-full lg:w-64">
      <FilterSidebar filters={filters} setFilters={setFilters} />
     </div>

     {/* Listing Area */}
     <div className="flex-1 flex flex-col gap-4 w-full">
      <ListingControlBar
       viewMode={viewMode}
       onViewModeChange={setViewMode}
       count={filteredProducts.length}
       filters={filters}
       onFiltersChange={setFilters}
       onFilterClick={() => setIsFilterDrawerOpen(true)}
      />

      <div className={`
                ${viewMode === "grid"
        ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-5"
        : "flex flex-col gap-3 md:gap-4"}
              `}>
       {filteredProducts.map(product => (
        viewMode === "grid"
         ? <ProductGridItem key={product.id} product={product} />
         : <ProductListItem key={product.id} product={product} />
       ))}
      </div>

      {/* Bottom Pagination */}
      <div className="mt-4 flex justify-end px-4 md:px-0">
       <Pagination totalPages={5} currentPage={1} onPageChange={() => { }} />
      </div>

      {/* Recommended Products */}
      <RecommendedProducts 
        products={[
          {
            id: "r1",
            title: "Solid Backpack blue jeans large size",
            price: "₦10.30",
            image: "/images/bag.jpg"
          },
          {
            id: "r2",
            title: "T-shirts with multiple colors, for men",
            price: "₦10.30",
            image: "/images/shirt.jpg"
          },
          {
            id: "r3",
            title: "Smart watch premium edition",
            price: "₦10.30",
            image: "/images/watch.jpg"
          },
          {
            id: "r4",
            title: "Leather wallet for men",
            price: "₦10.30",
            image: "/images/wallet.jpg"
          }
        ]}
      />
     </div>
    </div>

   </main>

   <Footer />

   {/* Mobile Filter Drawer */}
   <AnimatePresence>
     {isFilterDrawerOpen && (
       <>
         <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           onClick={() => setIsFilterDrawerOpen(false)}
           className="fixed inset-0 bg-black/50 z-[100] lg:hidden"
         />
         <motion.div 
           initial={{ x: "100%" }}
           animate={{ x: 0 }}
           exit={{ x: "100%" }}
           transition={{ type: "spring", damping: 25, stiffness: 200 }}
           className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-[110] lg:hidden flex flex-col shadow-2xl"
         >
           <div className="flex items-center justify-between p-4 border-b border-gray-100">
             <h2 className="text-lg font-bold">Filters</h2>
             <button 
               onClick={() => setIsFilterDrawerOpen(false)}
               className="p-2 hover:bg-gray-100 rounded-full transition-colors"
             >
               <Icon name="close" size="md" />
             </button>
           </div>
           <div className="flex-1 overflow-y-auto p-4">
             <FilterSidebar filters={filters} setFilters={setFilters} />
           </div>
           <div className="p-4 border-t border-gray-100 flex gap-3">
             <button 
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex-1 py-3 bg-brand-blue text-white font-bold rounded-lg hover:bg-brand-blue/90"
             >
               Show Results
             </button>
           </div>
         </motion.div>
       </>
     )}
   </AnimatePresence>
  </div>
 );
};

export default ProductsPage;
