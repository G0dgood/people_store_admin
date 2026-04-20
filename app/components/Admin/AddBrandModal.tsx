"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import ModalFooter from "../Modal/ModalFooter";
import { Input } from "../Form/Inputs";
import { Select } from "../Form/Select";
import { Button } from "../Button";
import { Icon } from "../Icon";

interface AddBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryOptions = [
  { value: "Electronics", label: "Electronics" },
  { value: "Fashion", label: "Fashion" },
  { value: "Accessories", label: "Accessories" },
  { value: "Home Appliance", label: "Home Appliance" },
];

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

export function AddBrandModal({ isOpen, onClose }: AddBrandModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    category: "Electronics",
    status: "Active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating new brand:", formData);
    // Reset form
    setFormData({
      name: "",
      logo: "",
      category: "Electronics",
      status: "Active",
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Brand" size="lg">
      <form onSubmit={handleSubmit}>
        <ModalBody className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Brand Name</label>
            <Input
              placeholder="e.g. Apple, Nike, etc."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12 border-gray-200 font-bold"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Brand Logo Path</label>
            <div className="flex gap-4">
              <Input
                placeholder="/dashboardImage/example.png"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="h-12 border-gray-200 font-bold flex-1"
                required
              />
              <Button
                type="button"
                variant="outline"
                shape="rounded-sm"
                className="w-12 h-12 p-0 flex-shrink-0"
              >
                <Icon name="photo" folder="icon" size="sm" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Category</label>
              <Select
                options={categoryOptions}
                value={formData.category}
                onChange={(val) => setFormData({ ...formData, category: val })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Initial Status</label>
              <Select
                options={statusOptions}
                value={formData.status}
                onChange={(val) => setFormData({ ...formData, status: val })}
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end gap-3 border-t border-gray-50 pt-6">
          <Button
            shape="rounded-sm"
            variant="outline"
            type="button"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            shape="rounded-sm"
            variant="primary"
            type="submit"
          >
            Create Brand
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
