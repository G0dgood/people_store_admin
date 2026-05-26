"use client";

import React from "react";
import Drawer from "../Drawer/Drawer";
import { StatusBadge } from "../StatusBadge";
import { Avatar } from "../Other/Avatar";
import { formatPrice } from "@/app/utils/formatPrice";
import moment from "moment";
import { FiMail, FiPhone, FiMapPin, FiClock, FiExternalLink } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";

interface DeliveryDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  assignedDriver?: any;
}

const vehicleColors: Record<string, { bg: string; text: string; icon: string }> = {
  Motorcycle: { bg: "bg-amber-50", text: "text-amber-700", icon: "🏍️" },
  Car:        { bg: "bg-blue-50",  text: "text-blue-700",  icon: "🚗" },
  Van:        { bg: "bg-purple-50",text: "text-purple-700",icon: "🚐" },
  Bicycle:    { bg: "bg-emerald-50",text: "text-emerald-700",icon: "🚲" },
};

export function DeliveryDetailDrawer({
  isOpen,
  onClose,
  order,
  assignedDriver,
}: DeliveryDetailDrawerProps) {
  if (!order) return null;

  const steps = [
    { label: "Pending", description: "Order Received", statusKey: "Pending" },
    { label: "Processing", description: "Packed & Ready", statusKey: "Processing" },
    { label: "Shipped", description: "In Transit", statusKey: "Shipped" },
    { label: "Delivered", description: "Received by Customer", statusKey: "Delivered" },
  ];

  const currentStatusIndex = steps.findIndex((step) => step.statusKey === order.status);

  const openDriverMaps = () => {
    if (assignedDriver?.currentLocation?.latitude && assignedDriver?.currentLocation?.longitude) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${assignedDriver.currentLocation.latitude},${assignedDriver.currentLocation.longitude}`,
        "_blank"
      );
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Delivery Details" width="max-w-xl">
      <div className="flex flex-col gap-6 pb-12">
        {/* Header Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Delivery Reference
            </span>
            <h3 className="text-lg font-black text-[#121212]">{order.orderId || order._id}</h3>
            <span className="text-[10px] text-gray-400 font-bold">
              Ordered: {moment(order.createdAt).format("MMM DD, YYYY hh:mm A")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge module="order" value={order.status} />
          </div>
        </div>

        {/* Shipment Progress Stepper */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            Delivery Progress
          </h4>
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Background line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -translate-y-1/2 hidden md:block" />

            {steps.map((step, index) => {
              const isCompleted = index <= currentStatusIndex && order.status !== "Cancelled";
              const isActive = index === currentStatusIndex && order.status !== "Cancelled";
              const isCancelled = order.status === "Cancelled";

              return (
                <div
                  key={step.label}
                  className="flex md:flex-col items-center gap-3 md:gap-2 flex-1 relative z-10 w-full"
                >
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all duration-300
                      ${
                        isCancelled
                          ? "bg-rose-50 border-rose-500 text-rose-500"
                          : isActive
                          ? "bg-brand-gold text-white border-brand-gold ring-4 ring-brand-gold/10"
                          : isCompleted
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "bg-white border-gray-200 text-gray-400"
                      }`}
                  >
                    {isCancelled ? "✕" : isCompleted ? "✓" : index + 1}
                  </div>
                  <div className="flex flex-col md:items-center">
                    <span
                      className={`text-xs font-black uppercase tracking-wider
                        ${isActive ? "text-[#121212]" : isCompleted ? "text-emerald-500" : "text-gray-400"}`}
                    >
                      {step.label}
                    </span>
                    <span className="text-[9px] text-gray-400 font-medium hidden md:inline text-center leading-tight">
                      {step.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {order.status === "Cancelled" && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600 text-center">
              ⚠️ This shipment has been cancelled
            </div>
          )}
        </div>

        {/* Assigned Driver Section */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">
            Assigned Courier
          </h4>
          {assignedDriver ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={
                      assignedDriver.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        assignedDriver.fullName
                      )}&background=C5A028&color=fff`
                    }
                    name={assignedDriver.fullName}
                    size="md"
                    className="border border-gray-100 shadow-sm"
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-black text-[#121212]">
                      {assignedDriver.fullName}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-widest border
                          ${vehicleColors[assignedDriver.vehicleType]?.bg || "bg-gray-50"}
                          ${vehicleColors[assignedDriver.vehicleType]?.text || "text-gray-600"}`}
                      >
                        <span>{vehicleColors[assignedDriver.vehicleType]?.icon || "🚘"}</span>
                        {assignedDriver.vehicleType}
                      </span>
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                        Plate: {assignedDriver.vehicleNumber || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <StatusBadge
                    module="driverAvailability"
                    value={assignedDriver.isAvailable ? "available" : "unavailable"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-50">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <FiPhone className="text-gray-400" />
                  <span className="font-bold">{assignedDriver.phoneNumber || "No Phone"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <FiMail className="text-gray-400" />
                  <span className="font-bold truncate">{assignedDriver.email}</span>
                </div>
              </div>

              {assignedDriver.currentLocation &&
                (assignedDriver.currentLocation.latitude !== 0 ||
                  assignedDriver.currentLocation.longitude !== 0) && (
                  <button
                    onClick={openDriverMaps}
                    className="flex items-center justify-between p-3.5 bg-brand-gold/5 border border-brand-gold/20 rounded-xl hover:bg-brand-gold/10 hover:border-brand-gold/30 transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <HiOutlineLocationMarker className="text-brand-gold shrink-0 animate-bounce" size={16} />
                      <div className="flex flex-col text-left">
                        <span className="text-[9px] font-black text-brand-gold uppercase tracking-wider">
                          Active Courier GPS Location
                        </span>
                        <span className="text-xs font-black text-[#121212]">
                          {assignedDriver.currentLocation.latitude.toFixed(6)},{" "}
                          {assignedDriver.currentLocation.longitude.toFixed(6)}
                        </span>
                      </div>
                    </div>
                    <FiExternalLink size={12} className="text-brand-gold group-hover:scale-110 transition-transform" />
                  </button>
                )}
            </div>
          ) : (
            <div className="bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-2">
              <span className="text-2xl">📦</span>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                No courier assigned to this delivery
              </span>
            </div>
          )}
        </div>

        {/* Customer & Destination Details */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">
            Destination & Customer
          </h4>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Avatar
                src={
                  order.customer?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    order.customer?.fullName || "Guest"
                  )}&background=1c1c1c&color=fff`
                }
                name={order.customer?.fullName || "Guest"}
                size="sm"
                className="border border-gray-50 shadow-sm"
              />
              <div className="flex flex-col">
                <span className="text-xs font-black text-[#121212]">
                  {order.customer?.fullName || "Guest Customer"}
                </span>
                <span className="text-[9px] font-bold text-gray-400 truncate max-w-[200px]">
                  {order.customer?.email}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-3 border-t border-gray-50">
              <div className="flex items-start gap-2.5">
                <FiMapPin className="text-gray-400 mt-0.5 shrink-0" size={14} />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Delivery Address
                  </span>
                  <span className="text-xs font-bold text-[#121212]">
                    {order.shippingAddress || "N/A"}
                  </span>
                </div>
              </div>

              {order.customer?.phoneNumber && (
                <div className="flex items-center gap-2.5">
                  <FiPhone className="text-gray-400 shrink-0" size={14} />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Contact Phone
                    </span>
                    <span className="text-xs font-bold text-[#121212]">
                      {order.customer.phoneNumber}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Items List */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">
            Package Items ({order.items?.length || 0})
          </h4>
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} className="p-4 flex items-center justify-between gap-4 bg-white hover:bg-neutral-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product?.productImage || "/placeholder.png"}
                    alt={item.product?.name || "Product"}
                    className="w-10 h-10 rounded-lg object-cover border border-gray-100 bg-gray-50"
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-black text-[#121212] truncate max-w-[240px]">
                      {item.product?.name || "Deleted Product"}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black text-[#121212]">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="p-4 bg-neutral-50/50 flex justify-between items-center">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Total Value
              </span>
              <span className="text-sm font-black text-[#121212]">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
