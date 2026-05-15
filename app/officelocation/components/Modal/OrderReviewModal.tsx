import React from 'react';
import { HiOutlineXMark, HiOutlineTruck, HiOutlineBuildingStorefront, HiOutlineCreditCard, HiOutlineBanknotes } from 'react-icons/hi2';

interface OrderReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing?: boolean;
  orderDetails: {
    items: any[];
    deliveryDetails: any;
    paymentMethod: 'paystack' | 'instore';
    summary: {
      subtotal: number;
      deliveryFee: number;
      gatewayFee: number;
      total: number;
    }
  } | null;
}

export default function OrderReviewModal({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  orderDetails
}: OrderReviewModalProps) {
  if (!isOpen || !orderDetails) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Review Your Order</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <HiOutlineXMark size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Items Summary */}
          <div>
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Order Items</h4>
            <div className="space-y-4">
              {orderDetails.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800">{item.name}</span>
                    <span className="text-[10px] text-gray-400 uppercase font-black">
                      Qty: {item.quantity} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''}
                    </span>
                  </div>
                  <span className="font-bold text-gray-900">₦ {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Delivery Info */}
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-2 mb-3 text-[#156BB6]">
                {orderDetails.deliveryDetails.address && orderDetails.deliveryDetails.address !== "Pickup Station" ? (
                  <HiOutlineTruck size={18} />
                ) : (
                  <HiOutlineBuildingStorefront size={18} />
                )}
                <span className="text-[10px] font-black uppercase tracking-widest">Delivery Info</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{orderDetails.deliveryDetails.fullName}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {orderDetails.deliveryDetails.address || "In-Store Pickup"}
              </p>
              <p className="text-xs text-gray-500">{orderDetails.deliveryDetails.phoneNumber}</p>
            </div>

            {/* Payment Info */}
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-2 mb-3 text-[#156BB6]">
                {orderDetails.paymentMethod === 'paystack' ? <HiOutlineCreditCard size={18} /> : <HiOutlineBanknotes size={18} />}
                <span className="text-[10px] font-black uppercase tracking-widest">Payment Method</span>
              </div>
              <p className="text-sm font-bold text-gray-900">
                {orderDetails.paymentMethod === 'paystack' ? 'Online Payment' : 'Pay In-Store'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {orderDetails.paymentMethod === 'paystack' ? 'Safe via Paystack' : 'Cash or POS at pickup'}
              </p>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="p-6 rounded-2xl bg-gray-900 text-white flex justify-between items-center shadow-lg">
            <div>
              <p className="text-[10px] font-medium text-white/50 uppercase tracking-widest">Total Amount</p>
              <p className="text-2xl font-bold">₦ {orderDetails.summary.total.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-medium text-white/50 uppercase tracking-widest">Subtotal</p>
              <p className="text-sm font-bold">₦ {orderDetails.summary.subtotal.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-100 flex gap-3">
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 px-6 py-4 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Edit Order
          </button>
          <button 
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-[2] px-6 py-4 bg-[#156BB6] rounded-xl text-sm font-bold text-white hover:bg-[#125999] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Confirm & Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
