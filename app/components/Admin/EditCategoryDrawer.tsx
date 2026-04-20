"use client";

import React, { useState, useEffect } from "react";
import Drawer from "../Drawer/Drawer";
import { Input, Textarea } from "../Form/Inputs";
import { Button } from "../Button";
import { Icon } from "../Icon";

interface EditCategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  category: any;
}

export function EditCategoryDrawer({ isOpen, onClose, category }: EditCategoryDrawerProps) {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        image: category.image || "",
        description: category.description || "",
      });
    }
  }, [category]);

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
