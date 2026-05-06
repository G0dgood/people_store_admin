"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { Input } from "../Form";
import { Product, useUpdateProductMutation } from "@/lib/redux/services/productApi";
import { toast } from "sonner";

interface UpdateStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const UpdateStockModal: React.FC<UpdateStockModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [stock, setStock] = useState<number>(0);
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  useEffect(() => {
    if (product) {
      setStock(product.stock);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleUpdate = async () => {
    try {
      await updateProduct({
        productId: product._id,
        data: {
          stock,
          stockStatus: stock === 0 ? "Out of Stock" : stock < 10 ? "Low Stock" : "In Stock"
        }
      }).unwrap();

      toast.success("Stock Updated", {
        description: `${product.name} stock is now ${stock} units.`
      });
      onClose();
    } catch (err) {
      toast.error("Update Failed", {
        description: "Something went wrong while updating the stock level."
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-md rounded-[12px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
              <Icon name="fluent_box-edit-24-regular" folder="dashboardIcon" size="md" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-charcoal">Update Stock</h3>
              <p className="text-xs text-gray-400 font-medium">Quick inventory adjustment</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-brand-charcoal transition-colors">
            <Icon name="menu-close" folder="dashboardIcon" size="md" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-[8px] border border-gray-200">
            <div className="w-12 h-12 rounded-[4px] border border-gray-200 overflow-hidden bg-white  ">
              <img src={product.productImage} alt={product.name} className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-brand-charcoal truncate">{product.name}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current: {product.stock} Units</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">New Stock Level</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStock(Math.max(0, stock - 1))}
                className="w-12 h-12 rounded-[8px] border border-gray-200 flex items-center justify-center hover:bg-brand-charcoal hover:text-white hover:border-brand-charcoal transition-all text-xl font-light"
              >
                −
              </button>
              <Input
                type="number"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                className="text-center text-xl font-black text-brand-gold h-12"
                containerClassName="flex-1"
                min="0"
              />
              <button
                onClick={() => setStock(stock + 1)}
                className="w-12 h-12 rounded-[8px] border border-gray-200 flex items-center justify-center hover:bg-brand-charcoal hover:text-white hover:border-brand-charcoal transition-all text-xl font-light"
              >
                +
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 px-1 text-center">
              Increasing or decreasing stock affects the storefront availability instantly.
            </p>
          </div>
        </div>

        <div className="p-6 bg-gray-50 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            shape="rounded-sm"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdate}
            isLoading={isLoading}
            className="flex-1 shadow-lg shadow-brand-gold/10"
            shape="rounded-sm"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
