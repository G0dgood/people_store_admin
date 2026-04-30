"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCart } from "@/app/context/CartContext";
import { useGetOrderByIdQuery } from "@/lib/redux/services/orderApi";
import { formatPrice } from "@/app/utils/formatPrice";
import { Icon } from "@/app/components/Icon";
import Image from "next/image";
import Link from "next/link";

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { clearCart } = useCart();
  const router = useRouter();

  const { data: orderResponse, isLoading, isError } = useGetOrderByIdQuery(orderId || "", {
    skip: !orderId,
  });

  useEffect(() => {
    // Clear cart on successful checkout
    if (orderId) {
      clearCart();
    }
  }, [orderId, clearCart]);

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Icon name="error" size="xl" className="text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Invalid Order</h1>
          <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
          <Link href="/" className="text-brand-gold font-bold hover:underline">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const order = orderResponse?.data;

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-12 md:py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border-4 border-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Icon name="task_alt" size="xl" className="text-green-600" />
            </motion.div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            Thank you for your purchase. Your luxury scents are being prepared for delivery.
          </p>
        </motion.div>

        {/* Order Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[32px] shadow-xl shadow-brand-gold/5 overflow-hidden border border-gray-100"
        >
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest block mb-1">
                  Order Number
                </span>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  {order?.orderId || "Processing..."}
                </h2>
              </div>
              <div className="md:text-right">
                <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest block mb-1">
                  Payment Status
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  {order?.paymentStatus || "Paid"}
                </span>
              </div>
            </div>

            {/* Items Summary */}
            <div className="space-y-6 mb-10">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">
                Items Summary
              </h3>
              <div className="space-y-4">
                {order?.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className="relative w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                      <Image
                        src={item.product?.productImage || "/placeholder.png"}
                        alt={item.product?.name || "Product"}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-brand-gold transition-colors">
                        {item.product?.name || "Gift Box"}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right font-black text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-gray-50 rounded-[24px] p-6 space-y-3 mb-10 border border-gray-100">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">
                  {order ? formatPrice(order.totalAmount / 1.05) : "..."}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Estimated VAT (5%)</span>
                <span className="font-bold text-gray-900">
                  {order ? formatPrice(order.totalAmount - (order.totalAmount / 1.05)) : "..."}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="text-base font-black text-gray-900">Total Paid</span>
                <span className="text-xl font-black text-brand-gold">
                  {order ? formatPrice(order.totalAmount) : "..."}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/orders"
                className="flex-grow bg-white text-gray-900 border-2 border-gray-200 hover:border-brand-gold hover:text-brand-gold h-14 rounded-2xl flex items-center justify-center font-black transition-all active:scale-[0.98]"
              >
                View My Orders
              </Link>
              <Link
                href="/products"
                className="flex-grow bg-brand-gold text-white shadow-lg shadow-brand-gold/20 hover:shadow-brand-gold/40 h-14 rounded-2xl flex items-center justify-center font-black transition-all hover:translate-y-[-2px] active:scale-[0.98]"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Footer Support */}
        <p className="text-center mt-12 text-gray-500 text-sm font-medium">
          Need help? Contact our support at{" "}
          <a href="mailto:support@bloomandmist.com" className="text-brand-gold font-bold">
            support@bloomandmist.com
          </a>
        </p>
      </div>
    </main>
  );
};

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
