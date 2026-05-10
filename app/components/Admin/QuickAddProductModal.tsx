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
import { useApiError } from "../../hooks/useApiError";

import { useGetCategoriesQuery } from "@/lib/redux/services/categoryApi";
import { Select } from "../Form";

interface QuickAddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: any;
  brand?: any;
}

export const QuickAddProductModal: React.FC<QuickAddProductModalProps> = ({
  isOpen,
  onClose,
  category,
  brand
}) => {
  const router = useRouter();
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [filterCategoryId, setFilterCategoryId] = useState<string>("");

  const target = category || brand;
  const isCategory = !!category;

  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: productsData, isLoading } = useGetProductsQuery({
    search: "",
    category: filterCategoryId || undefined
  }, { skip: !isOpen });

  const [updateProduct, { isLoading: isUpdating, isError, error }] = useUpdateProductMutation();

  useApiError(isError, error, "Failed to update products");

  const products = productsData?.data?.products || [];
  const productOptions = products.map((p: any) => {
    const brandName = p.brand?.name || (typeof p.brand === 'string' ? p.brand : "");
    const isAlreadyInTarget = isCategory
      ? (typeof p.category === 'object' ? p.category?._id === category?._id : p.category === category?._id)
      : (typeof p.brand === 'object' ? p.brand?._id === brand?._id : p.brand === brand?._id);

    return {
      value: p._id,
      label: p.name,
      subLabel: `₦${p.price?.toLocaleString()}${brandName ? ` • ${brandName}` : ' • Independent'}`,
      image: p.productImage,
      status: p.status,
      isCurrent: isAlreadyInTarget
    };
  });

  const categoriesList = categoriesData?.data && 'categories' in categoriesData.data 
    ? categoriesData.data.categories 
    : (Array.isArray(categoriesData?.data) ? categoriesData.data : []);

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categoriesList.map((cat: any) => ({
      value: cat._id,
      label: cat.name,
      image: cat.image
    }))
  ];

  const handleBulkAssign = async () => {
    if (selectedProductIds.length === 0 || !target) return;

    try {
      const updatePromises = selectedProductIds.map(productId => {
        const data = isCategory
          ? { category: category?._id }
          : { brand: brand?._id };

        return updateProduct({ productId, data }).unwrap();
      });

      await Promise.all(updatePromises);
      toast.success(`Successfully added ${selectedProductIds.length} products to ${target.name}`);
      onClose();
      setSelectedProductIds([]);
    } catch (error) {
      // Error is handled by useApiError hook
    }
  };

  const handleCreateNew = () => {
    onClose();
    const queryParam = isCategory ? `category=${encodeURIComponent(category.name)}` : `brand=${encodeURIComponent(brand.name)}`;
    router.push(`/admin/products/new?${queryParam}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Products to ${target?.name || "Library"}`}
      size="xl"
    >
      <ModalBody className="flex flex-col gap-6 py-4 min-h-[500px]">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-[8px] border border-gray-100">
          <div className="w-12 h-12 bg-white rounded-[6px] border border-gray-200 p-1 flex items-center justify-center overflow-hidden">
            {isCategory ? (
              <img src={category?.image} alt="" className="w-full h-full object-contain" />
            ) : (
              brand?.logo ? <img src={brand.logo} alt="" className="w-full h-full object-contain" /> : <Icon name="Image" folder="dashboardIcon" size="sm" className="text-gray-300" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-gray-900">{target?.name}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target {isCategory ? "Category" : "Brand"}</span>
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

        {/* Filters & Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Filter by Category</label>
            <Select
              options={categoryOptions}
              value={filterCategoryId}
              onChange={(val) => setFilterCategoryId(val as string)}
              placeholder="Select Category"
              shape="rounded-sm"
              searchable
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Select Products</label>
            <Select
              isMulti
              searchable
              options={productOptions}
              value={selectedProductIds}
              onChange={(val) => setSelectedProductIds(val as string[])}
              placeholder="Search products..."
              shape="rounded-sm"
            />
          </div>
        </div>

        {/* Selected Products Preview */}
        {selectedProductIds.length > 0 && (
          <div className="flex flex-col gap-3 mt-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Selected Products ({selectedProductIds.length})</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
              {selectedProductIds.map(id => {
                const product = products.find((p: any) => p._id === id);
                if (!product) return null;
                return (
                  <div key={id} className="flex items-center gap-3 p-2 bg-white border border-gray-100 rounded-[8px] group">
                    <div className="w-8 h-8 bg-gray-50 rounded-[4px] overflow-hidden flex-shrink-0">
                      <Image
                        src={product.productImage || "/placeholder-product.png"}
                        alt=""
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-gray-900 truncate flex-1">{product.name}</span>
                    <button
                      onClick={() => setSelectedProductIds(prev => prev.filter(p => p !== id))}
                      className="p-1 hover:bg-rose-50 text-gray-400 hover:text-rose-500 rounded-md transition-colors"
                    >
                      <Icon name="close" folder="icon" size="xs" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
