"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useGetOfficeBySubdomainQuery } from "@/lib/redux/services/officeApi";
import { useGetProductsByOfficeQuery } from "@/lib/redux/services/productApi";
import { SVGLoaderFetch } from "@/app/components/Options";
import { ProductGridItem } from "@/app/components/Products/ProductItems";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { HiOutlineMapPin, HiOutlineClock, HiOutlinePhone, HiOutlineEnvelope } from "react-icons/hi2";
import { formatPrice } from "@/app/utils/formatPrice";

export default function OfficeLocationPage() {
  const searchParams = useSearchParams();

  // Extract subdomain from format ?subdomain/name or ?subdomain=name
  const subdomain = useMemo(() => {
    const rawParams = searchParams.toString();
    if (rawParams.includes("subdomain/")) {
      return rawParams.split("subdomain/")[1].split("&")[0];
    }
    return searchParams.get("subdomain");
  }, [searchParams]);

  const { data: officeRes, isLoading: isLoadingOffice } = useGetOfficeBySubdomainQuery(subdomain || "", {
    skip: !subdomain
  });

  const office = officeRes?.data;

  const { data: productsRes, isLoading: isLoadingProducts } = useGetProductsByOfficeQuery(office?._id || "", {
    skip: !office?._id
  });

  const products = productsRes?.data || [];

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

  if (isLoadingOffice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <SVGLoaderFetch text={""} />
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
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[400px] bg-brand-gold overflow-hidden">
          <div className="absolute inset-0 bg-black/20 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <div className="container mx-auto px-6 h-full flex flex-col justify-end pb-12 relative z-20">
            <div className="flex flex-col gap-2">
              <span className="text-white/80 font-black uppercase tracking-[0.3em] text-xs">Official Office Location</span>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">{office.name}</h1>
              <div className="flex flex-wrap items-center gap-6 mt-4 text-white/90 font-bold text-sm">
                <div className="flex items-center gap-2">
                  <HiOutlineMapPin className="text-brand-gold-light" />
                  {office.address}
                </div>
                {office.workingHours && (
                  <div className="flex items-center gap-2">
                    <HiOutlineClock className="text-brand-gold-light" />
                    {office.workingHours}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Info Grid */}
        <section className="py-12 border-b border-gray-100 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Details</span>
                <div className="flex flex-col gap-3 mt-2">
                  {office.phone && (
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-brand-gold">
                        <HiOutlinePhone size={14} />
                      </div>
                      {office.phone}
                    </div>
                  )}
                  {office.email && (
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-brand-gold">
                        <HiOutlineEnvelope size={14} />
                      </div>
                      {office.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">About this Location</span>
                <p className="mt-2 text-sm text-gray-500 font-medium leading-relaxed max-w-2xl">
                  Welcome to our {office.name} showroom. Here you can experience our full collection in person,
                  consult with our specialists, and pick up your online orders immediately. Our local inventory
                  is updated in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-black text-[#121212] uppercase tracking-tighter">Available In-Store</h2>
              <p className="text-sm font-bold text-gray-400">Browse products currently in stock at this location.</p>
            </div>
            <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              {products.length} Products Found
            </div>
          </div>

          {isLoadingProducts ? (
            <div className="py-20 flex justify-center">
              <SVGLoaderFetch text={""} />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map((product) => (
                <ProductGridItem
                  key={product._id}
                  product={{
                    id: product._id,
                    title: product.name,
                    price: formatPrice(product.price),
                    description: product.description,
                    image: product.productImage,
                    rating: 5, // Default rating if not in model
                    orders: 0,
                    shipping: "Free Delivery",
                    stock: product.stock,
                    isUnlimited: product.isUnlimited,
                    media: product.media
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
              <span className="text-gray-300 font-bold">No products currently assigned to this location.</span>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
