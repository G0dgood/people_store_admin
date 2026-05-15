"use client";

import React from "react";
import { HiOutlineCheckCircle, HiOutlineArrowRight } from "react-icons/hi2";
import Link from "next/link";
import { getStoreUrl } from "../../utils/storeUtils";

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  status?: string;
}

export default function OrderSuccessModal({
  isOpen,
  onClose,
  status
}: OrderSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-8 text-center space-y-6 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
            <HiOutlineCheckCircle size={48} className="text-green-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">Order Placed!</h3>
          <p className="text-sm text-gray-500">
            {status || "Your order has been successfully received. We've sent a confirmation to your email."}
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <button
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#156BB6] px-6 py-4 text-sm font-bold text-white transition-all hover:bg-[#125999]"
          >
            Continue Shopping
            <HiOutlineArrowRight size={18} />
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
