"use client";

import React from "react";
import { formatPrice } from "@/app/utils/formatPrice";

export const InvoicePrint = ({ order }: { order: any }) => {
  if (!order) return null;

  return (
    <div id="printable-invoice" className="hidden print:block bg-white text-black p-10 font-sans">
      <div className="flex justify-between items-start border-b-2 border-gray-100 pb-10 mb-10">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter text-brand-charcoal mb-2">Bloom & Mist</h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Luxury Boutique Store</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-black text-gray-900 mb-2">INVOICE</h2>
          <p className="text-sm font-bold text-gray-400 uppercase">Order ID: {order.orderId}</p>
          <p className="text-sm font-bold text-gray-400 uppercase">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-20 mb-12">
        <div>
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Customer Details</h3>
          <p className="text-md font-black text-gray-900">{order.customer?.fullName || "Guest Customer"}</p>
          <p className="text-sm font-bold text-gray-500 mt-1">{order.customer?.email}</p>
          <p className="text-sm font-bold text-gray-500">{order.customer?.phoneNumber}</p>
        </div>
        <div>
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Shipping Address</h3>
          <p className="text-sm font-bold text-gray-600 leading-relaxed italic">
            {order.shippingAddress}
          </p>
        </div>
      </div>

      <table className="w-full mb-10">
        <thead>
          <tr className="border-b-2 border-gray-900">
            <th className="py-4 text-left text-xs font-black uppercase tracking-widest text-gray-900">Product Description</th>
            <th className="py-4 text-center text-xs font-black uppercase tracking-widest text-gray-900">Price</th>
            <th className="py-4 text-center text-xs font-black uppercase tracking-widest text-gray-900">Qty</th>
            <th className="py-4 text-right text-xs font-black uppercase tracking-widest text-gray-900">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {order.items.map((item: any, idx: number) => (
            <tr key={idx}>
              <td className="py-6">
                <p className="text-sm font-black text-gray-900">{item.product?.name || "Premium Item"}</p>
                <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tight">Product Code: {item.product?._id?.slice(-8).toUpperCase()}</p>
              </td>
              <td className="py-6 text-center text-sm font-bold text-gray-600">{formatPrice(item.price)}</td>
              <td className="py-6 text-center text-sm font-bold text-gray-900">{item.quantity}</td>
              <td className="py-6 text-right text-sm font-black text-gray-900">{formatPrice(item.price * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-80 flex flex-col gap-4">
          <div className="flex justify-between text-sm font-bold text-gray-400">
            <span>Subtotal</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-gray-400">
            <span>Shipping Fee</span>
            <span>{formatPrice(0)}</span>
          </div>
          <div className="h-px bg-gray-900 my-2"></div>
          <div className="flex justify-between text-xl font-black text-gray-900">
            <span>Total Amount</span>
            <span className="text-brand-gold">{formatPrice(order.totalAmount)}</span>
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-4 text-right italic">
            * Payment Status: {order.paymentStatus}
          </p>
        </div>
      </div>

      <div className="mt-20 border-t border-gray-100 pt-10 text-center">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Thank you for shopping with Bloom & Mist</p>
      </div>
    </div>
  );
};
