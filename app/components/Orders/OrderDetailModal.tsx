"use client";

import React from "react";
import Image from "next/image";
import Modal from "../Modal/Modal";
import { StatusBadge } from "../StatusBadge";
import { Button } from "../Button/Button";
import { Icon } from "../Icon";
import { RefundRequestModal } from "../Refund/RefundRequestModal";
import { ReviewModal } from "../Modal/ReviewModal";

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  mode?: "view" | "review";
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
  mode = "view",
}) => {
  const [isRefundModalOpen, setIsRefundModalOpen] = React.useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);

  if (!order) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Order Details"
        size="md"
      >
        <div className="flex flex-col gap-6 py-2">
          {/* Header Info */}
          <div className="flex justify-between items-start border-b border-gray-100 pb-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction Reference</span>
              <h3 className="text-xl font-bold text-gray-900">{order.orderId}</h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
            <StatusBadge module="order" value={order.status} size="md" />
          </div>

          {/* Items List */}
          <div className={`flex flex-col gap-4 ${mode === "review" ? "ring-2 ring-brand-gold/20 p-4 bg-brand-gold/5 rounded-2xl" : ""}`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Curated Pieces</span>
              {mode === "review" && (
                <span className="text-[9px] font-bold text-brand-gold uppercase tracking-widest animate-pulse">Select an item to review</span>
              )}
            </div>
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 p-2 flex-shrink-0 relative overflow-hidden">
                    <Image
                      src={item.product?.productImage || "/images/placeholder.jpg"}
                      alt={item.product?.name || "Product"}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-0.5">
                    <span className="text-xs font-black text-gray-900 line-clamp-1">{item.product?.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Qty: {item.quantity}</span>
                      <div className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="text-[10px] font-bold text-brand-gold uppercase">₦{item.price.toLocaleString()}</span>
                    </div>
                  </div>
                  {order.status === "Delivered" && (
                    <button
                      onClick={() => {
                        setSelectedProduct(item.product);
                        setIsReviewModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[9px] font-black uppercase tracking-widest text-gray-900 hover:border-brand-gold hover:text-brand-gold transition-all   active:scale-95"
                    >
                      <Icon name="star" size="xs" />
                      Review
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-900 p-6 rounded-2xl flex items-center justify-between text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex flex-col gap-1 z-10">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Total Selection</span>
              <span className="text-2xl font-bold tracking-tight">₦{order.totalAmount.toLocaleString()}</span>
            </div>
            <Icon name="verified" size="md" className="text-white/20 z-10" />
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex flex-row justify-end gap-3">
              <Button
                variant="outline"
                shape="rounded-sm"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                variant="primary"
                shape="rounded-sm"
                onClick={() => window.print()}
              >
                Print Receipt
              </Button>
            </div>

            {!order.refund ? (
              <button
                onClick={() => setIsRefundModalOpen(true)}
                className="w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 hover:bg-rose-50 rounded-sm transition-all border border-dashed border-rose-200"
              >
                Request a Refund
              </button>
            ) : (
              <div className="flex flex-col items-center gap-2 p-4 bg-rose-50/50 rounded-xl border border-rose-100">
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">Active Refund Request</span>
                <StatusBadge module="refund" value={order.refund.status} size="md" />
                {order.refund.adminNote && (
                  <p className="text-[10px] text-gray-500 italic text-center mt-1">"{order.refund.adminNote}"</p>
                )}
              </div>
            )}
          </div>
        </div>
      </Modal>

      <RefundRequestModal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        initialOrder={order}
      />

      {selectedProduct && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          productId={selectedProduct._id}
          productName={selectedProduct.name}
        />
      )}
    </>
  );
};
