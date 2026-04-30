"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import ModalFooter from "../Modal/ModalFooter";
import { Input } from "../Form/Inputs";
import { Select } from "../Form/Select";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { useCreateBrandMutation } from "@/lib/redux/services/brandApi";
import { useGetCategoriesQuery } from "@/lib/redux/services/categoryApi";
import { toast } from "sonner";
import { ImageUpload } from "../Form/ImageUpload";

interface AddBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
}


const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

export function AddBrandModal({ isOpen, onClose }: AddBrandModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    coverImage: "",
    category: "Electronics",
    status: "Active",
  });

  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
  const { data: categoriesData } = useGetCategoriesQuery();
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBrand(formData).unwrap();
      toast.success("Brand Created Successfully", {
        description: `${formData.name} has been added to the library.`
      });
      // Reset form
      setFormData({
        name: "",
        logo: "",
        coverImage: "",
        category: "Electronics",
        status: "Active",
      });
      onClose();
    } catch (err: any) {
      toast.error("Failed to Create Brand", {
        description: err?.data?.message || "Something went wrong."
      });
    }
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
              shape="rounded-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Category</label>
              <Select
                options={categoriesData?.data?.map(cat => ({ value: cat.name, label: cat.name })) || []}
                value={formData.category}
                onChange={(val) => setFormData({ ...formData, category: val })}
                shape="rounded-sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Initial Status</label>
              <Select
                options={statusOptions}
                value={formData.status}
                onChange={(val) => setFormData({ ...formData, status: val })}
                shape="rounded-sm"
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
            isLoading={isCreating}
          >
            Create Brand
          </Button>
        </ModalFooter>
      </form>

    </Modal>
  );
}
