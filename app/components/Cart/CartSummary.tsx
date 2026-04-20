"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../Button";
import { Icon } from "../Icon";

import { useCart } from "@/app/context/CartContext";

const CartSummary = () => {
   const { cartItems } = useCart();

   const parsePrice = (price: string) => {
      return parseFloat(price.replace(/[₦$,]/g, ""));
   };

   const subtotal = cartItems.reduce((acc, item) => {
      return acc + parsePrice(item.price) * item.quantity;
   }, 0);

   const discount = subtotal > 0 ? 6000 : 0; // Updated example discount in Naira
   const tax = subtotal > 0 ? 1400 : 0; // Updated example tax in Naira
   const total = Math.max(0, subtotal - discount + tax);

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
                  <span className="text-gray-900 font-outfit">₦{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
               </div>
               <div className="flex justify-between text-[11px] uppercase tracking-widest font-bold">
                  <span className="text-gray-400">Discount</span>
                  <span className="text-brand-gold font-outfit">- ₦{discount.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-[11px] uppercase tracking-widest font-bold">
                  <span className="text-gray-400">Estimated Tax</span>
                  <span className="text-gray-900 font-outfit">+ ₦{tax.toFixed(2)}</span>
               </div>
            </div>

            <div className="flex justify-between items-center py-2">
               <span className="font-outfit font-bold text-gray-900 uppercase tracking-widest">Total</span>
               <span className="font-outfit font-bold text-2xl text-gray-900">₦{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <div className="w-full pt-2">
               <Button
                  disabled={cartItems.length === 0}
                  className={`w-full text-white font-bold h-14 text-[11px] uppercase tracking-[0.2em] transition-all rounded-none shadow-none ${cartItems.length === 0 ? "bg-gray-200 cursor-not-allowed" : "bg-black hover:bg-brand-gold cursor-pointer"}`}
               >
                  {cartItems.length > 0 ? (
                    <Link href="/checkout" className="w-full h-full flex items-center justify-center">
                      Proceed to Checkout
                    </Link>
                  ) : (
                    <span>Proceed to Checkout</span>
                  )}
               </Button>
            </div>

            <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-200">
               {["amex", "mastercard", "applepay", "visa", "pp"].map((pay, idx) => (
                  <div key={idx} className="w-10 h-7 relative opacity-40 hover:opacity-100 transition-all cursor-pointer">
                     <Image src={`/payment/Payment=payment, Pay-type=${pay}.png`} alt={pay} fill className="object-contain" />
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export { CartSummary };
