"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CustomerHeader } from "../../components/customer-header";
import { CustomerWishlistItem } from "../../components/customer-wishlist-item";
import { useUserInfo } from "../../contexts/UserInfoContext";
import { useWishlist } from "../../context/WishlistContext";
import { EmptyState } from "../../components/empty-state";
import { useGetBusinessFiltersQuery } from "@/lib/redux/services/businessesApi";
import { CustomerPageSkeleton } from "../../components/Skeleton/CustomerPageSkeleton";
import { getStoreUrl } from "../../utils/storeUtils";
import { GoBackButton } from "../../components/go-back-button";

function WishlistPageContent() {
  const searchParams = useSearchParams();
  const { storeContext } = useUserInfo();
  const { items: wishlistItems } = useWishlist();
  const [businessInfo, setBusinessInfo] = useState<import("@/lib/redux/services/businessesApi").Business | null>(null);

  const subdomain = searchParams.get("subdomain") || storeContext?.subdomain;

  useGetBusinessFiltersQuery(
    subdomain || "",
    { skip: !subdomain }
  );

  useEffect(() => {
    if (subdomain) {
      const savedBusiness = localStorage.getItem(`tecnova_business_${subdomain}`);
      if (savedBusiness) {
        setBusinessInfo(JSON.parse(savedBusiness));
      }
    }
  }, [subdomain]);

  const businessLogo = businessInfo?.logo?.fileUrl || businessInfo?.BusinessDocuments?.[0]?.fileUrl;

  return (
    <div className="min-h-screen bg-white">
      <CustomerHeader
        businessName={businessInfo?.name}
        businessDescription={businessInfo?.description}
        logoUrl={businessLogo}
        showSearch={false}
      />

      <section className="mx-auto max-w-[1440px] px-6 pt-12 pb-32 md:pb-12 md:px-12">
        <div className="mb-12 flex items-center justify-between">
          <GoBackButton href={getStoreUrl(subdomain || "")} />
          <div />
        </div>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <EmptyState
              iconName="NOProduct"
              title="Your wishlist is empty"
              description="Save items you like to your wishlist to view them later."
              href={getStoreUrl(subdomain || "")}
              linkLabel="Start Shopping"
            />
          </div>
        ) : (
          <>
            <h1 className="mb-8 font-sans font-normal text-[14px] leading-[42px] tracking-[-0.03em] text-[#1F1F1F]">
              Wishlist <span className="text-[#808080]">({wishlistItems.length} items)</span>
            </h1>

            <div className="flex flex-col">
              {wishlistItems.map((item) => (
                <CustomerWishlistItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price || 0}
                  image={item.image}
                  stockStatus={(item.stockStatus as "In Stock" | "Low Stock" | "Out of Stock") || "In Stock"}
                  stockCount={item.stockCount || 0}
                  colors={item.colors}
                  item={item.item}
                  location={item.location}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default function WishlistPage() {
  return (
    <Suspense fallback={<CustomerPageSkeleton />}>
      <WishlistPageContent />
    </Suspense>
  );
}
