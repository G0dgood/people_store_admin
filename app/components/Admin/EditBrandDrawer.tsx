"use client";

import React, { useState, useEffect } from "react";
import Drawer from "../Drawer/Drawer";
import { Input } from "../Form/Inputs";
import { Select } from "../Form/Select";
import { Button } from "../Button";
import { Icon } from "../Icon";

interface EditBrandDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  brand: any;
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

export function EditBrandDrawer({ isOpen, onClose, brand }: EditBrandDrawerProps) {
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    category: "Electronics",
    status: "Active",
  });

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name || "",
        logo: brand.logo || "",
        category: brand.category || "Electronics",
        status: brand.status || "Active",
      });
    }
  }, [brand]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving brand changes:", formData);
    onClose();
  };

  if (!brand) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Edit Brand">
      <form onSubmit={handleSubmit} className="flex flex-col h-full gap-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Brand Name</label>
            <Input
              shape="rounded-sm"
              placeholder="e.g. Apple"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12 border-gray-200 font-bold rounded-sm"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Brand Logo Path</label>
            <div className="flex gap-4">
              <Input
                shape="rounded-sm"
                placeholder="/dashboardImage/example.png"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="h-12 border-gray-200 font-bold flex-1 rounded-sm"
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

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Inventory No</label>
              <div className="h-12 bg-gray-50 border border-gray-100 rounded-sm px-4 flex items-center">
                <span className="text-xs font-black text-brand-gold uppercase tracking-wider">{brand.inventoryCount || 0} items in stock</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Category</label>
              <Select
                className="rounded-sm"
                shape="rounded-sm"
                options={categoryOptions}
                value={formData.category}
                onChange={(val) => setFormData({ ...formData, category: val })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Status</label>
              <Select
                className="rounded-sm"
                shape="rounded-sm"
                options={statusOptions}
                value={formData.status}
                onChange={(val) => setFormData({ ...formData, status: val })}
              />
            </div>
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-gray-50 flex flex-col gap-3">
          <Button
            shape="rounded-sm"
            variant="primary"
            type="submit"
            className="w-full h-10 sm:h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-brand-gold/10 transition-all duration-300 hover:bg-brand-gold hover:text-white"
          >
            Update Brand
          </Button>
          <Button
            shape="rounded-sm"
            variant="outline"
            type="button"
            onClick={onClose}
            className="w-full h-10 sm:h-12 text-[11px] font-bold text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold transition-all duration-300"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Drawer>
  );
}
