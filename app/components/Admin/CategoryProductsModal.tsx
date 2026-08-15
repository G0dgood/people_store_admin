"use client";

import React, { useState, useMemo, useEffect } from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import { useGetProductsQuery, useUpdateProductMutation } from "@/lib/redux/services/productApi";
import { Icon } from "../Icon";
import Image from "next/image";
import { Button } from "../Button";
import { useApiError } from "@/app/hooks/useApiError";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ConfirmationModal } from "../Admin/ConfirmationModal";
import { ViewProductModal } from "./ViewProductModal";
import { Select } from "../Form/Select";
import { ProductGridSkeleton } from "./ProductGridSkeleton";

interface CategoryProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: any;
}

export const CategoryProductsModal: React.FC<CategoryProductsModalProps> = ({
  isOpen,
  onClose,
  category
}) => {
  const router = useRouter();
  const [isRemoveConfirmOpen, setIsRemoveConfirmOpen] = useState(false);
  const [productToRemove, setProductToRemove] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Fetch products filtered by this category
  const { data: productsData, isLoading } = useGetProductsQuery({
    category: category?._id,
    limit: 100
  }, { skip: !category?._id || !isOpen });

  const [updateProduct, { isLoading: isUpdating, isError, error }] = useUpdateProductMutation();
  useApiError(isError, error, "Failed to update product category");

  const products = productsData?.data?.products || [];

  const [activeBrandTab, setActiveBrandTab] = useState("All Brands");

  useEffect(() => {
    if (!isOpen) {
      setActiveBrandTab("All Brands");
    }
  }, [isOpen]);

  const brands = useMemo(() => {
    const uniqueBrands = new Set(products.map((p: any) => p.brand?.name || p.brand).filter(Boolean));
    return ["All Brands", ...Array.from(uniqueBrands).sort() as string[]];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeBrandTab === "All Brands") return products;
    return products.filter((p: any) => (p.brand?.name || p.brand) === activeBrandTab);
  }, [products, activeBrandTab]);

  const brandOptions = useMemo(() => {
    return brands.map(b => ({ value: b, label: b }));
  }, [brands]);

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const handleRemoveInitiate = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    setProductToRemove(product);
    setIsRemoveConfirmOpen(true);
  };

  const handleRemoveConfirm = async () => {
    // Note: Category is required in the backend model. 
    // "Removing" here would typically mean moving to an 'Uncategorized' category 
    // or just showing the user they need to edit the product to change its category.
    // For now, we'll suggest editing as a safety measure since we don't have a default category ID.
    toast.info("Products must belong to a category. Please edit the product to change its category.");
    setIsRemoveConfirmOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Products in ${category?.name || "Category"}`}
      size="2xl"
    >
      <div className="flex flex-col gap-8 min-h-[600px]">
        {/* Category Header Summary */}
        <div className="relative p-5 rounded-2xl border border-gray-100 shadow-lg overflow-hidden group min-h-[120px] flex items-center">
          {/* Cover Image/Video Background */}
          {category?.coverImage ? (
            <div className="absolute inset-0 z-0">
              {category.coverImage.match(/\.(mp4|webm|ogg)$/i) ? (
                <video
                  src={category.coverImage}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <img
                  src={category.coverImage}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/80 to-transparent" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-[#121212] z-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            </div>
          )}

          <div className="relative z-10 flex items-center gap-5 w-full">
            <div className="w-16 h-16 bg-white rounded-xl p-2 flex items-center justify-center shadow-xl border border-white/10 flex-shrink-0">
              {category?.image ? (
                <img src={category.image} alt="" className="w-full h-full object-contain" />
              ) : (
                <Icon name="Image" folder="dashboardIcon" size="lg" className="text-gray-200" />
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <h3 className="text-xl font-black text-white tracking-tight truncate">{category?.name}</h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] font-bold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded uppercase tracking-widest border border-brand-gold/20 flex-shrink-0">
                  {products.length} Items
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">
                  Managed Catalog
                </span>
              </div>
            </div>

            <Button
              shape="rounded-sm"
              variant="outline"
              size="sm"
              className="ml-auto bg-white/5 border-white/10 text-white hover:bg-white hover:text-[#121212] transition-all h-9 flex-shrink-0"
              onClick={() => {
                onClose();
                router.push(`/products/new?category=${encodeURIComponent(category.name)}`);
              }}
            >
              Add Product
            </Button>
          </div>
        </div>

        {/* Brand Filter */}
        {!isLoading && products.length > 0 && brands.length > 2 && (
          <div className="flex items-center gap-3 w-full max-w-xs">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">Filter by Brand:</span>
            <Select
              options={brandOptions}
              value={activeBrandTab}
              onChange={(val) => setActiveBrandTab(val as string)}
              placeholder="Select Brand"
              className="flex-1"
              shape="rounded-sm"
            />
          </div>
        )}

        {/* Product Grid */}
        {isLoading ? (
          <ProductGridSkeleton />
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
              <Icon name="fluent-mdl2_product-list" folder="dashboardIcon" size="xl" className="text-gray-300" />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              {activeBrandTab === "All Brands" ? "No products in this category" : `No products for ${activeBrandTab} in this category`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product: any) => (
              <div
                key={product._id}
                className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-xl hover:border-brand-gold/30 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => handleViewProduct(product)}
              >
                <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-50">
                  <Image
                    src={product.productImage || "/placeholder-product.png"}
                    alt=""
                    width={64}
                    height={64}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-black text-[#121212] truncate group-hover:text-brand-gold transition-colors">{product.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/products/edit/${product._id}`);
                      }}
                      className="p-1 hover:bg-brand-gold/5 text-gray-300 hover:text-brand-gold rounded-md transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                      title="Edit product"
                    >
                      <Icon name="settings" folder="dashboardIcon" size="xs" />
                    </button>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 mt-0.5 tracking-tighter">SKU: {product.sku || "N/A"}</span>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs font-black text-gray-900">₦{product.price?.toLocaleString()}</span>
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${product.stock > 10 ? "text-emerald-500 bg-emerald-50" : "text-rose-500 bg-rose-50"}`}>
                      {product.stock} left
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isRemoveConfirmOpen}
        onClose={() => setIsRemoveConfirmOpen(false)}
        onConfirm={handleRemoveConfirm}
        title="Change Product Category"
        message={`Products must belong to at least one category. Would you like to edit "${productToRemove?.name}" to change its category?`}
        confirmText="Edit Product"
        type="info"
      />
      <ViewProductModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        product={selectedProduct}
      />
    </Modal>
  );
};
