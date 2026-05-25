"use client";

import React, { useState } from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Icon } from "@/app/components/Icon";
import { FilterSidebar } from "@/app/components/Products/FilterSidebar";
import { ListingControlBar } from "@/app/components/Products/ListingControlBar";
import { ProductGridItem, ProductListItem } from "@/app/components/Products/ProductItems";
import { ProductSkeleton } from "@/app/components/Skeleton/ProductSkeleton";
import { ProductMobileHeader } from "@/app/components/Products/ProductMobileHeader";
import { CategoryChips } from "@/app/components/Products/CategoryChips";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { RecommendedProducts } from "@/app/components/Products/RecommendedProducts";
import { Pagination } from "@/app/components/Navigation/Pagination";
import { QuickViewModal } from "@/app/components/Products/QuickViewModal";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useGetPublicProductsQuery, useGetPublicCategoriesQuery, useGetPublicBrandsQuery } from "@/lib/redux/services/boutiqueApi";

import { useFilter } from "@/app/context/FilterContext";
import { DEFAULT_FILTERS } from "@/app/types/products";
import { ViewMode } from "../types/products";
import { useSocket } from "@/app/context/SocketContext";
import { toast } from "sonner";
import { useApiError } from "@/app/hooks/useApiError";

const ProductsPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const { filters, setFilters } = useFilter();
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const { data: categoriesResponse, isLoading: isLoadingCategories, isError: isErrorCategories, error: errorCategories } = useGetPublicCategoriesQuery();
  const categories = categoriesResponse?.data && 'categories' in categoriesResponse.data
    ? categoriesResponse.data.categories
    : (Array.isArray(categoriesResponse?.data) ? categoriesResponse.data : []);
  useApiError(isErrorCategories, errorCategories, "Failed to load categories");

  const { data: brandsResponse, isLoading: isLoadingBrands, isError: isErrorBrands, error: errorBrands } = useGetPublicBrandsQuery();
  const brands = brandsResponse?.data && 'brands' in brandsResponse.data
    ? brandsResponse.data.brands
    : (Array.isArray(brandsResponse?.data) ? brandsResponse.data : []);
  useApiError(isErrorBrands, errorBrands, "Failed to load brands");

  // Lock body scroll when mobile filter drawer is open
  React.useEffect(() => {
    if (isFilterDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFilterDrawerOpen]);

  const searchParams = useSearchParams();
  const searchBarQuery = searchParams.get("search")?.toLowerCase() || "";

  React.useEffect(() => {
    const brandParam = searchParams.get("brand");
    const categoryParam = searchParams.get("category");
    const subCategoryParam = searchParams.get("subCategory");

    if (brandParam || categoryParam || subCategoryParam) {
      setFilters(prev => ({
        ...prev,
        brand: brandParam || prev.brand,
        category: categoryParam || prev.category,
        subCategory: subCategoryParam || ""
      }));
    }
  }, [searchParams, setFilters]);

  const {
    data: productsResponse,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
    refetch: refetchProducts
  } = useGetPublicProductsQuery({
    category: filters.category || undefined,
    brand: filters.brand || undefined,
    search: searchBarQuery,
    subCategory: filters.subCategory || undefined,
    page: currentPage,
    limit: rowsPerPage,
    sort: sortBy,
    minPrice: filters.minPrice || undefined,
    maxPrice: filters.maxPrice || undefined,
    rating: filters.rating || undefined
  });
  useApiError(isErrorProducts, errorProducts, "Failed to load products");

  const { on, off } = useSocket();

  React.useEffect(() => {
    const handleProductUpdate = (data: any) => {
      refetchProducts();
      if (data?.type === 'update') {
        toast.info(`Product Updated: ${data.product?.name}`, {
          description: "Prices and stock levels have been refreshed.",
          icon: <Icon name="arrow-refresh-01" folder="dashboardIcon" size="sm" className="text-brand-gold" />
        });
      } else if (data?.type === 'create') {
        toast.success(`New Product: ${data.product?.name}`, {
          description: "Check out our latest arrival!",
          icon: <Icon name="circle-plus" folder="dashboardIcon" size="sm" className="text-emerald-500" />
        });
      }
    };

    on("PRODUCT_UPDATED", handleProductUpdate);
    return () => off("PRODUCT_UPDATED", handleProductUpdate);
  }, [on, off, refetchProducts]);

  const products = productsResponse?.data?.products || [];
  const pagination = productsResponse?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;

  const formattedProducts = products?.map((p: any) => ({
    id: p?._id,
    title: p?.name,
    price: `\u20A6${p?.price.toLocaleString()}`,
    originalPrice: p?.discountPrice ? `\u20A6${p?.discountPrice.toLocaleString()}` : undefined,
    rating: (p as any).ratings || 0,
    orders: (p as any).soldCount || 0,
    shipping: "Standard Shipping",
    description: p?.description || "",
    image: p?.productImage || "/placeholder.png",
    category: p?.category?.name,
    onQuickView: (prod: any) => setQuickViewProduct(prod),
    brand: p?.brand?.name || "Artisanal House",
    size: p?.size || "",
    volume: p?.volume || "",
    stockStatus: p?.stockStatus || "In Stock",
    stock: p?.stock || 0,
    isUnlimited: p?.isUnlimited || false,
    media: p?.media || [],
    isNew: new Date(p?.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    isFeatured: p?.isFeatured
  }));

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-black">
      {/* Desktop Header */}
      <div className="hidden md:block sticky top-0 z-[80]">
        <Header />
      </div>

      {/* Mobile Header */}
      <ProductMobileHeader title={filters.category || ""} />

      <div className="flex-1 max-w-[1440px] mx-auto px-4 md:px-10 lg:px-16 py-0 md:py-6 flex flex-col gap-0 md:gap-6 w-full">
        {/* Category Chips (Mobile only) */}
        <CategoryChips
          categories={categories.map(c => c.name)}
          selectedCategory={filters.category}
          onSelect={(cat) => setFilters(prev => ({ ...prev, category: cat, subCategory: "" }))}
          className="md:hidden"
        />

        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Fragrances", href: "/products" },
            { label: "All Collections" }
          ]}
          className="hidden md:flex text-[10px] tracking-widest text-gray-400 overflow-x-auto whitespace-nowrap scrollbar-none pb-2 px-4 md:px-0 border-b border-gray-200"
        />

        <div className="flex flex-col lg:flex-row gap-6 items-start px-0 md:px-0 mt-3 md:mt-0">
          {/* Sidebar (Desktop only) */}
          <div className="hidden lg:block w-full lg:w-64 sticky top-24 self-start max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
            <FilterSidebar
              categories={categories}
              isLoadingCategories={isLoadingCategories}
              brands={brands}
              isLoadingBrands={isLoadingBrands}
              minPrice={pagination?.minPrice}
              maxPrice={pagination?.maxPrice}
            />
          </div>

          {/* Listing Area */}
          <div className="flex-1 flex flex-col w-full">
            <ListingControlBar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              count={pagination?.total || formattedProducts.length}
              filters={filters}
              onFiltersChange={setFilters}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onFilterClick={() => setIsFilterDrawerOpen(true)}
            />

            {isLoadingProducts ? (
              <div className={`
                ${viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5"
                  : "flex flex-col gap-3 md:gap-4"}
              `}>
                {Array.from({ length: rowsPerPage }).map((_, i) => (
                  <ProductSkeleton key={i} viewMode={viewMode} />
                ))}
              </div>
            ) : formattedProducts.length > 0 ? (
              <div className={`
                ${viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-l border-gray-200"
                  : "flex flex-col border-x border-gray-200"}
              `}>
                {formattedProducts.map(product => (
                  viewMode === "grid"
                    ? <ProductGridItem key={product.id} product={product} variant="joined" />
                    : <ProductListItem key={product.id} product={product} variant="joined" />
                ))}
              </div>
            ) : (
              <div className="py-24 flex flex-col items-center justify-center gap-6 text-center w-full min-h-[400px]">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 border border-gray-200 shadow-inner">
                  <Icon name="search" size="xl" />
                </div>
                <div className="max-w-md">
                  <h3 className="text-2xl font-bold text-[#121212] tracking-tight">No products found</h3>
                  <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                    We couldn't find any artisanal pieces matching your current filters.
                    Try adjusting your search or clearing some filters to explore our full collection.
                  </p>
                  <button
                    onClick={() => {
                      setFilters(DEFAULT_FILTERS);
                      if (typeof window !== "undefined") {
                        window.history.replaceState({}, "", window.location.pathname);
                      }
                    }}
                    className="mt-8 px-8 py-3 bg-black text-white text-[11px] font-bold tracking-widest hover:bg-brand-gold transition-all shadow-lg active:scale-95"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Pagination */}
            <div className="mt-8 flex justify-center lg:justify-end px-4 md:px-0">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                totalItems={pagination?.total || 0}
                onPageChange={handlePageChange}
                showSizeChanger={true}
                pageSize={rowsPerPage}
                onPageSizeChange={(size) => {
                  setRowsPerPage(size);
                  setCurrentPage(1);
                }}
                className="w-full"
              />
            </div>

            {/* Recommended Products */}
            <RecommendedProducts
              products={formattedProducts.slice(0, 4)}
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
                <FilterSidebar
                  categories={categories}
                  isLoadingCategories={isLoadingCategories}
                  brands={brands}
                  isLoadingBrands={isLoadingBrands}
                  minPrice={pagination?.minPrice}
                  maxPrice={pagination?.maxPrice}
                />
                <div className="p-4 border-t border-gray-200 flex gap-3">
                  <button
                    onClick={() => setIsFilterDrawerOpen(false)}
                    className="flex-1 py-3 bg-brand-gold text-white font-bold hover:bg-brand-gold/90"
                  >
                    Show Results
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <QuickViewModal
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        product={quickViewProduct}
      />
    </div>
  );
};

export default ProductsPage;
