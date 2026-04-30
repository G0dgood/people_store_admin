"use client";

import React, { useState, useEffect } from "react";
import Drawer from "../Drawer/Drawer";
import { Button } from "../Button";
import { Input } from "../Form";
import { useUpdateProductMutation, Product } from "@/lib/redux/services/productApi";
import { toast } from "sonner";
import { HiOutlineCube, HiOutlineArrowTrendingUp, HiOutlineArrowTrendingDown } from "react-icons/hi2";

interface StockAdjustmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function StockAdjustmentDrawer({ isOpen, onClose, product }: StockAdjustmentDrawerProps) {
  const [stock, setStock] = useState<number>(0);
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  useEffect(() => {
    if (product) {
      setStock(product.stock);
    }
  }, [product]);

  const handleAdjust = async (amount: number) => {
    setStock(prev => Math.max(0, prev + amount));
  };

  const handleSave = async () => {
    if (!product) return;
    try {
      await updateProduct({
        productId: product._id,
        data: {
          stock,
          stockStatus: stock > 0 ? "In Stock" : "Out of Stock"
        }
      }).unwrap();
      toast.success("Stock updated successfully");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update stock");
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Adjust Inventory" width="max-w-sm">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-white">
            <img src={product?.productImage} alt="" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-[#1D3557]">{product?.name}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SKU: {product?._id.slice(-6)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Quantity in Stock</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleAdjust(-1)}
              className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all"
            >
              <HiOutlineArrowTrendingDown className="text-xl" />
            </button>
            <Input
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="text-center text-2xl font-black h-12"
              shape="rounded-sm"
            />
            <button
              onClick={() => handleAdjust(1)}
              className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-emerald-50 hover:text-emerald-500 hover:border-emerald-100 transition-all"
            >
              <HiOutlineArrowTrendingUp className="text-xl" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Status</span>
            <span className={`text-xs font-black ${stock > 0 ? "text-emerald-500" : "text-rose-500"}`}>
              {stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Value</span>
            <span className="text-xs font-black text-brand-gold">
              ₦{(stock * (product?.price || 0)).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-gray-100">
          <Button shape="rounded-sm" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button shape="rounded-sm" variant="primary" className="flex-1" onClick={handleSave} isLoading={isLoading}>
            Update Stock
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
