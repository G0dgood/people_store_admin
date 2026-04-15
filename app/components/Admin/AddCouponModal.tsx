"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import ModalFooter from "../Modal/ModalFooter";
import { Input } from "../Form/Inputs";
import { Select } from "../Form/Select";
import { Button } from "../Button";

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
    discount: "",
    type: "Percentage",
    startDate: "",
    endDate: "",
    status: "Active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating new coupon:", formData);
    // Reset form
    setFormData({
      code: "",
      discount: "",
      type: "Percentage",
      startDate: "",
      endDate: "",
      status: "Active",
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Coupon" size="lg">
      <form onSubmit={handleSubmit}>
        <ModalBody className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Coupon Code</label>
            <Input
              placeholder="e.g. FLASH50"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="h-12 border-gray-100 font-bold"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Discount Value</label>
              <Input
                placeholder="e.g. 50% or 20.00"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="h-12 border-gray-100 font-bold"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Discount Type</label>
              <Select
                options={typeOptions}
                value={formData.type}
                onChange={(val) => setFormData({ ...formData, type: val })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Start Date</label>
              <Input
                type="text"
                placeholder="DD-MM-YYYY"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="h-12 border-gray-100 font-bold"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">End Date</label>
              <Input
                type="text"
                placeholder="DD-MM-YYYY"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="h-12 border-gray-100 font-bold"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Initial Status</label>
            <Select
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
            className="px-8 h-12 text-[11px] font-bold"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            className="px-8 h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
          >
            Create Coupon
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
