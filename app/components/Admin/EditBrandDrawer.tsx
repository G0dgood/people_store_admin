"use client";

import React, { useState, useEffect } from "react";
import Drawer from "../Drawer/Drawer";
import { Input } from "../Form/Inputs";
import { Select } from "../Form/Select";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { useUpdateBrandMutation } from "@/lib/redux/services/brandApi";
import { useGetCategoriesQuery } from "@/lib/redux/services/categoryApi";
import { toast } from "sonner";
import { ImageUpload } from "../Form/ImageUpload";
import { FiImage } from "react-icons/fi";

interface EditBrandDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  brand: any;
}


const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

export function EditBrandDrawer({ isOpen, onClose, brand }: EditBrandDrawerProps) {
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    coverImage: "",
    category: "",
    status: "Active",
  });

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name || "",
        logo: brand.logo || "",
        coverImage: brand.coverImage || "",
        category: brand.category || "Electronics",
        status: brand.status || "Active",
      });
    }
  }, [brand]);

  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();
  const { data: categoriesData } = useGetCategoriesQuery();
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand?._id) return;

    try {
      await updateBrand({ id: brand._id, data: formData }).unwrap();
      toast.success("Brand Updated Successfully", {
        description: `Changes to ${formData.name} saved.`
      });
      onClose();
    } catch (err: any) {
      toast.error("Update Failed", {
        description: err?.data?.message || "Failed to update brand."
      });
    }
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

          <div className="grid grid-cols-1  gap-6">
            <ImageUpload
              label="Brand Logo"
              value={formData.logo}
              onChange={(url) => setFormData({ ...formData, logo: url })}
              placeholder="Click or drag to upload brand logo"
            />
            <ImageUpload
              label="Cover Picture (Optional)"
              value={formData.coverImage}
              onChange={(url) => setFormData({ ...formData, coverImage: url })}
              placeholder="Click or drag to upload cover picture"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Inventory No</label>
              <div className="h-12 bg-gray-50 border border-gray-200 rounded-sm px-4 flex items-center">
                <span className="text-xs font-black text-brand-gold uppercase tracking-wider">{brand.inventoryCount || 0} items in stock</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Category</label>
              <Select
                className="rounded-sm"
                shape="rounded-sm"
                options={categoriesData?.data?.map(cat => ({ value: cat.name, label: cat.name })) || []}
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
            isLoading={isUpdating}
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
