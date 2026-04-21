"use client";

import React, { useState, useEffect } from "react";
import Drawer from "../Drawer/Drawer";
import { Input } from "../Form/Inputs";
import { Select } from "../Form/Select";
import { Button } from "../Button";
import { Icon } from "../Icon";

import { useUpdateProductMutation, Product } from "@/lib/redux/services/productApi";
import { toast } from "sonner";

interface EditProductDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const statusOptions = [
  { value: "Published", label: "Published" },
  { value: "Draft", label: "Draft" },
];

export function EditProductDrawer({ isOpen, onClose, product }: EditProductDrawerProps) {
  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const [formData, setFormData] = useState<{
    price: number;
    stock: number;
    status: "Published" | "Draft";
  }>({
    price: 0,
    stock: 0,
    status: "Published",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        price: product.price,
        stock: product.stock,
        status: product.status || "Published",
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      await updateProduct({
        productId: product._id,
        data: formData
      }).unwrap();
      toast.success("Product updated successfully");
      onClose();
    } catch (err) {
      toast.error("Failed to update product");
    }
  };

  if (!product) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Quick Edit Product">
      <form onSubmit={handleSubmit} className="flex flex-col h-full gap-8">
        <div className="flex flex-col gap-6">
          {/* Header Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 p-1">
              <img src={product.productImage} alt="" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-black text-[#1D3557] truncate max-w-[200px]">{product.name}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {product._id.slice(-6)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Price (₦)</label>
            <Input
              shape="rounded-sm"
              type="number"
              placeholder="e.g. 25000"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className="h-12 border-gray-200 font-bold"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Stock Units</label>
            <Input
              shape="rounded-sm"
              type="number"
              placeholder="e.g. 50"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              className="h-12 border-gray-200 font-bold"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Status</label>
            <Select
              shape="rounded-sm"
              options={statusOptions}
              value={formData.status}
              onChange={(val) => setFormData({ ...formData, status: val as "Published" | "Draft" })}
            />
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-gray-50 flex flex-col gap-3">
          <Button
            shape="rounded-sm"
            variant="primary"
            type="submit"
            className="w-full h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
          >
            Update Catalog
          </Button>
          <Button
            shape="rounded-sm"
            variant="ghost"
            type="button"
            onClick={onClose}
            className="w-full h-12 text-[11px] font-bold text-gray-400 hover:text-gray-900"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Drawer>
  );
}
