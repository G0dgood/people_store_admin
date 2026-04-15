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
import { ClearCartModal } from "@/app/components/Modal";

import { useCart } from "@/app/context/CartContext";

export default function CartPage() {
  const { cartItems, clearCart } = useCart();
  const [isClearModalOpen, setIsClearModalOpen] = React.useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAFC]">
      <Header />

      <div className="flex-1 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-4 md:py-6 flex flex-col gap-6 md:gap-8 w-full">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900"> My cart ({cartItems.length})</h2>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
          {/* Cart List Container */}
          <div className="flex-1 bg-white border border-gray-200 md:rounded-lg p-4 md:p-6 flex flex-col w-full">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <CartItem key={item.id} {...item} />
              ))
            ) : (
              <div className="py-12 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                  <Icon name="shopping_cart" size="md" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-gray-900 font-bold">Your cart is empty</p>
                  <p className="text-gray-500 text-sm">Looks like you haven't added anything to your cart yet.</p>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
              <Link href="/products" className="w-full md:w-auto">
                <Button
                  className="w-full md:w-fit bg-brand-blue text-white px-8 h-10"
                  iconLeft={<Icon name="arrow_back white" size="xs" />}
                >
                  Back to shop
                </Button>
              </Link>
              {cartItems.length > 0 && (
                <Button
                  onClick={() => setIsClearModalOpen(true)}
                  variant="ghost"
                  className="w-full md:w-auto text-brand-blue bg-white border border-gray-200 px-6 h-10 hover:bg-gray-50 transition-colors"
                >
                  Remove all
                </Button>
              )}
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
      </div>

      <ClearCartModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onClear={clearCart}
      />

      <Footer />
    </div>
  );
}
