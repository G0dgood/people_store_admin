"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../Button";
import { Icon } from "../Icon";

import { useCart } from "@/app/context/CartContext";
import { useCustomerAuth } from "@/app/context/CustomerAuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/app/utils/formatPrice";

const CartSummary = () => {
   const { cartItems } = useCart();
   const { isAuthenticated } = useCustomerAuth();
   const router = useRouter();

   const subtotal = cartItems.reduce((acc, item) => {
      const p = typeof item.price === "number" ? item.price : parseFloat(String(item.price).replace(/[₦$,]/g, ""));
      return acc + (isNaN(p) ? 0 : p) * item.quantity;
   }, 0);

   const discount = cartItems.reduce((acc, item) => {
      if (!item.originalPrice) return acc;
      const original = parseFloat(String(item.originalPrice).replace(/[₦$,]/g, ""));
      const current = typeof item.price === "number" ? item.price : parseFloat(String(item.price).replace(/[₦$,]/g, ""));
      
      if (!isNaN(original) && !isNaN(current) && original > current) {
         return acc + (original - current) * item.quantity;
      }
      return acc;
   }, 0);

   const tax = subtotal > 0 ? Math.round(subtotal * 0.075) : 0; // 7.5% VAT
   const total = Math.max(0, subtotal - discount + tax);

   const handleCheckout = () => {
      if (cartItems.length === 0) return;
      
      if (!isAuthenticated) {
         toast.error("Authentication Required", {
            description: "Please log in to your boutique account to proceed to checkout."
         });
         return;
      }
      
      router.push("/checkout");
   };

   return (
      <div className="w-full lg:w-[380px] flex flex-col gap-6">
         {/* Coupon Section */}
         <div className="bg-white border border-gray-200 p-6 flex flex-col gap-4 shadow-none">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Promotion Code</span>
            <div className="flex border border-gray-200 overflow-hidden bg-gray-50/50">
               <input
                  type="text"
                  placeholder="Enter code"
                  className="flex-1 h-12 px-5 bg-transparent outline-none focus:bg-white transition-all text-[11px] font-bold uppercase tracking-widest text-gray-900 placeholder-gray-300"
               />
               <Button className="h-12 px-6 bg-black text-white font-bold hover:bg-brand-gold transition-all text-[10px] uppercase tracking-widest shadow-none cursor-pointer rounded-none">
                  Apply
               </Button>
            </div>
         </div>

         {/* Summary Section */}
         <div className="bg-white border border-gray-200 p-8 flex flex-col gap-6 shadow-none">
            <h3 className="font-outfit font-light text-xl uppercase tracking-widest border-b border-gray-200 pb-4">Order <span className="font-bold">Summary</span></h3>
            
            <div className="flex flex-col gap-3 pb-6 border-b border-gray-200">
               <div className="flex justify-between text-[11px] uppercase tracking-widest font-bold">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-gray-900 font-outfit">{formatPrice(subtotal)}</span>
               </div>
               <div className="flex justify-between text-[11px] uppercase tracking-widest font-bold">
                  <span className="text-gray-400">Discount</span>
                  <span className="text-brand-gold font-outfit">- {formatPrice(discount)}</span>
               </div>
               <div className="flex justify-between text-[11px] uppercase tracking-widest font-bold">
                  <span className="text-gray-400">Estimated Tax</span>
                  <span className="text-gray-900 font-outfit">+ {formatPrice(tax)}</span>
               </div>
            </div>

            <div className="flex justify-between items-center py-2">
               <span className="font-outfit font-bold text-gray-900 uppercase tracking-widest">Total</span>
               <span className="font-outfit font-bold text-2xl text-gray-900">{formatPrice(total)}</span>
            </div>

            <div className="w-full pt-2">
               <Button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                  className={`w-full text-white font-bold h-14 text-[11px] uppercase tracking-[0.2em] transition-all rounded-none shadow-none ${cartItems.length === 0 ? "bg-gray-200 cursor-not-allowed" : "bg-black hover:bg-brand-gold cursor-pointer"}`}
               >
                  Proceed to Checkout
               </Button>
            </div>

            <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-200">
               {["amex", "mastercard", "applepay", "visa", "pp"].map((pay, idx) => (
                  <div key={idx} className="w-10 h-7 relative opacity-40 hover:opacity-100 transition-all cursor-pointer">
                     <Image src={`/payment/Payment=payment, Pay-type=${pay}.png`} alt={pay} fill sizes="40px" className="object-contain" />
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export { CartSummary };
