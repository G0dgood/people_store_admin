"use client";

import React, { useState } from "react";
import { Icon } from "@/app/components/Icon";
import { FilterSidebar } from "@/app/components/Products/FilterSidebar";
import { ListingControlBar } from "@/app/components/Products/ListingControlBar";
import { ProductGridItem, ProductListItem } from "@/app/components/Products/ProductItems";
import { ProductSkeleton } from "@/app/components/Skeleton/ProductSkeleton";
import { CategoryChips } from "@/app/components/Products/CategoryChips";
import { Pagination } from "@/app/components/Navigation/Pagination";
import { QuickViewModal } from "@/app/components/Products/QuickViewModal";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useGetPublicCategoriesQuery, useGetPublicBrandsQuery } from "@/lib/redux/services/boutiqueApi";
import { useGetProductsByOfficeQuery, useGetOfficeBySubdomainQuery } from "@/lib/redux/services/officeLocationApi";
import { useOfficeLocationInfo } from "@/app/context/OfficeLocationContext";
import { OfficeLocationHeader } from "../components/OfficeLocationHeader";
import OfficeLocationFooter from "../components/OfficeLocationFooter";
import { getShopUrl } from "../utils/storeUtils";
import { OfficeLocationBreadcrumbs } from "../components/OfficeLocationBreadcrumbs";
import { EmptyState } from "../components/empty-state";

import { useFilter } from "@/app/context/FilterContext";
import { DEFAULT_FILTERS } from "@/app/types/products";
import { ViewMode } from "@/app/types/products";
import { useSocket } from "@/app/context/SocketContext";
import { useApiError } from "@/app/hooks/useApiError";

export default function ProductsClient() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const { filters, setFilters } = useFilter();
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  const searchParams = useSearchParams();
  const searchBarQuery = searchParams.get("search")?.toLowerCase() || "";

  const { storeContext } = useOfficeLocationInfo();

  const subdomain = React.useMemo(() => {
    let found = "";
    searchParams.forEach((_, key) => {
      if (key.startsWith("subdomain/")) found = key.split("subdomain/")[1];
    });
    return found || searchParams.get("subdomain") || storeContext.subdomain;
  }, [searchParams, storeContext.subdomain]);

  const { data: officeRes } = useGetOfficeBySubdomainQuery(subdomain || "", {
    skip: !subdomain
  });
  const office = officeRes?.data;
  const officeId = office?._id || storeContext.officeId;

  React.useEffect(() => {
    const brandParam = searchParams.get("brand");
    const categoryParam = searchParams.get("category");

    if (brandParam || categoryParam) {
      setFilters(prev => ({
        ...prev,
        brand: brandParam || prev.brand,
        category: categoryParam || prev.category
      }));
    }
  }, [searchParams, setFilters]);

  const {
    data: productsResponse,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
    refetch: refetchProducts
  } = useGetProductsByOfficeQuery({
    officeId: officeId as string,
    category: filters.category || undefined,
    brand: filters.brand || undefined,
    search: searchBarQuery || undefined
  }, {
    skip: !officeId
  });
  useApiError(isErrorProducts, errorProducts, "Failed to load products");

  const { on, off } = useSocket();

  React.useEffect(() => {
    const handleProductUpdate = () => refetchProducts();
    on("PRODUCT_UPDATED", handleProductUpdate);
    return () => off("PRODUCT_UPDATED", handleProductUpdate);
  }, [on, off, refetchProducts]);

  const products = productsResponse?.data || [];

  const formattedProducts = products?.map((p: any) => ({
    id: p?._id,
    title: p?.name,
    price: `\u20A6${p?.price.toLocaleString()}`,
    originalPrice: p?.discountPrice ? `\u20A6${p?.discountPrice.toLocaleString()}` : undefined,
    rating: (p as any).ratings || 5,
    orders: (p as any).soldCount || 0,
    shipping: "Free Office Delivery",
    description: p?.description || "",
    image: p?.productImage || "/placeholder.png",
    category: p?.category?.name,
    onQuickView: (prod: any) => setQuickViewProduct(prod),
    brand: p?.brand?.name || "Artisanal House",
    stock: p?.stock || 0,
    isUnlimited: p?.isUnlimited || false,
    media: p?.media || [],
    detailUrl: (() => {
      const baseUrl = getShopUrl("/products/detail", subdomain, officeId);
      return `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}id=${p?._id}`;
    })()
  }));




  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-black">
      <OfficeLocationHeader />

      <div className="flex-1 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-6 flex flex-col gap-6 w-full">
        <OfficeLocationBreadcrumbs
          items={[
            { label: "Products" }
          ]}
        />

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar */}
          <div className="hidden lg:block w-64 sticky top-24 self-start max-h-[calc(100vh-120px)] overflow-y-auto pr-4">
            <FilterSidebar
              categories={categories}
              isLoadingCategories={isLoadingCategories}
              brands={brands}
              isLoadingBrands={isLoadingBrands}
            />
          </div>

          {/* Listing Area */}
          <div className="flex-1 flex flex-col gap-6 w-full">


            <ListingControlBar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              count={formattedProducts.length}
              filters={filters}
              onFiltersChange={setFilters}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onFilterClick={() => setIsFilterDrawerOpen(true)}
            />

            {isLoadingProducts ? (
              <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-l border-t border-gray-100" : "flex flex-col gap-4"}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={i} viewMode={viewMode} />
                ))}
              </div>
            ) : formattedProducts.length > 0 ? (
              <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-l border-t border-gray-100" : "flex flex-col gap-4"}>
                {formattedProducts.map(product => (
                  viewMode === "grid"
                    ? <ProductGridItem key={product.id} product={product} variant="joined" />
                    : <ProductListItem key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyState
                iconName="NOProduct"
                title="No products found"
                description="We couldn't find any products matching your current filters at this location. Try adjusting your search or clearing filters."
                linkLabel="Clear Filters"
                onClick={() => setFilters(DEFAULT_FILTERS)}
              />
            )}
          </div>
        </div>
      </div>

      <OfficeLocationFooter />

      <QuickViewModal
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        product={quickViewProduct}
      />
    </div>
  );
}
