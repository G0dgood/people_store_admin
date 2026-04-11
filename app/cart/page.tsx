"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { CartItem } from "@/app/components/Cart/CartItem";
import { CartSummary } from "@/app/components/Cart/CartSummary";
import { SavedForLater } from "@/app/components/Cart/SavedForLater";
import { ServiceBadges } from "@/app/components/Cart/ServiceBadges";

export default function CartPage() {
  const cartItems = [
    {
      id: "1",
      title: "T-shirts with multiple colors, for men and boy",
      price: "$78.99",
      image: "/images/shirt.jpg",
      meta: { size: "Medium", color: "Blue", material: "Cotton", seller: "Artel Market" }
    },
    {
      id: "2",
      title: "Leather bag for travel and for men",
      price: "$39.00",
      image: "/images/bag.jpg",
      meta: { size: "Large", color: "Black", material: "Leather", seller: "Best Buy" }
    },
    {
      id: "3",
      title: "Canon camera black, 100x zoom",
      price: "$170.00",
      image: "/images/camera.jpg",
      meta: { size: "Small", color: "Black", material: "Plastic", seller: "Photo Max" }
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAFC]">
      <Header />

      <main className="flex-1 max-w-[1440px] mx-auto px-4 md:px-6 py-4 md:py-6 flex flex-col gap-6 md:gap-8 w-full">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">My cart (3)</h2>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
          {/* Cart List Container */}
          <div className="flex-1 bg-white border border-gray-200 md:rounded-lg p-4 md:p-6 flex flex-col w-full">
            {cartItems.map((item) => (
              <CartItem key={item.id} {...item} />
            ))}

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
              <Link href="/products" className="w-full md:w-auto">
                <Button 
                  className="w-full md:w-fit bg-brand-blue text-white px-8 h-10" 
                  iconLeft={<Icon name="arrow_back white" size="xs" />}
                >
                  Back to shop
                </Button>
              </Link>
              <Button variant="ghost" className="w-full md:w-auto text-brand-blue bg-white border border-gray-200 px-6 h-10 hover:bg-gray-50 transition-colors">
                Remove all
              </Button>
            </div>
          </div>

          {/* Summary Sidebar */}
          <CartSummary />
        </div>

        {/* Footer info and Saved for Later */}
        <div className="flex flex-col gap-8">
          <ServiceBadges />
          <SavedForLater />
        </div>
      </main>

      <Footer />
    </div>
  );
}
