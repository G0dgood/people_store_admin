"use client";

import React from "react";
import Image from "next/image";
import { Button } from "../Button";
import { Icon } from "../Icon";

const CartSummary = () => {
   return (
      <div className="w-full lg:w-[350px] flex flex-col gap-4">
         {/* Coupon Section */}
         <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-4 ">
            <span className="text-sm text-gray-400">Have a coupon?</span>
            <div className="flex">
               <input
                  type="text"
                  placeholder="Add coupon"
                  className="flex-1 h-10 px-3 border border-gray-300 rounded-l-lg outline-none focus:border-brand-blue transition-colors text-sm text-gray-900 placeholder-gray-400"
               />
               <Button variant="primary" className="h-10 px-4 border border-l-0 border-brand-blue bg-brand-blue text-white font-bold rounded-l-none rounded-r-lg hover:bg-brand-blue/90 transition-colors text-sm shadow-none cursor-pointer">
                  Apply
               </Button>
            </div>
         </div>

         {/* Summary Section */}
         <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-4 ">
            <div className="flex flex-col gap-2 pb-4 border-b border-gray-100">
               <div className="flex justify-between text-gray-400 text-sm">
                  <span>Subtotal:</span>
                  <span className="text-gray-600 font-medium">$1403.97</span>
               </div>
               <div className="flex justify-between text-gray-400 text-sm">
                  <span>Discount:</span>
                  <span className="text-[#EB001B] font-medium">- $60.00</span>
               </div>
               <div className="flex justify-between text-gray-400 text-sm">
                  <span>Tax:</span>
                  <span className="text-[#00B517] font-medium">+ $14.00</span>
               </div>
            </div>

            <div className="flex justify-between items-center py-2">
               <span className="font-bold text-gray-900">Total:</span>
               <span className="font-bold text-xl text-gray-900">$1357.97</span>
            </div>

            <Button
               variant="ghost"
               className="w-full text-white font-bold h-12 text-base hover:opacity-90 transition-all cursor-pointer"
               style={{ backgroundColor: "#00B517" }}
            >
               Checkout
            </Button>

            <div className="flex items-center justify-center gap-3 pt-2">
               {["amex", "mastercard", "applepay", "visa", "pp"].map((pay, idx) => (
                  <div key={idx} className="w-9 h-6 relative grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                     <Image src={`/payment/Payment=payment, Pay-type=${pay}.png`} alt={pay} fill className="object-contain" />
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export { CartSummary };
