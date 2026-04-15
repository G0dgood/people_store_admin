"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Select } from "@/app/components/Form/Select";

export default function OrderDetails() {
  const { id } = useParams();
  const [currentStatus, setCurrentStatus] = useState("Shipped");

  const order = {
    id: id || "ORD-7281",
    date: "Oct 12, 2023, 09:45 AM",
    status: currentStatus,
    paymentStatus: "Paid",
    shippingMethod: "FedEx Express",
    customer: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+234 801 234 5678",
      avatar: "https://ui-avatars.com/api/?name=John+Doe&background=2196F3&color=fff",
    },
    shippingAddress: {
      line1: "123 Business Street",
      line2: "Lekki Phase 1",
      city: "Lagos",
      country: "Nigeria",
    },
    items: [
      { id: 1, name: "Premium Wireless Headphones", price: "₦35,000", quantity: 1, total: "₦35,000", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop" },
      { id: 2, name: "Smart Fitness Watch", price: "₦18,500", quantity: 2, total: "₦37,000", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop" },
    ],
    totals: {
      subtotal: "₦72,000",
      shipping: "₦2,500",
      tax: "₦3,600",
      grandTotal: "₦78,100",
    }
  };

 return (
  <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-12">
   {/* Header & Breadcrumbs */}
   <div className="flex flex-col gap-4">
    <Breadcrumbs
     items={[
      { label: "Orders", href: "/admin/orders" },
      { label: `Order Details: ${order.id}` }
     ]}
    />
    <div className="flex justify-between items-center">
     <div className="flex items-center gap-4">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight">{order.id}</h1>
      <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black border uppercase tracking-tighter ${currentStatus === "Delivered" ? "bg-brand-blue-light text-brand-blue border-blue-100" :
       currentStatus === "Shipped" ? "bg-brand-blue-light text-brand-blue border-blue-100" :
        "bg-orange-50 text-brand-orange border-orange-100"
       }`}>
       {currentStatus}
      </span>
      <span className="px-3 py-1.5 rounded-lg text-[10px] font-black border uppercase tracking-tighter bg-brand-blue-light text-brand-blue border-blue-100">
       {order.paymentStatus}
      </span>
     </div>
     <div className="flex gap-3 items-center">
      <Button variant="ghost" className="bg-white border-gray-200 text-gray-700 font-bold px-6 h-12">
       <Icon name="file_download" size="xs" className="mr-2" />
       Print Invoice
      </Button>
      <div className="w-48">
       <Select
        value={currentStatus}
        onChange={(val: string) => setCurrentStatus(val as string)}
        options={[
         { label: "Pending", value: "Pending" },
         { label: "Processing", value: "Processing" },
         { label: "Shipped", value: "Shipped" },
         { label: "Delivered", value: "Delivered" },
         { label: "Cancelled", value: "Cancelled" },
        ]}
       />
      </div>
     </div>
    </div>
   </div>

   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* Main Details Area */}
    <div className="lg:col-span-2 flex flex-col gap-8">
     {/* Order Items Table */}
     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex items-center justify-between">
       <h3 className="text-xl font-black text-gray-900">Purchased Items</h3>
       <span className="text-sm font-bold text-gray-400">{order.items.length} Items</span>
      </div>
      <div className="overflow-x-auto">
      <div className="admin-table-container">
       <table>
        <thead>
         <tr>
          <th className="pl-8">Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th className="text-right pr-12">Total</th>
         </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
         {order.items.map((item) => (
          <tr key={item.id}>
           <td className="pl-8">
            <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border border-gray-100 flex-shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
             </div>
             <span className="text-sm font-black text-gray-900 leading-tight">{item.name}</span>
            </div>
           </td>
           <td className="text-sm font-bold text-gray-500">{item.price}</td>
           <td className="text-sm font-bold text-gray-900">{item.quantity}</td>
           <td className="text-sm font-black text-gray-900 text-right pr-12">{item.total}</td>
          </tr>
         ))}
        </tbody>
       </table>
      </div>
      </div>

      {/* Calculations Area */}
      <div className="p-8 bg-gray-50/30 flex justify-end">
       <div className="w-64 flex flex-col gap-4">
        <div className="flex justify-between text-sm font-bold text-gray-400">
         <span>Subtotal</span>
         <span>{order.totals.subtotal}</span>
        </div>
        <div className="flex justify-between text-sm font-bold text-gray-400">
         <span>Shipping Cost</span>
         <span>{order.totals.shipping}</span>
        </div>
        <div className="flex justify-between text-sm font-bold text-gray-400">
         <span>Estimated Tax</span>
         <span>{order.totals.tax}</span>
        </div>
        <div className="h-px bg-gray-200 my-2"></div>
        <div className="flex justify-between text-xl font-black text-gray-900">
         <span>Total Paid</span>
         <span className="text-brand-blue">{order.totals.grandTotal}</span>
        </div>
       </div>
      </div>
     </div>

     {/* Activity Logs */}
     <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
      <h3 className="text-xl font-black text-gray-900">Operational Timeline</h3>
      <div className="flex flex-col gap-6 relative">
       <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-50"></div>
       {[
        { title: "Out for Delivery", date: "Oct 12, 2:45 PM", desc: "Package is being delivered by courier.", icon: "local_shipping", active: true },
        { title: "Shipped from Warehouse", date: "Oct 12, 9:20 AM", desc: "Origin scan processed in Lagos Hub.", icon: "inventory_2" },
        { title: "Payment Verified", date: "Oct 12, 9:00 AM", desc: "Transaction confirmed via Bank Transfer.", icon: "check_circle" },
        { title: "Order Placed", date: "Oct 12, 8:45 AM", desc: "Order successfully submitted by customer.", icon: "check_circle" },
       ].map((log, i) => (
        <div key={i} className="flex gap-6 relative z-10">
         <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${log.active ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-400"}`}>
          <Icon name={log.icon} size="xs" />
         </div>
         <div className="flex flex-col gap-1">
          <p className={`text-sm font-black ${log.active ? "text-gray-900" : "text-gray-500"}`}>{log.title}</p>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{log.date}</p>
          <p className="text-xs font-medium text-gray-400 mt-1">{log.desc}</p>
         </div>
        </div>
       ))}
      </div>
     </div>
    </div>

    {/* Sidebar Info */}
    <div className="flex flex-col gap-8">
     {/* Customer Card */}
     <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
      <h3 className="text-lg font-black text-gray-900">Customer Profiles</h3>
      <div className="flex items-center gap-4">
       <img src={order.customer.avatar} alt={order.customer.name} className="w-14 h-14 rounded-2xl object-cover shadow-lg shadow-blue-50 border-2 border-white" />
       <div className="flex flex-col">
        <p className="text-md font-black text-gray-900 leading-none">{order.customer.name}</p>
        <p className="text-xs font-bold text-gray-400 mt-2">12 Orders To Date</p>
       </div>
      </div>

      <div className="flex flex-col gap-4 pt-6 border-t border-gray-50">
       <div className="flex gap-3">
        <Icon name="mail_outline" size="xs" className="text-gray-300" />
        <span className="text-xs font-black text-gray-600">{order.customer.email}</span>
       </div>
       <div className="flex gap-3">
        <Icon name="phone" size="xs" className="text-gray-300" />
        <span className="text-xs font-black text-gray-600">{order.customer.phone}</span>
       </div>
      </div>

      <Button variant="ghost" className="w-full text-brand-blue font-black hover:bg-brand-blue-light py-3 rounded-xl transition-all">
       View Full Profile
      </Button>
     </div>

     {/* Shipping Address */}
     <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
      <div className="flex justify-between items-center">
       <h3 className="text-lg font-black text-gray-900">Shipping Info</h3>
       <Icon name="create" size="xs" className="text-gray-300 cursor-pointer hover:text-brand-blue" />
      </div>

      <div className="flex flex-col gap-4">
       <div className="flex gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-blue-light flex items-center justify-center text-brand-blue flex-shrink-0">
         <Icon name="location_on" size="sm" />
        </div>
        <div className="flex flex-col gap-1">
         <p className="text-xs font-black text-gray-700 leading-tight">Delivery Address</p>
         <p className="text-xs font-bold text-gray-400 leading-relaxed italic">
          {order.shippingAddress.line1}, {order.shippingAddress.line2}, {order.shippingAddress.city}, {order.shippingAddress.country}
         </p>
        </div>
       </div>

       <div className="flex gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-brand-orange flex-shrink-0">
         <Icon name="local_shipping" size="sm" />
        </div>
        <div className="flex flex-col gap-1">
         <p className="text-xs font-black text-gray-700 leading-tight">Courier Method</p>
         <p className="text-xs font-bold text-gray-400 leading-relaxed italic">
          {order.shippingMethod}
         </p>
        </div>
       </div>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}
