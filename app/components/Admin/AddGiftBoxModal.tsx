"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import { Button } from "../Button/Button";
import { Input, Textarea } from "../Form/Inputs";
import { Select } from "../Form/Select";
import { HiPlus, HiMagnifyingGlass, HiCheck, HiPhoto, HiXMark } from "react-icons/hi2";
import { useCreateGiftBoxMutation, useUpdateGiftBoxMutation, GiftBox } from "@/lib/redux/services/giftBoxApi";
import { useGetProductsQuery } from "@/lib/redux/services/productApi";
import { toast } from "sonner";
import Image from "next/image";
import { MediaSelectionModal } from "./MediaSelectionModal";
import { UploadMediaModal } from "./UploadMediaModal";
import { useEffect } from "react";

interface AddGiftBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  giftBox?: GiftBox | null;
}

export function AddGiftBoxModal({ isOpen, onClose, giftBox }: AddGiftBoxModalProps) {
  const [createGiftBox, { isLoading: isCreating }] = useCreateGiftBoxMutation();
  const [updateGiftBox, { isLoading: isUpdating }] = useUpdateGiftBoxMutation();
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    image: "",
    products: [] as string[],
    status: "Active",
    tag: "Essential"
  });

  // Sync with giftBox prop for editing
  useEffect(() => {
    if (giftBox) {
      setFormData({
        name: giftBox.name,
        description: giftBox.description,
        price: giftBox.price,
        image: giftBox.image,
        products: giftBox.products?.map((p: any) => typeof p === 'string' ? p : p._id) || [],
        status: giftBox.status,
        tag: giftBox.tag || "Essential"
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        image: "",
        products: [],
        status: "Active",
        tag: "Essential"
      });
    }
  }, [giftBox, isOpen]);

  const [productSearch, setProductSearch] = useState("");
  const { data: productsRes } = useGetProductsQuery({ search: productSearch, limit: 10 });
  const allProducts = productsRes?.data?.products || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.products.length === 0) {
      toast.error("Please select at least one product for the gift box");
      return;
    }
    if (!formData.image) {
      toast.error("Please select a cover image for the gift box");
      return;
    }

    try {
      if (giftBox) {
        await updateGiftBox({ id: giftBox._id, data: formData }).unwrap();
        toast.success("Artisanal collection updated successfully");
      } else {
        await createGiftBox(formData).unwrap();
        toast.success("Artisanal gift box curated successfully");
      }
      onClose();
    } catch (error) {
      toast.error(giftBox ? "Failed to update gift box" : "Failed to create gift box");
    }
  };

  const toggleProduct = (id: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.includes(id)
        ? prev.products.filter(pid => pid !== id)
        : [...prev.products, id]
    }));
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Gift Box" size="xl">
        <ModalBody className="p-0">
          <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row h-[85vh] lg:h-[700px] overflow-hidden">
            {/* Left Column: Form Info */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 border-r border-gray-100 custom-scrollbar">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Collection Identity</label>
                  <Input
                    shape="rounded-sm"
                    placeholder="e.g. The Midnight Bloom Collection"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-gray-50/50 border-gray-100"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Curation Story</label>
                  <Textarea
                    placeholder="Describe the artisanal experience..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="bg-gray-50/50 border-gray-100 h-32"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Collection Tag</label>
                  <Select
                    shape="rounded-sm"
                    options={[
                      { value: "Best Seller", label: "Best Seller" },
                      { value: "Limited Edition", label: "Limited Edition" },
                      { value: "Essential", label: "Essential" },
                      { value: "New Arrival", label: "New Arrival" },
                      { value: "Luxury", label: "Luxury" },
                      { value: "Bespoke", label: "Bespoke" }
                    ]}
                    value={formData.tag}
                    onChange={(val) => setFormData({ ...formData, tag: val })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Set Price (₦)</label>
                    <Input
                      type="number"
                      shape="rounded-sm"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      required
                      className="bg-gray-50/50 border-gray-100 font-bold"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visibility</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="h-11 w-full bg-gray-50/50 border border-gray-100 rounded-sm px-4 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-brand-gold transition-all"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Selection */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Artisanal Pieces</label>
                  <span className="text-[10px] font-black text-brand-gold bg-brand-gold/5 px-2 py-1 rounded">
                    {formData.products.length} Selected
                  </span>
                </div>

                <div className="relative">
                  <Input
                    shape="rounded-sm"
                    placeholder="Search boutique products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="pl-11 bg-gray-50/50 border-gray-100"
                    suffixElement={<HiMagnifyingGlass size={18} className="text-gray-400" />}
                  />
                </div>

                <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {allProducts.map(product => {
                    const isSelected = formData.products.includes(product._id);
                    return (
                      <div
                        key={product._id}
                        onClick={() => toggleProduct(product._id)}
                        className={`flex items-center justify-between p-3 border rounded-[4px] cursor-pointer transition-all ${isSelected ? "border-brand-gold bg-brand-gold/5" : "border-gray-100 hover:bg-gray-50"}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 relative rounded border border-gray-100 bg-white overflow-hidden">
                            <Image src={product.productImage || "/placeholder.png"} alt={product.name} fill className="object-contain" sizes="40px" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[11px] font-black text-[#121212]">{product.name}</span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase">₦{product.price.toLocaleString()}</span>
                          </div>
                        </div>
                        {isSelected && <HiCheck size={16} className="text-brand-gold" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Visual Selection */}
            <div className="w-full lg:w-[320px] bg-gray-50 p-6 flex flex-col gap-6">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bundle Visual</label>

              <div
                onClick={() => setIsMediaModalOpen(true)}
                className="group relative aspect-square w-full bg-white rounded-xl border border-dashed border-gray-200 overflow-hidden cursor-pointer hover:border-brand-gold transition-all flex items-center justify-center  "
              >
                {formData.image ? (
                  <>
                    <Image src={formData.image} alt="Preview" fill className="object-cover" sizes="320px" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest bg-brand-gold px-4 py-2 rounded-full shadow-lg">Change Visual</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <HiPhoto size={32} className="text-gray-200" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Image</span>
                  </div>
                )}
              </div>

              <div className="mt-auto flex flex-rol justify-end gap-2 pt-6 border-t border-gray-200">
                <Button
                  shape="rounded-sm"
                  type="button"
                  onClick={onClose}
                  variant={"ghost"}
                >
                  Discard Changes
                </Button>
                <Button
                  shape="rounded-sm"
                  type="submit"
                  disabled={isCreating || isUpdating}
                >
                  {isCreating || isUpdating ? "Processing..." : giftBox ? "Update Collection" : "Finalize Bundle"}
                </Button>
              </div>
            </div>
          </form>
        </ModalBody>
      </Modal>

      <MediaSelectionModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(url) => setFormData({ ...formData, image: url })}
        title="Bundle Imagery"
        onUploadClick={() => {
          setIsMediaModalOpen(false);
          setIsUploadModalOpen(true);
        }}
      />

      <UploadMediaModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </>
  );
}
