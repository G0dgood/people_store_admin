import React, { useState } from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';
import Dropdown from '@/app/components/Form/Dropdown';

export interface DeliveryDetails {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  notes?: string;
}

interface HomeDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (details: DeliveryDetails, paymentType: "paystack" | "instore") => void;
  initialData?: Partial<DeliveryDetails>;
}

export default function HomeDeliveryModal({ isOpen, onClose, onSave, initialData }: HomeDeliveryModalProps) {
  const [formData, setFormData] = useState<DeliveryDetails>({
    fullName: initialData?.fullName || '',
    email: initialData?.email || '',
    address: initialData?.address || '',
    phoneNumber: initialData?.phoneNumber || '',
    notes: initialData?.notes || '',
  });

  const [paymentType, setPaymentType] = useState<"paystack" | "instore">("paystack");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, paymentType);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Home Delivery Details</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <HiOutlineXMark size={24} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Body */}
          <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recipient Name</label>
                <input
                  type="text"
                  placeholder="Full name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#156BB6] outline-none transition-all"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
                <input
                  type="text"
                  placeholder="Contact number"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#156BB6] outline-none transition-all"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
              <input
                type="email"
                placeholder="For tracking updates"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#156BB6] outline-none transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery Address</label>
              <input
                type="text"
                placeholder="Street address, city, state"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#156BB6] outline-none transition-all"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
            
            <div className="pt-6 border-t border-gray-100 space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Preferred Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentType("paystack")}
                  className={`px-4 py-4 rounded-xl border text-xs font-bold transition-all ${
                    paymentType === "paystack" 
                    ? "bg-[#156BB6] border-[#156BB6] text-white shadow-md" 
                    : "bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200"
                  }`}
                >
                  Pay Online
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType("instore")}
                  className={`px-4 py-4 rounded-xl border text-xs font-bold transition-all ${
                    paymentType === "instore" 
                    ? "bg-[#156BB6] border-[#156BB6] text-white shadow-md" 
                    : "bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200"
                  }`}
                >
                  Pay In-Store
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-gray-100 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-6 py-4 bg-[#156BB6] rounded-xl text-sm font-bold text-white hover:bg-[#125999] transition-colors"
            >
              Review Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
