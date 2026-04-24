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
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <div className="flex-1 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-4 md:py-8 flex flex-col gap-6 md:gap-10 w-full">
        <h2 className="text-2xl md:text-4xl font-outfit font-light text-gray-900 uppercase tracking-[0.1em]"> My <span className="font-bold">cart</span> <span className="text-sm md:text-lg text-gray-400 normal-case tracking-normal ml-2">({cartItems.length} items)</span></h2>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Cart List Container */}
          <div className="flex-1 bg-white flex flex-col w-full">
            {cartItems.length > 0 ? (
              <div className="flex flex-col border border-gray-200 shadow-none">
                {cartItems.map((item) => (
                  <CartItem key={item.id} {...item} />
                ))}
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center gap-8 text-center bg-gray-50/50 border border-dashed border-gray-200">
                {/* <div className="w-24 h-24 bg-white border border-gray-200 flex items-center justify-center text-brand-gold">
                  <Icon name="shopping_cart" size="md" />
                </div> */}
                <div className="flex flex-col gap-3">
                  <p className="text-xl md:text-2xl font-outfit font-light text-gray-900 uppercase tracking-widest">Your cart is <span className="font-bold">empty</span></p>
                  <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">Looks like you haven't added anything to your cart yet.</p>
                </div>
                {/* <Link href="/products">
                  <Button className="bg-black text-white px-12 py-4 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-brand-gold transition-all rounded-none shadow-none">
                    Start Shopping
                  </Button>
                </Link> */}
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-10 mt-auto">
              <Link href="/products" className="w-full md:w-auto order-2 md:order-1">
                <Button
                  className="w-full md:w-fit text-black border border-black px-10 h-12 font-bold uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all rounded-none"
                  iconLeft={<Icon name="arrow_back" size="xs" />}
                >
                  Continue Shopping
                </Button>
              </Link>

              {cartItems.length > 0 && (
                <Button
                  onClick={() => setIsClearModalOpen(true)}
                  className="w-full md:w-auto order-1 md:order-2 text-red-500 bg-red-400 border border-red-400 px-8 h-12 font-bold uppercase tracking-widest text-[10px] hover:bg-red-600 transition-all rounded-none"
                >
                  Clear All Items
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
