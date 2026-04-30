"use client";

import React from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import { useGetProductsQuery } from "@/lib/redux/services/productApi";
import { Icon } from "../Icon";
import Image from "next/image";
import { Button } from "../Button";
import { useRouter } from "next/navigation";

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

  const products = productsData?.data?.products || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Products by ${brand?.name || "Brand"}`}
      size="xl"
    >
      <ModalBody className="flex flex-col gap-6 py-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
        {/* Brand Header Summary */}
        <div className="flex items-center gap-5 p-5 bg-[#1D3557] rounded-2xl border border-[#1D3557]/10 shadow-lg relative overflow-hidden group">
          {/* Decorative Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />

          <div className="w-16 h-16 bg-white rounded-xl p-2 flex items-center justify-center shadow-xl border border-white/10 z-10">
            {brand?.logo ? (
              <img src={brand.logo} alt="" className="w-full h-full object-contain" />
            ) : (
              <Icon name="Image" folder="dashboardIcon" size="lg" className="text-gray-200" />
            )}
          </div>

          <div className="flex flex-col z-10">
            <h3 className="text-xl font-black text-white tracking-tight">{brand?.name}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-bold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded uppercase tracking-widest border border-brand-gold/20">
                {products.length} Items in Catalog
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Managed Inventory
              </span>
            </div>
          </div>

          <Button
            shape="rounded-sm"
            variant="outline"
            size="sm"
            className="ml-auto bg-white/5 border-white/10 text-white hover:bg-white hover:text-[#1D3557] transition-all z-10 h-9"
            onClick={() => {
              onClose();
              router.push(`/admin/products/new?brand=${encodeURIComponent(brand.name)}`);
            }}
          >
            Add New Product
          </Button>
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
                onClick={() => router.push(`/admin/products/edit/${product._id}`)}
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
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-black text-[#1D3557] truncate group-hover:text-brand-gold transition-colors">{product.name}</span>
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
    </Modal>
  );
};
