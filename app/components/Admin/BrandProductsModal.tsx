"use client";

import React from "react";
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
import { useState } from "react";

interface BrandProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: any;
}

export const BrandProductsModal: React.FC<BrandProductsModalProps> = ({
  isOpen,
  onClose,
  brand
}) => {
  const router = useRouter();

  // Fetch products filtered by this brand
  const { data: productsData, isLoading } = useGetProductsQuery({
    brand: brand?._id,
    limit: 100
  }, { skip: !brand?._id || !isOpen });

  const [isRemoveConfirmOpen, setIsRemoveConfirmOpen] = useState(false);
  const [productToRemove, setProductToRemove] = useState<any>(null);

  const [updateProduct, { isLoading: isUpdating, isError, error }] = useUpdateProductMutation();
  useApiError(isError, error, "Failed to remove product from brand");

  const products = productsData?.data?.products || [];

  const handleRemoveInitiate = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    setProductToRemove(product);
    setIsRemoveConfirmOpen(true);
  };

  const handleRemoveConfirm = async () => {
    if (!productToRemove) return;
    try {
      await updateProduct({ 
        productId: productToRemove._id, 
        data: { brand: null } as any 
      }).unwrap();
      toast.success(`Removed ${productToRemove.name} from ${brand?.name}`);
      setIsRemoveConfirmOpen(false);
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Products by ${brand?.name || "Brand"}`}
      size="xl"
    >
      <ModalBody className="flex flex-col gap-6 py-6">
        {/* Brand Header Summary */}
        <div className="relative p-5 rounded-2xl border border-gray-100 shadow-lg overflow-hidden group min-h-[120px] flex items-center">
          {/* Cover Image/Video Background */}
          {brand?.coverImage ? (
            <div className="absolute inset-0 z-0">
              {brand.coverImage.match(/\.(mp4|webm|ogg)$/i) ? (
                <video 
                  src={brand.coverImage} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <img 
                  src={brand.coverImage} 
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
              {brand?.logo ? (
                <img src={brand.logo} alt="" className="w-full h-full object-contain" />
              ) : (
                <Icon name="Image" folder="dashboardIcon" size="lg" className="text-gray-200" />
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <h3 className="text-xl font-black text-white tracking-tight truncate">{brand?.name}</h3>
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
                router.push(`/products/new?brand=${encodeURIComponent(brand.name)}`);
              }}
            >
              Add Product
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-xl border border-gray-100" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
              <Icon name="fluent-mdl2_product-list" folder="dashboardIcon" size="xl" className="text-gray-300" />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No products found for this brand</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product: any) => (
              <div
                key={product._id}
                className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-xl hover:border-brand-gold/30 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => router.push(`/products/edit/${product._id}`)}
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
                      disabled={isUpdating}
                      onClick={(e) => handleRemoveInitiate(e, product)}
                      className="p-1 hover:bg-rose-50 text-gray-300 hover:text-rose-500 rounded-md transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                      title="Remove from brand"
                    >
                      <Icon name="close" folder="icon" size="xs" />
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
      </ModalBody>

      <ConfirmationModal
        isOpen={isRemoveConfirmOpen}
        onClose={() => setIsRemoveConfirmOpen(false)}
        onConfirm={handleRemoveConfirm}
        title="Remove Product from Brand"
        message={`Are you sure you want to remove "${productToRemove?.name}" from ${brand?.name}? This will dissociate the product but will NOT delete it from the library.`}
        confirmText="Yes, remove from brand"
        type="danger"
        isLoading={isUpdating}
      />
    </Modal>
  );
};
