"use client";

import { CustomerHeader } from "../../components/customer-header";
import { CustomerCartItem } from "../../components/customer-cart-item";
import { useCart } from "../../context/CartContext";
import { useEffect, useState } from "react";
import { useUserInfo } from "../../contexts/UserInfoContext";
import { EmptyState } from "@/app/components/empty-state";
import Link from "next/link";
import { GoBackButton } from "../../components/go-back-button";
import { getShopUrl, getStoreUrl } from "../../utils/storeUtils";
import { CustomerCartSkeleton } from "../../components/Skeleton/CustomerCartSkeleton";

import { Business, useGetBusinessFiltersQuery } from "@/lib/redux/services/businessesApi";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalItems } = useCart();
  const { storeContext } = useUserInfo();
  const [business, setBusiness] = useState<Business | null>(null);

  const { data: filtersResponse, isLoading: isLoadingFilters } = useGetBusinessFiltersQuery(
    storeContext?.subdomain || "",
    { skip: !storeContext?.subdomain }
  );

  useEffect(() => {
    if (filtersResponse?.data?.business) {
      setBusiness(filtersResponse.data.business);
      localStorage.setItem(`tecnova_business_${storeContext?.subdomain}`, JSON.stringify(filtersResponse.data.business));
    } else if (storeContext?.subdomain) {
      const savedBusiness = localStorage.getItem(`tecnova_business_${storeContext.subdomain}`);
      if (savedBusiness && !business) {
        setBusiness(JSON.parse(savedBusiness));
      }
    }
  }, [filtersResponse, storeContext?.subdomain, business]);

  const businessLogo = business?.logo?.fileUrl || business?.BusinessDocuments?.[0]?.fileUrl;

  const resolveLocation = (location: string) => {
    if (!location) return "All Locations";

    // Check if location is a UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(location);
    if (isUuid) {
      if (!business?.offices) return storeContext?.officeName || "Loading Office...";
      const office = business.offices.find((o: { id: string; name: string }) => o.id === location);
      return office?.name || storeContext?.officeName || "Main Branch";
    }
    return location;
  };

  if (isLoadingFilters && !business) {
    return <CustomerCartSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white pb-10">
      <CustomerHeader
        businessName={business?.name}
        businessDescription={business?.description}
        logoUrl={businessLogo}
        showSearch={false}
      />

      <section className="px-6 py-12 md:px-12">
        <div className="mx-auto max-w-[1440px]">
          {/* Top Navigation */}
          <div className="mb-12 flex items-center justify-between">
            <GoBackButton href={getStoreUrl(storeContext?.subdomain, storeContext?.businessId, storeContext?.officeId)} />
            <div />
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center">
              <EmptyState
                iconName="NOProduct"
                title="Your cart is empty"
                description="Browse our products and add them to your cart to see them here."
                href={getStoreUrl(storeContext?.subdomain, storeContext?.businessId, storeContext?.officeId)}
                linkLabel="Continue Shopping"
              />
            </div>
          ) : (
            <>
              {/* Page Title */}
              <h1 className="mb-8 font-sans font-normal text-[14px] leading-[42px] tracking-[-0.03em] text-[#1F1F1F]">
                Cart <span className="text-[#808080]">({totalItems} items)</span>
              </h1>

              {/* Cart Items List */}
              <div className="mb-12 flex flex-col">
                {items?.map((item) => (
                  <CustomerCartItem
                    key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                    id={item.id}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    priceUnit={item.priceUnit}
                    image={item.image}
                    location={resolveLocation(item.location)}
                    initialQuantity={item.quantity}
                    selectedColor={item.selectedColor}
                    selectedSize={item.selectedSize}
                    availableColors={item.availableColors}
                    images={item.images}
                    stockCount={item.stockCount}
                    quantityUnit={item.stockUnit}
                    onRemove={() => removeItem(item.id, item.selectedColor, item.selectedSize)}
                    onQuantityChange={(q) => updateQuantity(item.id, q, item.selectedColor, item.selectedSize)}
                  />
                ))}
              </div>

              {/* Checkout Button */}
              <div>
                <Link
                  href={getShopUrl("/customer/checkout", storeContext?.subdomain, storeContext?.businessId, storeContext?.officeId)}
                  className="flex items-center justify-center h-[45px] w-full rounded-[6px] bg-[#156BB6] font-work text-base font-medium text-white transition-colors hover:bg-[#125a9a] md:w-[320px] "
                >
                  Continue to Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
