"use client";

import React, { useState, useEffect } from "react";
import Drawer from "../Drawer/Drawer";
import { Input } from "../Form/Inputs";
import { Select } from "../Form/Select";
import { Button } from "../Button";
import { Icon } from "../Icon";

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
  });

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code || "",
        discount: coupon.discount || "",
        type: coupon.type || "Percentage",
        startDate: coupon.startDate || "",
        endDate: coupon.endDate || "",
        status: coupon.status || "Active",
      });
    }
  }, [coupon]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving coupon changes:", formData);
    onClose();
  };

  if (!coupon) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Edit Coupon Code">
      <form onSubmit={handleSubmit} className="flex flex-col h-full gap-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Coupon Code</label>
            <Input
              placeholder="e.g. SUMMER25"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="h-12 border-gray-200 focus:border-brand-blue/50 transition-all font-bold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Discount</label>
              <Input
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
                type="text"
                placeholder="01-01-2025"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="h-12 border-gray-200 font-bold"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">End Date</label>
              <Input
                type="text"
                placeholder="31-12-2025"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="h-12 border-gray-200 font-bold"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Status</label>
            <Select
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
    </Drawer>
  );
}
