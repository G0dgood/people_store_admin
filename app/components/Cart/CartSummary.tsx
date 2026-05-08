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
import { useValidateCouponMutation } from "@/lib/redux/services/boutiqueApi";
import { SectionHeaderSimple } from "../ui/SectionHeaderSimple";
import { SummarySection } from "./SummarySection";

const CartSummary = () => {
   const { cartItems, appliedCoupon, applyCoupon, removeCoupon } = useCart();
   const { isAuthenticated } = useCustomerAuth();
   const router = useRouter();
   const [couponCode, setCouponCode] = React.useState("");
   const [isValidating, setIsValidating] = React.useState(false);

   const subtotal = cartItems.reduce((acc, item) => {
      const p = typeof item.price === "number" ? item.price : parseFloat(String(item.price).replace(/[₦$,]/g, ""));
      return acc + (isNaN(p) ? 0 : p) * item.quantity;
   }, 0);

   const productDiscount = cartItems.reduce((acc, item) => {
      if (!item.originalPrice) return acc;
      const original = parseFloat(String(item.originalPrice).replace(/[₦$,]/g, ""));
      const current = typeof item.price === "number" ? item.price : parseFloat(String(item.price).replace(/[₦$,]/g, ""));

      if (!isNaN(original) && !isNaN(current) && original > current) {
         return acc + (original - current) * item.quantity;
      }
      return acc;
   }, 0);

   const couponDiscount = React.useMemo(() => {
      if (!appliedCoupon) return 0;
      const discountVal = parseFloat(appliedCoupon.discount.replace(/[%₦$,]/g, ""));
      if (isNaN(discountVal)) return 0;

      if (appliedCoupon.type === "Percentage") {
         return (subtotal * discountVal) / 100;
      } else if (appliedCoupon.type === "Fixed Rate") {
         return discountVal;
      }
      return 0;
   }, [appliedCoupon, subtotal]);

   const discount = productDiscount + couponDiscount;

   const tax = subtotal > 0 ? Math.round((subtotal - discount) * 0.075) : 0; // 7.5% VAT on discounted price
   const total = Math.max(0, subtotal - discount + tax);

   const handleApplyCoupon = async () => {
      if (!couponCode) return;
      setIsValidating(true);
      try {
         await applyCoupon(couponCode);
         toast.success("Promotion code applied!");
      } catch (err: any) {
         toast.error(err.data?.message || "Invalid promotion code");
      } finally {
         setIsValidating(false);
      }
   };

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
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 h-12 px-5 bg-transparent outline-none focus:bg-white transition-all text-[11px] font-bold uppercase tracking-widest text-gray-900 placeholder-gray-300"
               />
               <Button
                  onClick={handleApplyCoupon}
                  disabled={isValidating || !couponCode}
                  className="h-12 px-6 bg-black text-white font-bold hover:bg-brand-gold transition-all text-[10px] uppercase tracking-widest shadow-none cursor-pointer rounded-none disabled:bg-gray-300"
               >
                  {isValidating ? "..." : "Apply"}
               </Button>
            </div>
            {appliedCoupon && (
               <div className="flex items-center justify-between text-[10px] font-bold text-green-600 bg-green-50 p-3 border border-green-100">
                  <span>Code {appliedCoupon.code} Applied</span>
                  <button onClick={removeCoupon} className="text-gray-400 hover:text-red-500">
                     <Icon name="close" size="xs" />
                  </button>
               </div>
            )}
         </div>

         {/* Summary Section */}
         <SummarySection
            subtotal={subtotal}
            discount={discount}
            tax={tax}
            total={total}
            actionButton={
               <Button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                  className={`w-full text-white font-bold h-14 text-[11px] uppercase tracking-[0.2em] transition-all rounded-none shadow-none ${cartItems.length === 0 ? "bg-gray-200 cursor-not-allowed" : "bg-black hover:bg-brand-gold cursor-pointer"}`}
               >
                  Proceed to Checkout
               </Button>
            }
         >
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-200">
               {["amex", "mastercard", "applepay", "visa", "pp"].map((pay, idx) => (
                  <div key={idx} className="w-10 h-7 relative opacity-40 hover:opacity-100 transition-all cursor-pointer">
                     <Image src={`/payment/Payment=payment, Pay-type=${pay}.png`} alt={pay} fill sizes="40px" className="object-contain" />
                  </div>
               ))}
            </div>
         </SummarySection>
      </div>
   );
};

export { CartSummary };
