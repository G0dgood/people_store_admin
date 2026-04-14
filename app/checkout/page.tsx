"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { CheckoutForm } from "@/app/components/Checkout/CheckoutForm";
import { OrderSummary } from "@/app/components/Checkout/OrderSummary";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-hidden bg-[#F7FAFC]">
      {/* Custom Background Image */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <Image
          src="/web_images/twocolor_background.png"
          alt="Background"
          fill
          className="object-cover opacity-10"
        />
      </div>

      <Header />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 md:px-10 lg:px-16 py-8 md:py-12">
        {/* Breadcrumbs */}
        <div className="mb-8 hidden md:block">
          <Breadcrumbs
            items={[{ label: "Shopping Cart", href: "/cart" }, { label: "Checkout" }]}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-8 md:gap-12"
        >
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight leading-none font-heading">Finalize Order</h1>
                <div className="h-1.5 w-1.5 rounded-full bg-brand-blue mt-1" />
              </div>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Complete your purchase safely and securely</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] bg-neutral-100 px-5 py-3 rounded-lg border border-neutral-200">
              <div className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse" />
              Secure 256-bit Checkout
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Responsive Form Column */}
            <div className="flex-1 w-full order-2 lg:order-1">
              <CheckoutForm />
            </div>

            {/* Sticky Summary Column */}
            <div className="w-full lg:w-auto order-1 lg:order-2">
              <OrderSummary />
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

