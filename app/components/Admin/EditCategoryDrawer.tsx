"use client";

import React, { useState, useEffect } from "react";
import Drawer from "../Drawer/Drawer";
import { Input, Textarea } from "../Form/Inputs";
import { Button } from "../Button";
import { Icon } from "../Icon";
import Checkbox from "../Checkbox";
import { motion, AnimatePresence } from "framer-motion";

interface EditCategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  category: any;
}

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const ML_OPTIONS = ["50ml", "100ml", "250ml", "500ml", "750ml", "1L"];
const SEX_OPTIONS = ["Male", "Female", "Kids", "Unisex"];

export function EditCategoryDrawer({ isOpen, onClose, category }: EditCategoryDrawerProps) {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    hasSize: false,
    hasML: false,
    hasSex: false,
    selectedSizes: [] as string[],
    selectedMLs: [] as string[],
    selectedSexes: [] as string[],
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        image: category.image || "",
        description: category.description || "",
        hasSize: category.hasSize || false,
        hasML: category.hasML || false,
        hasSex: category.hasSex || false,
        selectedSizes: category.selectedSizes || [],
        selectedMLs: category.selectedMLs || [],
        selectedSexes: category.selectedSexes || [],
      });
    }
  }, [category]);

  const toggleSelection = (field: "selectedSizes" | "selectedMLs" | "selectedSexes", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving category changes:", formData);
    onClose();
  };

  if (!category) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Edit Category">
      <form onSubmit={handleSubmit} className="flex flex-col h-full gap-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Category Name</label>
            <Input
              placeholder="e.g. Electronics"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12 border-gray-200 font-bold"
              shape="rounded-sm"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Category Image Path</label>
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
                className="w-12 h-12 p-0 flex-shrink-0"
              >
                <Icon name="photo" folder="icon" size="sm" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Description (Optional)</label>
            <Textarea
              placeholder="Provide a brief description of this category..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[150px]"
              shape="rounded-sm"
            />
          </div>

          <div className="flex flex-col gap-6 p-4 bg-gray-50/50 rounded-[6px] border border-gray-100 mt-2">
            <label className="text-[10px] font-black text-brand-gold uppercase tracking-[0.15em]">Enabled Product Attributes</label>
            
            <div className="flex flex-col gap-6">
              {/* Size Attribute */}
              <div className="flex flex-col gap-4">
                <Checkbox
                  label="Size (S, M, L...)"
                  checked={formData.hasSize}
                  onChange={(checked) => setFormData({ ...formData, hasSize: checked })}
                />
                <AnimatePresence>
                  {formData.hasSize && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-7 grid grid-cols-4 gap-2">
                        {SIZE_OPTIONS.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => toggleSelection("selectedSizes", size)}
                            className={`px-2 py-1.5 rounded-[4px] border text-[10px] font-black transition-all
                              ${formData.selectedSizes.includes(size)
                                ? "bg-brand-gold border-brand-gold text-white"
                                : "bg-white border-gray-200 text-gray-400 hover:border-brand-gold/30 hover:text-brand-gold"}
                            `}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Volume Attribute */}
              <div className="flex flex-col gap-4">
                <Checkbox
                  label="Volume (ML)"
                  checked={formData.hasML}
                  onChange={(checked) => setFormData({ ...formData, hasML: checked })}
                />
                <AnimatePresence>
                  {formData.hasML && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-7 grid grid-cols-3 gap-2">
                        {ML_OPTIONS.map((ml) => (
                          <button
                            key={ml}
                            type="button"
                            onClick={() => toggleSelection("selectedMLs", ml)}
                            className={`px-2 py-1.5 rounded-[4px] border text-[10px] font-black transition-all
                              ${formData.selectedMLs.includes(ml)
                                ? "bg-brand-gold border-brand-gold text-white"
                                : "bg-white border-gray-200 text-gray-400 hover:border-brand-gold/30 hover:text-brand-gold"}
                            `}
                          >
                            {ml}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sex Attribute */}
              <div className="flex flex-col gap-4">
                <Checkbox
                  label="Sex (Gender)"
                  checked={formData.hasSex}
                  onChange={(checked) => setFormData({ ...formData, hasSex: checked })}
                />
                <AnimatePresence>
                  {formData.hasSex && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-7 flex flex-wrap gap-2">
                        {SEX_OPTIONS.map((sex) => (
                          <button
                            key={sex}
                            type="button"
                            onClick={() => toggleSelection("selectedSexes", sex)}
                            className={`px-4 py-1.5 rounded-[4px] border text-[10px] font-black transition-all
                              ${formData.selectedSexes.includes(sex)
                                ? "bg-brand-gold border-brand-gold text-white"
                                : "bg-white border-gray-200 text-gray-400 hover:border-brand-gold/30 hover:text-brand-gold"}
                            `}
                          >
                            {sex}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-gray-50 flex flex-col gap-3">
          <Button
            shape="rounded-sm"
            variant="primary"
            type="submit"
            className="w-full h-10 sm:h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
          >
            Update Category
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
