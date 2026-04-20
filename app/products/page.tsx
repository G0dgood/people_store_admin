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

import { FilterState, DEFAULT_FILTERS, ViewMode } from "@/app/types/products";

const ProductsPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const categories = ["Signature Fragrance", "Luxury Skincare", "Boutique Gift Sets", "Body & Bath", "Home Fragrance", "Men's Grooming"];

  const products = [
    {
      id: "1",
      title: "Signature Oud Intense Discovery Set",
      price: "₦285.00",
      originalPrice: "₦320.00",
      rating: 4.9,
      orders: 842,
      shipping: "Express Shipping",
      description: "A profound journey through the heart of artisanal perfumery. This discovery set features our flagship intense Oud, masterfully balanced with midnight bloom and rare spices for an unforgettable sensory trajectory.",
      image: "/brandImage/product_1.png",
      category: "Signature Fragrance",
      brand: "Bloom & Mist",
      condition: "Intense"
    },
    {
      id: "2",
      title: "Prada Paradoxe Eau de Parfum - Refillable",
      price: "₦142.00",
      rating: 4.8,
      orders: 2310,
      shipping: "Free Shipping",
      description: "A floral ambery fragrance that embraces the paradoxes of iconic ingredients to reveal new scented sensations. Featuring notes of Neroli, Amber, and Musk for a timeless yet avant-garde signature.",
      image: "/brandImage/product_2.png",
      category: "Signature Fragrance",
      brand: "Prada",
      condition: "Essential"
    },
    {
      id: "3",
      title: "Radiant Skin Ritual - Hyaluronic & Vitamin C Duo",
      price: "₦195.00",
      originalPrice: "₦240.00",
      rating: 4.7,
      orders: 1540,
      shipping: "Fast Shipping",
      description: "A high-fidelity skincare orchestration designed to materialize absolute radiance. This duo synchronizes the moisture-locking power of Hyaluronic Acid with the brightening intensity of stabilized Vitamin C.",
      image: "/brandImage/product_3.png",
      category: "Luxury Skincare",
      brand: "Bloom & Mist",
      condition: "Discovery"
    },
    {
      id: "4",
      title: "Versace Eros Flame - Eau de Parfum Spray",
      price: "₦110.00",
      rating: 4.6,
      orders: 450,
      shipping: "Free Shipping",
      description: "A fragrance for a strong, passionate, self-confident man who is deeply in touch with his emotions. Characterized by strong contrasts in which the most noble and elegant ingredients enrich and enhance one another.",
      image: "/brandImage/product_4.png",
      category: "Men's Grooming",
      brand: "Versace",
      condition: "Essential"
    },
    {
      id: "5",
      title: "Midnight Noir Body & Bath Collection",
      price: "₦165.00",
      originalPrice: "₦185.00",
      rating: 4.8,
      orders: 210,
      shipping: "Express Delivery",
      description: "Transform your daily ritual into a spa-level experience. Infused with midnight noir essences, this collection features a silk-texture body wash and a deep-hydration luxury lotion.",
      image: "/brandImage/product_5.png",
      category: "Body & Bath",
      brand: "Bloom & Mist",
      condition: "Essential"
    },
    {
      id: "6",
      title: "Gucci Guilty Absolute Pour Homme",
      price: "₦125.00",
      rating: 4.7,
      orders: 1200,
      shipping: "Fast Shipping",
      description: "Created using a particular blend with a structure that remains unchanged from the first time it is applied to the skin. Leather accord and goldenwood are custom mixed with natural extract of the Nootka Cypress.",
      image: "/brandImage/product_6.png",
      category: "Signature Fragrance",
      brand: "Gucci",
      condition: "Intense"
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
    <div className="min-h-screen bg-white flex flex-col font-sans text-black">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Mobile Header */}
      <ProductMobileHeader title={filters.category || "Mobile accessory"} />

      <div className="flex-1 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-0 md:py-6 flex flex-col gap-0 md:gap-6 w-full">
        {/* Category Chips (Mobile only) */}
        <CategoryChips
          categories={categories}
          selectedCategory={filters.category}
          onSelect={(cat) => setFilters(prev => ({ ...prev, category: cat }))}
          className="md:hidden"
        />

        {/* Breadcrumbs */}
        <div className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 overflow-x-auto whitespace-nowrap scrollbar-none pb-2 px-4 md:px-0 border-b border-gray-100">
          <Link href="/" className="hover:text-brand-gold transition-colors font-bold">Home</Link>
          <Icon name="chevron_right" size="xs" />
          <Link href="/products" className="hover:text-brand-gold transition-colors font-bold">Fragrances</Link>
          <Icon name="chevron_right" size="xs" />
          <span className="text-gray-900 font-bold">All Collections</span>
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

      </div>

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
              className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-[110] lg:hidden flex flex-col border-l border-gray-200"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold">Filters</h2>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Icon name="close" size="md" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <FilterSidebar filters={filters} setFilters={setFilters} />
              </div>
              <div className="p-4 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="flex-1 py-3 bg-brand-blue text-white font-bold hover:bg-brand-blue/90"
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
