"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  useGetOfficeBySubdomainQuery,
  useGetProductsByOfficeQuery
} from "@/lib/redux/services/officeLocationApi";
import { SVGLoaderFetch } from "@/app/components/Options";
import { ProductGridItem } from "@/app/components/Products/ProductItems";
import { OfficeLocationHeader } from "./components/OfficeLocationHeader";
import OfficeLocationFooter from "./components/OfficeLocationFooter";
import { HiOutlineMapPin, HiOutlineClock, HiOutlinePhone, HiOutlineEnvelope, HiOutlineShieldCheck } from "react-icons/hi2";
import { formatPrice } from "@/app/utils/formatPrice";
import Link from "next/link";
import { EmptyState } from "./components/empty-state";
import { CategorySectionSkeleton } from "../components/Skeleton/CategorySectionSkeleton";
import { OfficeLocationBrandCategorySection } from "./components/OfficeLocationBrandCategorySection";
import { useOfficeLocationInfo } from "@/app/context/OfficeLocationContext";
import { getShopUrl } from "./utils/storeUtils";
import OfficeProductsPage from "./products/page";

export default function OfficeLocationPage() {
  const searchParams = useSearchParams();
  const { storeContext } = useOfficeLocationInfo();

  // Extract subdomain from format ?subdomain/name or ?subdomain=name
  const subdomain = useMemo(() => {
    // Check all keys for the "subdomain/" pattern
    let found = "";
    searchParams.forEach((_, key) => {
      if (key.startsWith("subdomain/")) {
        found = key.split("subdomain/")[1];
      }
    });
    if (found) return found;

    // Fallback to standard ?subdomain=value
    return searchParams.get("subdomain");
  }, [searchParams]);

  const { data: officeRes, isLoading: isLoadingOffice } = useGetOfficeBySubdomainQuery(subdomain || "", {
    skip: !subdomain
  });

  const office = officeRes?.data;

  // Sync context
  const { updateStoreContext } = useOfficeLocationInfo();
  React.useEffect(() => {
    if (office) {
      updateStoreContext({
        officeId: office._id,
        subdomain: office.subdomain,
        officeName: office.name
      });
    }
  }, [office]);

  // Fetch localized products
  const { data: productsRes, isLoading: isLoadingProducts } = useGetProductsByOfficeQuery({
    officeId: office?._id || "",
    category: searchParams.get("category") || undefined,
    search: searchParams.get("search") || undefined,
    brand: searchParams.get("brand") || undefined
  }, {
    skip: !office?._id
  });

  const products = productsRes?.data || [];

  // Group products by brand
  const brands = useMemo(() => {
    const brandMap = new Map();
    products.forEach((p: any) => {
      if (p.brand && !brandMap.has(p.brand._id)) {
        brandMap.set(p.brand._id, p.brand);
      }
    });
    return Array.from(brandMap.values());
  }, [products]);

  if (!subdomain) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-black text-gray-900">Location Not Specified</h1>
          <p className="text-gray-500 max-w-md">Please use a valid office link to view local inventory and details.</p>
        </div>
      </div>
    );
  }



  if (!office) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-black text-rose-500">Office Not Found</h1>
          <p className="text-gray-500 max-w-md">We couldn't find an office location with the subdomain "{subdomain}".</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <OfficeLocationHeader />
      {/* Products Section */}
      <section className="pt-10 pb-32 md:pb-20 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        {/* <div>
            {isLoadingProducts ? (
              <>
                <CategorySectionSkeleton />
                <CategorySectionSkeleton />
                <CategorySectionSkeleton />
              </>
            ) : brands.length > 0 ? (
              brands.map((brand: any, idx: number) => (
                <div key={brand._id} className="mb-16">
                  <OfficeLocationBrandCategorySection
                    brand={brand}
                    index={idx}
                    productDetailPath={getShopUrl("/products/detail", subdomain, storeContext.officeId)}
                    products={products.filter((p: any) => p.brand?._id === brand._id)}
                  />
                </div>
              ))
            ) : (
              <EmptyState
                iconName="NOProduct"
                title="No products found"
                description="This branch currently has no products assigned to its inventory. Please check back later or explore other locations."
              />
            )}
          </div> */}
        <OfficeProductsPage />
      </section>

      <OfficeLocationFooter />
    </div>
  );
}
