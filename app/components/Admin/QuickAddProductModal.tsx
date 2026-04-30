"use client";

import React, { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import ModalFooter from "../Modal/ModalFooter";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { Icon } from "../Icon";
import { useGetProductsQuery, useUpdateProductMutation } from "@/lib/redux/services/productApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Checkbox from "../../components/Checkbox";

interface QuickAddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: any;
}

export const QuickAddProductModal: React.FC<QuickAddProductModalProps> = ({
  isOpen,
  onClose,
  category
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // We fetch products to assign them to this category
  // In a real app, you might want to fetch products NOT in this category
  const { data: productsData, isLoading } = useGetProductsQuery({ search: searchQuery });
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const products = productsData?.data?.products || [];

  const handleToggleProduct = (id: string) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleBulkAssign = async () => {
    if (selectedProductIds.length === 0) return;

    try {
      // For each product, update its category
      // In a robust API, we'd have a bulk update endpoint
      const updatePromises = selectedProductIds.map(productId => {
        const formData = new FormData();
        formData.append("category", category.name);
        return updateProduct({ productId, data: formData as any }).unwrap();
      });

      await Promise.all(updatePromises);
      toast.success(`Successfully added ${selectedProductIds.length} products to ${category.name}`);
      onClose();
      setSelectedProductIds([]);
    } catch (error) {
      toast.error("Failed to update some products");
    }
  };

  const handleCreateNew = () => {
    onClose();
    router.push(`/admin/products/new?category=${encodeURIComponent(category.name)}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Products to ${category?.name || "Category"}`}
      size="xl"
    >
      <ModalBody className="flex flex-col gap-6 py-4">
        {/* Category Header */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-[8px] border border-gray-100">
          <div className="w-12 h-12 bg-white rounded-[6px] border border-gray-200 p-1">
            <img src={category?.image} alt="" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-gray-900">{category?.name}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target Category</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-brand-gold hover:bg-brand-gold/5"
            onClick={handleCreateNew}
          >
            Create New Product
          </Button>
        </div>

        {/* Search */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Search Catalog</label>
          <Input
            shape="rounded-sm"
            placeholder="Search by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border-gray-200"
            suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
          />
        </div>

        {/* Product List */}
        <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-[8px]" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-10 text-center flex flex-col items-center gap-3">
              <Icon name="fluent-mdl2_product-list" folder="dashboardIcon" size="lg" className="text-gray-200" />
              <p className="text-sm font-bold text-gray-300">No products found matching your search</p>
            </div>
          ) : (
            products.map((product: any) => (
              <div
                key={product._id}
                className={`flex items-center gap-3 p-3 rounded-[8px] border transition-all cursor-pointer group ${selectedProductIds.includes(product._id)
                    ? "bg-brand-gold/5 border-brand-gold/20"
                    : "bg-white border-gray-100 hover:border-brand-gold/30 hover:shadow-sm"
                  }`}
                onClick={() => handleToggleProduct(product._id)}
              >
                <Checkbox
                  checked={selectedProductIds.includes(product._id)}
                  onChange={() => handleToggleProduct(product._id)}
                />
                <div className="w-10 h-10 bg-gray-50 rounded-[4px] border border-gray-100 overflow-hidden flex-shrink-0">
                  <Image
                    src={product.productImage || "/placeholder-product.png"}
                    alt=""
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-bold text-gray-900 truncate">{product.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">Current:</span>
                    <span className="text-[10px] font-bold text-brand-gold bg-brand-gold/5 px-1.5 rounded truncate max-w-[100px]">
                      {typeof product.category === 'object' ? product.category?.name : product.category || "Uncategorized"}
                    </span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-xs font-black text-gray-900">₦{product.price?.toLocaleString()}</span>
                  <span className={`text-[9px] font-bold uppercase ${product.stock > 0 ? "text-emerald-500" : "text-rose-500"}`}>
                    {product.stock > 0 ? `${product.stock} In Stock` : "Out of Stock"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </ModalBody>
      <ModalFooter className="flex justify-between items-center py-6 bg-gray-50/50">
        <span className="text-xs font-bold text-gray-400">
          {selectedProductIds.length} products selected
        </span>
        <div className="flex gap-3">
          <Button
            shape="rounded-sm"
            variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            shape="rounded-sm"
            variant="primary"
            onClick={handleBulkAssign}
            disabled={selectedProductIds.length === 0 || isUpdating}
            isLoading={isUpdating}
          >
            Add Selected Products
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};
