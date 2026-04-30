"use client";

import React, { useState, useEffect } from "react";
import Drawer from "../Drawer/Drawer";
import { Input } from "../Form/Inputs";
import { Select } from "../Form/Select";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { FiImage } from "react-icons/fi";
import { MediaSelectionModal } from "./MediaSelectionModal";
import { UploadCouponAssetModal } from "./UploadCouponAssetModal";
import { useUpdateCouponMutation } from "@/lib/redux/services/couponApi";
import { toast } from "sonner";

interface EditCouponDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  coupon: any;
}

const typeOptions = [
  { value: "Percentage", label: "Percentage (%)" },
  { value: "Fixed Rate", label: "Fixed Rate ($)" },
  { value: "Shipping", label: "Free Shipping" },
];

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Scheduled", label: "Scheduled" },
  { value: "Expired", label: "Expired" },
];

export function EditCouponDrawer({ isOpen, onClose, coupon }: EditCouponDrawerProps) {
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    type: "Percentage",
    startDate: "",
    endDate: "",
    status: "Active",
    image: "",
    usageLimit: "",
    minAmount: "",
  });

  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code || "",
        discount: coupon.discount || "",
        type: coupon.type || "Percentage",
        startDate: coupon.startDate || "",
        endDate: coupon.endDate || "",
        status: coupon.status || "Active",
        image: coupon.image || "",
        usageLimit: coupon.usageLimit || "",
        minAmount: coupon.minAmount || "",
      });
    }
  }, [coupon]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupon?._id) return;

    try {
      await updateCoupon({
        id: coupon._id,
        data: {
          ...formData,
          usageLimit: formData.usageLimit ? parseInt(formData.usageLimit.toString()) : 0,
        }
      }).unwrap();

      toast.success("Coupon Updated", {
        description: `Changes to ${formData.code} saved successfully.`
      });
      onClose();
    } catch (err: any) {
      toast.error("Update Failed", {
        description: err?.data?.message || "Failed to save coupon changes."
      });
    }
  };

  if (!coupon) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Edit Coupon Code">
      <form onSubmit={handleSubmit} className="flex flex-col h-full gap-8">
        <div className="flex flex-col gap-6">
          {/* Image Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Coupon Banner / Image</label>
            {formData.image ? (
              <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-200 group">
                <img src={formData.image} alt="Coupon Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsMediaModalOpen(true)}
                    className="bg-white text-black px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold hover:text-white transition-all"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: "" })}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsMediaModalOpen(true)}
                className="w-full h-32 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:border-brand-gold hover:bg-gray-50 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors">
                  <FiImage className="text-gray-400 text-xl" />
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-brand-gold">Select Coupon Image</span>
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Coupon Code</label>
            <Input
              shape="rounded-sm"
              placeholder="e.g. SUMMER25"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="h-12 border-gray-200 focus:border-brand-gold/50 transition-all font-bold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Discount</label>
              <Input
                shape="rounded-sm"
                placeholder="20% or 10.00"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="h-12 border-gray-200 font-bold"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Type</label>
              <Select
                shape="rounded-sm"
                options={typeOptions}
                value={formData.type}
                onChange={(val) => setFormData({ ...formData, type: val })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Start Date</label>
              <Input
                shape="rounded-sm"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="h-12 border-gray-200 font-bold"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">End Date</label>
              <Input
                shape="rounded-sm"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="h-12 border-gray-200 font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Usage Limit</label>
              <Input
                shape="rounded-sm"
                type="number"
                placeholder="0 for unlimited"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                className="h-12 border-gray-200 font-bold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Min. Amount</label>
              <Input
                shape="rounded-sm"
                placeholder="Min. spend"
                value={formData.minAmount}
                onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                className="h-12 border-gray-200 font-bold"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Status</label>
            <Select
              shape="rounded-sm"
              options={statusOptions}
              value={formData.status}
              onChange={(val) => setFormData({ ...formData, status: val })}
            />
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-gray-50 flex flex-col gap-3">
          <Button
            shape="rounded-sm"
            variant="primary"
            type="submit"
            className="w-full h-10 sm:h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
            isLoading={isUpdating}
          >
            Update Coupon
          </Button>
          <Button
            shape="rounded-sm"
            variant="outline"
            type="button"
            onClick={onClose}
            className="w-full h-10 sm:h-12 text-[11px] font-bold text-gray-400 hover:text-gray-900"
          >
            Cancel
          </Button>
        </div>
      </form>

      <MediaSelectionModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(url) => setFormData({ ...formData, image: url })}
        title="Select Coupon Image"
        onUploadClick={() => setIsUploadModalOpen(true)}
      />

      <UploadCouponAssetModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </Drawer>
  );
}
