import React from "react";
import { SectionHeaderSimple } from "../ui/SectionHeaderSimple";
import { formatPrice } from "@/app/utils/formatPrice";

interface SummarySectionProps {
  title?: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  children?: React.ReactNode;
  actionButton?: React.ReactNode;
  className?: string;
  variant?: "cart" | "checkout";
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  title = "Order Summary",
  subtotal,
  discount,
  tax,
  total,
  children,
  actionButton,
  className = "",
  variant = "cart"
}) => {
  const isCart = variant === "cart";
  
  return (
    <div className={`
      flex flex-col gap-6
      ${isCart ? "bg-white border border-gray-200 p-8 shadow-none" : ""}
      ${className}
    `}>
      <SectionHeaderSimple title={title} className="!p-0 !border-0" />

      <div className="flex flex-col gap-3 pb-6 border-b border-gray-200">
        <div className="flex justify-between text-[11px] uppercase tracking-widest font-bold">
          <span className="text-gray-400">Subtotal</span>
          <span className="text-gray-900 font-outfit">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-[11px] uppercase tracking-widest font-bold">
          <span className="text-gray-400">Discount</span>
          <span className="text-brand-gold font-outfit">- {formatPrice(discount)}</span>
        </div>
        <div className="flex justify-between text-[11px] uppercase tracking-widest font-bold">
          <span className="text-gray-400">Estimated Tax</span>
          <span className="text-gray-900 font-outfit">+ {formatPrice(tax)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center py-2">
        <span className="font-outfit font-bold text-gray-900 uppercase tracking-widest">Total</span>
        <span className="font-outfit font-bold text-2xl text-gray-900">{formatPrice(total)}</span>
      </div>

      {actionButton && (
        <div className="w-full pt-2">
          {actionButton}
        </div>
      )}

      {children}
    </div>
  );
};
