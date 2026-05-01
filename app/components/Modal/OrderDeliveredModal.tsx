"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { useRouter } from "next/navigation";

interface OrderDeliveredModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export const OrderDeliveredModal: React.FC<OrderDeliveredModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white w-full max-w-md overflow-hidden relative border border-gray-100 shadow-2xl rounded-none"
        >
          {/* Artisanal Gold Accent Top */}
          <div className="h-1.5 w-full bg-brand-gold" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 transition-colors z-10"
          >
            <Icon name="close" size="sm" />
          </button>

          <div className="p-8 md:p-10 flex flex-col items-center text-center">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-brand-gold/5 rounded-full flex items-center justify-center mb-8 relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center text-white shadow-lg shadow-brand-gold/20"
              >
                <Icon name="verified" size="lg" />
              </motion.div>
              
              {/* Decorative Rings */}
              <div className="absolute inset-0 border border-brand-gold/20 rounded-full animate-ping opacity-20" />
            </div>

            <h2 className="text-2xl md:text-3xl font-outfit font-light uppercase tracking-[0.1em] text-gray-900 mb-4">
              Your Piece has <span className="font-bold">Arrived</span>
            </h2>
            
            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">
              We are delighted to inform you that your curated order <span className="text-gray-900 font-bold">#{order?.orderId || order?._id?.slice(-6).toUpperCase()}</span> has been successfully delivered. We hope you enjoy your new artisanal acquisition.
            </p>

            <div className="w-full flex flex-col gap-3">
              <Button
                onClick={() => {
                  onClose();
                  router.push("/admin/orders"); // Assuming user wants to see order details
                }}
                className="w-full h-14 bg-black text-white font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-brand-gold transition-all shadow-none rounded-none"
              >
                View Order Details
              </Button>
              
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full h-14 border-gray-200 text-gray-900 font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-gray-50 transition-all shadow-none rounded-none"
              >
                Continue Discovery
              </Button>
            </div>
          </div>

          {/* Footer Decoration */}
          <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-center gap-3">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Bloom & Mist Artisanal Standards</span>
            <div className="w-1 h-1 bg-brand-gold rounded-full" />
            <Icon name="security" size="xs" className="text-gray-300" />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
