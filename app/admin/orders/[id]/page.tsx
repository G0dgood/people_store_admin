"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { Button } from "@/app/components/Button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Select } from "@/app/components/Form/Select";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import {
  HiChevronRight,
  HiCheckCircle,
  HiOutlineEnvelope,
  HiPhone,
  HiMapPin,
  HiPencil,
  HiArrowDownTray
} from "react-icons/hi2";
import {
  LuTruck,
  LuPackage,
  LuDownload,
  LuPencilLine,
  LuMapPin
} from "react-icons/lu";

import { useGetOrderByIdQuery, useUpdateOrderStatusMutation } from "@/lib/redux/services/orderApi";
import { toast } from "sonner";
import { OrderDetailsSkeleton } from "@/app/components/Skeleton/OrderDetailsSkeleton";
import { Icon } from "@/app/components/Icon";
import { InvoicePrint } from "@/app/components/Admin/InvoicePrint";
import { formatPrice } from "@/app/utils/formatPrice";

const statusStyles: any = {
  Delivered: { bg: "bg-blue-50", text: "text-blue-500", border: "border-blue-100", icon: "Delivered" },
  Shipped: { bg: "bg-gray-50", text: "text-gray-500", border: "border-gray-200", icon: "Shipped" },
  Pending: { bg: "bg-orange-50", text: "text-orange-400", border: "border-orange-100", icon: "Pending" },
  Cancelled: { bg: "bg-rose-50", text: "text-rose-500", border: "border-rose-100", icon: "Cancelled" },
  Processing: { bg: "bg-emerald-50", text: "text-emerald-500", border: "border-emerald-100", icon: "arrow-refresh-06" },
  Refunded: { bg: "bg-brand-gold/10", text: "text-brand-gold", border: "border-brand-gold/20", icon: "arrow-refresh-06" },
};

const paymentStyles: any = {
  Paid: { bg: "bg-emerald-50", text: "text-emerald-500", border: "border-emerald-100" },
  Pending: { bg: "bg-orange-50", text: "text-orange-400", border: "border-orange-100" },
  Failed: { bg: "bg-rose-50", text: "text-rose-500", border: "border-rose-100" },
  Refunded: { bg: "bg-brand-gold/10", text: "text-brand-gold", border: "border-brand-gold/20" },
};

export default function OrderDetails() {
  const { id } = useParams();
  const { data: response, isLoading } = useGetOrderByIdQuery(id as string, { skip: !id });
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);

  const order = response?.data;

  const handleUpdateStatus = async () => {
    if (!pendingStatus || !id) return;
    try {
      await updateStatus({ id: id as string, status: pendingStatus }).unwrap();
      toast.success("Order status updated successfully");
      setIsStatusConfirmOpen(false);
      setPendingStatus(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  if (isLoading) return <OrderDetailsSkeleton />;
  if (!order) return <div className="py-20 text-center font-bold text-gray-400">Order not found</div>;

  const currentStatus = order.status;

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col gap-4">
        <Breadcrumbs
          items={[
            { label: "Orders", href: "/admin/orders" },
            { label: `Order Details: ${order.orderId}` }
          ]}
        />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{order.orderId}</h1>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black border uppercase tracking-tighter ${statusStyles[currentStatus]?.bg} ${statusStyles[currentStatus]?.text} ${statusStyles[currentStatus]?.border}`}>
              <Icon name={statusStyles[currentStatus]?.icon} folder="dashboardIcon" size="xs" />
              {currentStatus}
            </div>
            <div className={`px-3 py-1.5 rounded-lg text-[10px] font-black border uppercase tracking-tighter ${paymentStyles[order.paymentStatus]?.bg} ${paymentStyles[order.paymentStatus]?.text} ${paymentStyles[order.paymentStatus]?.border}`}>
              {order.paymentStatus}
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <Button
              variant="ghost"
              className="bg-white border-gray-200 text-gray-700 font-bold px-6 h-10"
              shape="rounded-sm"
              onClick={() => window.print()}
            >
              <LuDownload className="mr-2 text-md" />
              Print Invoice
            </Button>
            <div className="w-48">
              <Select
                shape="rounded-sm"
                value={pendingStatus || currentStatus}
                onChange={(val: string) => {
                  setPendingStatus(val as string);
                  setIsStatusConfirmOpen(true);
                }}
                options={[
                  { label: "Pending", value: "Pending" },
                  { label: "Processing", value: "Processing" },
                  { label: "Shipped", value: "Shipped" },
                  { label: "Delivered", value: "Delivered" },
                  { label: "Cancelled", value: "Cancelled" },
                  { label: "Refunded", value: "Refunded" },
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
          <div className="bg-white border border-[#1C1C1C1A] rounded-[6px] overflow-hidden">
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
                    {order.items.map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="pl-8">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                              <img src={item.product?.productImage || "/dashboardImage/Headphones.png"} alt="" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-sm font-black text-gray-900 leading-tight">{item.product?.name || "Product"}</span>
                          </div>
                        </td>
                        <td className="text-sm font-bold text-gray-500">{formatPrice(item.price)}</td>
                        <td className="text-sm font-bold text-gray-900">{item.quantity}</td>
                        <td className="text-sm font-black text-gray-900 text-right pr-12">{formatPrice(item.price * item.quantity)}</td>
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
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="h-px bg-gray-200 my-2"></div>
                <div className="flex justify-between text-xl font-black text-gray-900">
                  <span>Total Paid</span>
                  <span className="text-brand-gold">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>


          {/* Activity Logs */}
          <div className="bg-white p-8 border border-[#1C1C1C1A] rounded-[6px] flex flex-col gap-6">
            <h3 className="text-xl font-black text-gray-900">Operational Timeline</h3>
            <div className="flex flex-col gap-6 relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-50"></div>
              {[
                { title: "Status Update", date: new Date(order.updatedAt).toLocaleString(), desc: `Order is currently ${order.status}`, icon: <Icon name={statusStyles[order.status]?.icon} folder="dashboardIcon" size="sm" />, active: true },
                { title: "Order Placed", date: new Date(order.createdAt).toLocaleString(), desc: "Order successfully submitted by customer.", icon: <HiCheckCircle /> },
              ].map((log, i) => (
                <div key={i} className="flex gap-6 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${log.active ? (order.status === "Cancelled" ? "bg-rose-500" : "bg-brand-gold") + " text-white" : "bg-gray-100 text-gray-400"}`}>
                    <span className="flex items-center justify-center">{log.icon}</span>
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
          <div className="bg-white p-8 border border-[#1C1C1C1A] rounded-[6px] flex flex-col gap-6">
            <h3 className="text-lg font-black text-gray-900">Customer Profiles</h3>
            <div className="flex items-center gap-4">
              <img src={order.customer?.avatar || "https://ui-avatars.com/api/?name=" + order.customer?.fullName} alt="" className="w-14 h-14 rounded-2xl object-cover shadow-lg shadow-brand-gold/10 border-2 border-white" />
              <div className="flex flex-col">
                <p className="text-md font-black text-gray-900 leading-none">{order.customer?.fullName || "Guest"}</p>
                <p className="text-xs font-bold text-gray-400 mt-2">Verified Customer</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-6 border-t border-gray-50">
              <div className="flex gap-3 items-center">
                <HiOutlineEnvelope className="text-gray-400 text-lg" />
                <span className="text-xs font-black text-gray-600">{order.customer?.email}</span>
              </div>
              <div className="flex gap-3 items-center">
                <HiPhone className="text-gray-400 text-lg" />
                <span className="text-xs font-black text-gray-600">{order.customer?.phoneNumber || "No phone"}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-8 border border-[#1C1C1C1A] rounded-[6px] flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-gray-900">Shipping Info</h3>
              <LuPencilLine className="text-gray-300 cursor-pointer hover:text-brand-gold text-lg" title="Edit Address" />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0">
                  <HiMapPin className="text-lg" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-black text-gray-700 leading-tight">Delivery Address</p>
                  <p className="text-xs font-bold text-gray-400 leading-relaxed italic">
                    {order.shippingAddress}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-brand-orange flex-shrink-0">
                  <LuTruck className="text-lg" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-black text-gray-700 leading-tight">Standard Shipping</p>
                  <p className="text-xs font-bold text-gray-400 leading-relaxed italic">
                    Dispatch expected within 2-3 days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isStatusConfirmOpen}
        onClose={() => {
          setIsStatusConfirmOpen(false);
          setPendingStatus(null);
        }}
        onConfirm={handleUpdateStatus}
        isLoading={isUpdating}
        title="Update Order Status"
        message={`Are you sure you want to change the status of this order to "${pendingStatus}"? This may trigger automated customer notifications.`}
        confirmText="Yes, update status"
        type={pendingStatus === "Cancelled" ? "danger" : "info"}
      />

      <InvoicePrint order={order} />
    </div>
  );
}
