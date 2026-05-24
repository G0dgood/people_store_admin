"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import ModalFooter from "../Modal/ModalFooter";
import { Input, Textarea } from "../Form/Inputs";
import { Button } from "../Button";
import { Icon } from "../Icon";
import Checkbox from "../Checkbox";
import { motion, AnimatePresence } from "framer-motion";

import { toast } from "sonner";
import { MediaSelectionModal } from "./MediaSelectionModal";
import { Select } from "../Form/Select";
import { useApiError } from "@/app/hooks/useApiError";
import { useCreateCategoryMutation, useGetCategoriesQuery } from "@/lib/redux/services/categoryApi";
import { useGetAttributesQuery } from "@/lib/redux/services/attributeApi";
import { HiXMark } from "react-icons/hi2";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const ML_OPTIONS = ["50ml", "100ml", "250ml", "500ml", "750ml", "1L"];
const SEX_OPTIONS = ["Male", "Female", "Kids", "Unisex"];

const PERFUME_GENDERS = ["Women's Perfume", "Men's Perfume", "Unisex"];
const SCENT_FAMILIES = ["Floral", "Woody", "Oriental", "Fresh", "Citrus", "Spicy"];
const COLLECTIONS = ["Best Sellers", "New Arrivals", "Niche Perfumes", "Designer Classics"];
const GIFTINGS = ["Perfume Gift Sets", "Travel Size", "Discovery Sets"];

export function AddCategoryModal({ isOpen, onClose }: AddCategoryModalProps) {
  const [createCategory, { isLoading, isError, error }] = useCreateCategoryMutation();
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: attributesResponse } = useGetAttributesQuery();
  const globalAttributes = attributesResponse?.data || [];
  const categories = categoriesData?.data && 'categories' in categoriesData.data
    ? categoriesData?.data?.categories
    : (Array.isArray(categoriesData?.data) ? categoriesData.data : []);

  useApiError(isError, error, "Failed to create category");
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<"image" | "coverImage">("image");
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    hasSize: false,
    hasML: false,
    hasSex: false,
    hasScentFamily: false,
    hasGender: false,
    hasCollection: false,
    hasGifting: false,
    selectedSizes: [] as string[],
    selectedMLs: [] as string[],
    selectedSexes: [] as string[],
    selectedScentFamilies: [] as string[],
    selectedGenders: [] as string[],
    selectedCollections: [] as string[],
    selectedGiftings: [] as string[],
    parent: "" as string,
    subCategories: [] as string[],
    coverImage: "",
    customAttributes: [] as { name: string; subAttributes: string[] }[],
  });

  const toggleSelection = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item: string) => item !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategory(formData).unwrap();
      toast.success("Category created successfully");
      setFormData({
        name: "",
        image: "",
        description: "",
        hasSize: false,
        hasML: false,
        hasSex: false,
        hasScentFamily: false,
        hasGender: false,
        hasCollection: false,
        hasGifting: false,
        selectedSizes: [],
        selectedMLs: [],
        selectedSexes: [],
        selectedScentFamilies: [],
        selectedGenders: [],
        selectedCollections: [],
        selectedGiftings: [],
        parent: "",
        subCategories: [],
        coverImage: "",
        customAttributes: [],
      });
      onClose();
    } catch (error) {
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Category" size="lg">
      <form onSubmit={handleSubmit}>
        <ModalBody className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Category Name</label>
            <Input
              placeholder="e.g. Perfume Brand"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12 border-gray-200 font-bold"
              shape="rounded-sm"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Parent Category (Optional)</label>
            <Select
              placeholder="Select parent category"
              value={formData.parent}
              onChange={(val) => setFormData({ ...formData, parent: val as string })}
              options={[
                { label: "", value: "" },
                ...categories.map((c: any) => ({ label: c.name.toUpperCase(), value: c._id }))
              ]}
              shape="rounded-sm"
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Sub Categories (Optional)</label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-brand-gold h-7 text-[10px] font-black hover:bg-brand-gold/5"
                onClick={() => setFormData(prev => ({ ...prev, subCategories: [...prev.subCategories, ""] }))}
              >
                + ADD SUB CATEGORY
              </Button>
            </div>
            <div className="flex flex-col gap-3">
              {formData.subCategories.map((sub, index) => (
                <div key={index} className="flex gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <Input
                    placeholder="e.g. New Arrivals"
                    value={sub}
                    onChange={(e) => {
                      const newSubs = [...formData.subCategories];
                      newSubs[index] = e.target.value;
                      setFormData({ ...formData, subCategories: newSubs });
                    }}
                    className="h-11 border-gray-100 font-bold flex-1 bg-gray-50/30"
                    shape="rounded-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    shape="rounded-sm"
                    className="w-11 h-11 p-0 text-gray-300 hover:text-rose-500 hover:border-rose-500 transition-all border-gray-100"
                    onClick={() => {
                      const newSubs = formData.subCategories.filter((_, i) => i !== index);
                      setFormData({ ...formData, subCategories: newSubs });
                    }}
                  >
                    <Icon name="Delete" folder="dashboardIcon" size="sm" />
                  </Button>
                </div>
              ))}
              {formData.subCategories.length === 0 && (
                <div className="py-4 border-2 border-dashed border-gray-100 rounded-[6px] flex flex-col items-center justify-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer group"
                  onClick={() => setFormData(prev => ({ ...prev, subCategories: [""] }))}>
                  <Icon name="circle-plus" folder="dashboardIcon" size="sm" className="text-gray-300 group-hover:text-brand-gold" />
                  <span className="text-[10px] font-bold text-gray-400 group-hover:text-brand-gold">No subcategories added yet. Click to add one.</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Category Image Path</label>
            <div className="flex gap-4">
              <Input
                placeholder="/dashboardImage/example.png"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="h-12 border-gray-200 font-bold flex-1"
                shape="rounded-sm"
                required
              />
              <Button
                type="button"
                variant="outline"
                shape="rounded-sm"
                className="w-12 h-12 p-0 flex-shrink-0 hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-all"
                onClick={() => {
                  setMediaTarget("image");
                  setIsMediaModalOpen(true);
                }}
              >
                <Icon name="photo" folder="icon" size="sm" />
              </Button>
            </div>
            <p className="text-[10px] font-medium text-gray-400">Provide a path to an image in the public directory.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Cover Picture (Optional)</label>
            <div className="flex gap-4">
              <Input
                placeholder="Path to cover image"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                className="h-12 border-gray-200 font-bold flex-1"
                shape="rounded-sm"
              />
              <Button
                type="button"
                variant="outline"
                shape="rounded-sm"
                className="w-12 h-12 p-0 flex-shrink-0 hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-all border-gray-200"
                onClick={() => {
                  setMediaTarget("coverImage");
                  setIsMediaModalOpen(true);
                }}
              >
                <Icon name="photo" folder="icon" size="sm" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Description (Optional)</label>
            <Textarea
              placeholder="Brief description of this category..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[100px]"
              shape="rounded-sm"
            />
          </div>

          <div className="flex flex-col gap-6 p-4 bg-gray-50/50 rounded-[6px] border border-gray-200">
            <label className="text-[9px] sm:text-[10px] font-black text-brand-gold uppercase tracking-[0.15em]">Enabled Product Attributes</label>

            <div className="flex flex-col gap-6">
              {/* Scent Family Attribute */}
              <div className="flex flex-col gap-4">
                <Checkbox
                  label="SHOP BY SCENT FAMILY"
                  checked={formData.hasScentFamily}
                  onChange={(checked) => setFormData({ ...formData, hasScentFamily: checked })}
                />
                <AnimatePresence>
                  {formData.hasScentFamily && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pl-7 grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {SCENT_FAMILIES.map((item) => (
                          <button key={item} type="button" onClick={() => toggleSelection("selectedScentFamilies", item)} className={`px-2 py-1.5 rounded-[4px] border text-[10px] font-black transition-all ${formData.selectedScentFamilies.includes(item) ? "bg-brand-gold border-brand-gold text-white" : "bg-white border-gray-200 text-gray-400"}`}>
                            {item}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Gender Attribute */}
              <div className="flex flex-col gap-4">
                <Checkbox
                  label="SHOP BY GENDER"
                  checked={formData.hasGender}
                  onChange={(checked) => setFormData({ ...formData, hasGender: checked })}
                />
                <AnimatePresence>
                  {formData.hasGender && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pl-7 flex gap-2">
                        {PERFUME_GENDERS.map((item) => (
                          <button key={item} type="button" onClick={() => toggleSelection("selectedGenders", item)} className={`px-4 py-1.5 rounded-[4px] border text-[10px] font-black transition-all ${formData.selectedGenders.includes(item) ? "bg-brand-gold border-brand-gold text-white" : "bg-white border-gray-200 text-gray-400"}`}>
                            {item}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Collections Attribute */}
              <div className="flex flex-col gap-4">
                <Checkbox
                  label="COLLECTIONS"
                  checked={formData.hasCollection}
                  onChange={(checked) => setFormData({ ...formData, hasCollection: checked })}
                />
                <AnimatePresence>
                  {formData.hasCollection && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pl-7 grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {COLLECTIONS.map((item) => (
                          <button key={item} type="button" onClick={() => toggleSelection("selectedCollections", item)} className={`px-2 py-1.5 rounded-[4px] border text-[10px] font-black transition-all ${formData.selectedCollections.includes(item) ? "bg-brand-gold border-brand-gold text-white" : "bg-white border-gray-200 text-gray-400"}`}>
                            {item}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Gifting Attribute */}
              <div className="flex flex-col gap-4">
                <Checkbox
                  label="GIFTING"
                  checked={formData.hasGifting}
                  onChange={(checked) => setFormData({ ...formData, hasGifting: checked })}
                />
                <AnimatePresence>
                  {formData.hasGifting && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pl-7 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {GIFTINGS.map((item) => (
                          <button key={item} type="button" onClick={() => toggleSelection("selectedGiftings", item)} className={`px-2 py-1.5 rounded-[4px] border text-[10px] font-black transition-all ${formData.selectedGiftings.includes(item) ? "bg-brand-gold border-brand-gold text-white" : "bg-white border-gray-200 text-gray-400"}`}>
                            {item}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Original Attributes */}
              <div className="flex flex-col gap-4">
                <Checkbox
                  label="Size (S, M, L...)"
                  checked={formData.hasSize}
                  onChange={(checked) => setFormData({ ...formData, hasSize: checked })}
                />
              </div>

              <div className="flex flex-col gap-4">
                <Checkbox
                  label="Volume (ML)"
                  checked={formData.hasML}
                  onChange={(checked) => setFormData({ ...formData, hasML: checked })}
                />
              </div>

              <div className="flex flex-col gap-4">
                <Checkbox
                  label="Sex (Gender)"
                  checked={formData.hasSex}
                  onChange={(checked) => setFormData({ ...formData, hasSex: checked })}
                />
              </div>
            </div>
          </div>

          {/* Custom Product Attributes Section */}
          <div className="flex flex-col gap-6 p-4 bg-gray-50/50 rounded-[6px] border border-gray-200">
            <label className="text-[9px] sm:text-[10px] font-black text-brand-gold uppercase tracking-[0.15em]">Enabled Custom Attributes</label>

            <div className="flex flex-col gap-6">
              {globalAttributes.map((attr: any) => {
                const isEnabled = formData.customAttributes.some((a) => a.name === attr.name);
                const selectedAttr = formData.customAttributes.find((a) => a.name === attr.name);

                return (
                  <div key={attr._id} className="flex flex-col gap-4 border-b border-gray-100/50 pb-4 last:border-b-0 last:pb-0">
                    <Checkbox
                      label={attr.name.toUpperCase()}
                      checked={isEnabled}
                      onChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            customAttributes: [...formData.customAttributes, { name: attr.name, subAttributes: [...attr.subAttributes] }]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            customAttributes: formData.customAttributes.filter((a) => a.name !== attr.name)
                          });
                        }
                      }}
                    />
                    <AnimatePresence>
                      {isEnabled && selectedAttr && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="pl-8 flex flex-wrap gap-2">
                            {attr.subAttributes.map((sub: string) => {
                              const isSubSelected = selectedAttr.subAttributes.includes(sub);
                              return (
                                <button
                                  key={sub}
                                  type="button"
                                  onClick={() => {
                                    const updatedSubs = isSubSelected
                                      ? selectedAttr.subAttributes.filter((item) => item !== sub)
                                      : [...selectedAttr.subAttributes, sub];
                                    const updatedAttrs = formData.customAttributes.map((a) =>
                                      a.name === attr.name ? { ...a, subAttributes: updatedSubs } : a
                                    );
                                    setFormData({ ...formData, customAttributes: updatedAttrs });
                                  }}
                                  className={`px-3 py-1.5 rounded-lg border text-[10px] font-black transition-all ${isSubSelected ? "bg-brand-gold border-brand-gold text-white shadow-md shadow-amber-100" : "bg-white border-gray-200 text-gray-400 hover:border-brand-gold/30 hover:text-brand-gold"}`}
                                >
                                  {sub}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              {globalAttributes.length === 0 && (
                <div className="py-6 flex flex-col items-center justify-center text-center gap-2">
                  <span className="text-[10px] text-gray-400 font-bold italic">No custom attributes created yet.</span>
                  <p className="text-[9px] text-gray-400">Use the 'Product Attributes' button on Categories page to create attributes.</p>
                </div>
              )}
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end gap-3 border-t border-gray-50 pt-6">
          <Button variant="outline" type="button" onClick={onClose} shape="rounded-sm">
            Cancel
          </Button>
          <Button variant="primary" type="submit" shape="rounded-sm" isLoading={isLoading}>
            Create Category
          </Button>
        </ModalFooter>
      </form>

      <MediaSelectionModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(url) => setFormData({ ...formData, [mediaTarget]: url })}
      />
    </Modal>
  );
}
