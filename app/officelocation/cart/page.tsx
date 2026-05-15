"use client";

import { OfficeLocationHeader } from "../components/OfficeLocationHeader";
import { OfficeLocationCartItem } from "../components/officeLocationCartItem";
import { useCart } from "../context/CartContext";
import { useOfficeLocationInfo } from "@/app/context/OfficeLocationContext";
import { EmptyState } from "../components/empty-state";
import Link from "next/link";
import { GoBackButton } from "../components/go-back-button";
import { getShopUrl, getStoreUrl } from "../utils/storeUtils";
import { CustomerCartSkeleton } from "../components/Skeleton/CustomerCartSkeleton";

import { useGetOfficeBySubdomainQuery } from "@/lib/redux/services/officeApi";
import OfficeLocationFooter from "../components/OfficeLocationFooter";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalItems } = useCart();
  const { storeContext } = useOfficeLocationInfo();

  const { data: officeRes, isLoading: isLoadingOffice } = useGetOfficeBySubdomainQuery(
    storeContext?.subdomain || "",
    { skip: !storeContext?.subdomain }
  );

  const office = officeRes?.data;

  const businessLogo = undefined; // Offices don't have logos yet, using default branding

  const resolveLocation = (location: string) => {
    if (!location) return "All Locations";
    return location;
  };

  if (isLoadingOffice && !office) {
    return <CustomerCartSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1">
        <OfficeLocationHeader />

        <section className="px-6 pt-12 pb-32 md:pb-16 md:px-12">
          <div className="mx-auto max-w-[1440px]">
            {/* Top Navigation */}
            <div className="mb-12 flex items-center justify-between">
              <GoBackButton href={getStoreUrl(storeContext?.subdomain, storeContext?.officeId)} />
              <div />
            </div>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center">
                <EmptyState
                  iconName="NOProduct"
                  title="Your cart is empty"
                  description="Browse our products and add them to your cart to see them here."
                  href={getStoreUrl(storeContext?.subdomain, storeContext?.officeId)}
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
                    <OfficeLocationCartItem
                      key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                      id={item.id}
                      name={item.name}
                      description={item.description}
                      price={item.price}
                      priceUnit={item.priceUnit}
                      image={item.image}
                      location={item.location}
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
                    href={getShopUrl("/officelocation/checkout", storeContext?.subdomain, storeContext?.officeId)}
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
      <OfficeLocationFooter />
    </div>
  );
}
