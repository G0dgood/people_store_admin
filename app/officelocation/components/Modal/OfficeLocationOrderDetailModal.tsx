"use client";

import React from "react";
import Image from "next/image";
import { HiOutlineXMark, HiOutlinePrinter, HiOutlineStar } from "react-icons/hi2";

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

// Simple Status Badge for the office portal
const StatusBadge = ({ value }: { value: string }) => {
  const getColors = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered": return "bg-green-50 text-green-700 border-green-100";
      case "pending": return "bg-amber-50 text-amber-700 border-amber-100";
      case "processing": return "bg-blue-50 text-blue-700 border-blue-100";
      case "cancelled": return "bg-red-50 text-red-700 border-red-100";
      default: return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getColors(value)}`}>
      {value}
    </span>
  );
};

export default function OfficeLocationOrderDetailModal({
  isOpen,
  onClose,
  orderId,
}: OrderDetailModalProps) {
  // In a real app, we would fetch the order details by orderId here
  // For now, we'll assume the parent might pass more data or we use a hook
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">Order Details</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <HiOutlineXMark size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction ID</p>
              <p className="text-lg font-bold text-gray-900">#{orderId}</p>
            </div>
            <StatusBadge value="Processing" />
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Items</p>
            <div className="space-y-4">
              {/* This would be mapped from fetched order data */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-xl border border-gray-100 p-2 relative overflow-hidden">
                  <div className="w-full h-full bg-gray-50 animate-pulse rounded-lg" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Premium Selection Item</p>
                  <p className="text-xs text-gray-500">Qty: 1 • ₦25,000</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 text-white flex justify-between items-center shadow-lg">
            <div>
              <p className="text-[10px] font-medium text-white/50 uppercase tracking-widest">Total Amount</p>
              <p className="text-2xl font-bold">₦25,000</p>
            </div>
            <HiOutlinePrinter className="text-white/20" size={32} />
          </div>
        </div>

        <div className="px-8 py-6 border-t border-gray-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button 
            onClick={() => window.print()}
            className="flex-1 px-6 py-3 bg-[#156BB6] rounded-xl text-sm font-bold text-white hover:bg-[#125999] transition-colors flex items-center justify-center gap-2"
          >
            <HiOutlinePrinter size={18} />
            Print
          </button>
        </div>
      </div>
    </div>
  );
}
