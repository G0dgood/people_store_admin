"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import ModalFooter from "../Modal/ModalFooter";
import { Input } from "../Form/Inputs";
import { Select } from "../Form/Select";
import { Button } from "../Button";
import { FiImage } from "react-icons/fi";
import { MediaSelectionModal } from "./MediaSelectionModal";
import { UploadCouponAssetModal } from "./UploadCouponAssetModal";
import { useCreateCouponMutation } from "@/lib/redux/services/couponApi";
import { toast } from "sonner";

interface AddCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export function AddCouponModal({ isOpen, onClose }: AddCouponModalProps) {
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    discount: "",
    type: "Percentage",
    startDate: "",
    endDate: "",
    status: "Active",
    image: "",
    usageLimit: "",
    minAmount: "",
    bgColor: "#C5A028", // Default to Gold
  });

  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createCoupon({
        ...formData,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : 0,
      }).unwrap();

      toast.success("Coupon Created Successfully", {
        description: `Coupon ${formData.code} is now active.`
      });

      setFormData({
        code: "",
        title: "",
        description: "",
        discount: "",
        type: "Percentage",
        startDate: "",
        endDate: "",
        status: "Active",
        image: "",
        usageLimit: "",
        minAmount: "",
        bgColor: "#C5A028",
      });
      onClose();
    } catch (err: any) {
      toast.error("Failed to Create Coupon", {
        description: err?.data?.message || "Something went wrong."
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Coupon" size="lg">
      <form onSubmit={handleSubmit}>
        <ModalBody className="flex flex-col gap-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Coupon Code</label>
              <Input
                shape="rounded-sm"
                placeholder="e.g. FLASH50"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="h-12 border-gray-200 font-bold"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Public Title</label>
              <Input
                shape="rounded-sm"
                placeholder="e.g. Black Friday Special"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-12 border-gray-200 font-bold"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Short Description</label>
            <Input
              shape="rounded-sm"
              placeholder="e.g. Get 50% off all artisanal items this weekend only."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="h-12 border-gray-200 font-bold"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Discount Amount</label>
              <Input
                shape="rounded-sm"
                placeholder="e.g. 50% or 20.00"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="h-12 border-gray-200 font-bold"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Discount Type</label>
              <Select
                shape="rounded-sm"
                options={typeOptions}
                value={formData.type}
                onChange={(val) => setFormData({ ...formData, type: val })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Usage Limit</label>
              <Input
                shape="rounded-sm"
                type="number"
                placeholder="e.g. 100 (0 for unlimited)"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                className="h-12 border-gray-200 font-bold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Min. Purchase Amount</label>
              <Input
                shape="rounded-sm"
                type="text"
                placeholder="e.g. 10000"
                value={formData.minAmount}
                onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                className="h-12 border-gray-200 font-bold"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Background Color Scheme</label>
            <div className="flex flex-wrap gap-3">
              {[
                { name: "Gold", color: "#C5A028" },
                { name: "Onyx", color: "#000000" },
                { name: "Deep Blue", color: "#1D3557" },
                { name: "Rose", color: "#E63946" },
                { name: "Teal", color: "#2A9D8F" },
                { name: "Sand", color: "#F4A261" },
              ].map((item) => (
                <button
                  key={item.color}
                  type="button"
                  onClick={() => setFormData({ ...formData, bgColor: item.color })}
                  className={`group relative flex flex-col items-center gap-1.5 p-1 transition-all ${formData.bgColor === item.color ? "opacity-100" : "opacity-60 hover:opacity-100"
                    }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full border-2 transition-all ${formData.bgColor === item.color ? "border-brand-gold scale-110 shadow-lg" : "border-transparent"
                      }`}
                    style={{ backgroundColor: item.color }}
                  >
                    {formData.bgColor === item.color && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white  " />
                      </div>
                    )}
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-tighter text-gray-400 group-hover:text-gray-900 transition-colors">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Start Date</label>
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
              <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">End Date</label>
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

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Initial Status</label>
            <Select
              shape="rounded-sm"
              options={statusOptions}
              value={formData.status}
              onChange={(val) => setFormData({ ...formData, status: val })}
            />
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end gap-3 border-t border-gray-50 pt-6">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            shape="rounded-sm"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            shape="rounded-sm"
            isLoading={isCreating}
          >
            Create Coupon
          </Button>
        </ModalFooter>
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
    </Modal>
  );
}
