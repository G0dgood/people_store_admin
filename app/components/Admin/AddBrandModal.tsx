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
import { MediaSelectionModal } from "./MediaSelectionModal";
import { UploadCouponAssetModal } from "./UploadCouponAssetModal";

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

          <div className="flex flex-col gap-2">
            <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Brand Logo</label>
            {formData.logo ? (
              <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-200 group">
                <img src={formData.logo} alt="Brand Preview" className="w-full h-full object-contain p-4 bg-gray-50" />
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
                    onClick={() => setFormData({ ...formData, logo: "" })}
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
                  <Icon name="photo" folder="icon" size="sm" className="text-gray-400" />
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-brand-gold">Select Brand Logo</span>
              </button>
            )}
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

      <MediaSelectionModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(url) => setFormData({ ...formData, logo: url })}
        title="Select Brand Logo"
        onUploadClick={() => setIsUploadModalOpen(true)}
      />

      <UploadCouponAssetModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </Modal>
  );
}
