"use client";

import React from "react";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import { Product } from "@/lib/redux/services/productApi";
import { Icon } from "../Icon";
import Image from "next/image";
import { Button } from "../Button";
import { useRouter } from "next/navigation";
import { useGetProductByIdQuery } from "@/lib/redux/services/productApi";

interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function ViewProductModal({ isOpen, onClose, product }: ViewProductModalProps) {
  const router = useRouter();
  const { data: fullProductResponse, isLoading } = useGetProductByIdQuery(product?._id || "", {
    skip: !product?._id
  });
  const fullProduct = fullProductResponse?.data || product;
  const [activeMedia, setActiveMedia] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (fullProduct) {
      setActiveMedia(fullProduct.productImage);
    }
  }, [fullProduct]);

  const allMedia = React.useMemo(() => {
    if (!fullProduct) return [];
    const media = [
      { url: fullProduct.productImage, type: "image" },
      ...(fullProduct.media || []).map(m => ({ url: m.url, type: m.type }))
    ].filter(m => m.url);

    // Filter unique URLs
    const seen = new Set();
    return media.filter(m => {
      if (seen.has(m.url)) return false;
      seen.add(m.url);
      return true;
    });
  }, [fullProduct]);

  if (!fullProduct) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Product Details"
      size="xl"
    >
      <ModalBody className="flex flex-col gap-8 py-8 min-h-[400px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
            <div className="w-10 h-10 border-4 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sycing assets...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in duration-500">
          {/* Visual Asset Section */}
          <div className="flex flex-col gap-6">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 group shadow-sm">
              {activeMedia ? (
                activeMedia.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video
                    src={activeMedia}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={activeMedia}
                    alt={fullProduct.name}
                    className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-105"
                  />
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 opacity-20">
                  <Icon name="Image" folder="dashboardIcon" size="xl" />
                  <span className="text-[10px] font-black uppercase tracking-widest">No Image Asset</span>
                </div>
              )}
              
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm
                  ${fullProduct.status === "Published" ? "bg-emerald-500 text-white" : "bg-gray-400 text-white"}
                `}>
                  {fullProduct.status}
                </span>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {allMedia.length > 1 && (
              <div className="flex flex-wrap gap-3">
                {allMedia.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMedia(m.url)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-sm
                      ${activeMedia === m.url ? "border-brand-gold scale-105 shadow-md" : "border-transparent hover:border-gray-200"}
                    `}
                  >
                    {m.type === "video" || m.url.match(/\.(mp4|webm|ogg)$/i) ? (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                         <Icon name="play" folder="icon" size="xs" className="text-white opacity-50" />
                      </div>
                    ) : (
                      <img src={m.url} alt="" className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}
            
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em]">{fullProduct.category?.name || "Uncategorized"}</span>
              <h2 className="text-3xl font-black text-[#1D3557] tracking-tight leading-tight">{fullProduct.name}</h2>
            </div>

            <div className="flex items-center gap-6 py-4 border-y border-gray-50">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing</span>
                <span className="text-2xl font-black text-brand-gold">₦{fullProduct.price.toLocaleString()}</span>
              </div>
              <div className="w-px h-10 bg-gray-100" />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Availability</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xl font-black ${fullProduct.stock > 10 ? "text-emerald-500" : fullProduct.stock > 0 ? "text-amber-500" : "text-rose-500"}`}>
                    {fullProduct.stock}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Units Left</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">About this product</span>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                {fullProduct.description || "No detailed description provided for this catalog item."}
              </p>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-4 pt-6">
               <div className="p-4 rounded-xl border border-gray-100 flex flex-col gap-1">
                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Brand Affinity</span>
                 <span className="text-xs font-bold text-[#1D3557]">{(fullProduct.brand as any)?.name || fullProduct.brand || "Independent"}</span>
               </div>
               <div className="p-4 rounded-xl border border-gray-100 flex flex-col gap-1">
                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Last Updated</span>
                 <span className="text-xs font-bold text-[#1D3557]">
                   {fullProduct.updatedAt ? new Date(fullProduct.updatedAt).toLocaleDateString() : "Recently"}
                 </span>
               </div>
            </div>

            <div className="flex gap-3 pt-6">
              <Button
                shape="rounded-sm"
                variant="primary"
                className="flex-1 h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-brand-gold/10"
                onClick={() => {
                   onClose();
                   router.push(`/admin/products/${fullProduct._id}`);
                }}
                iconLeft={<Icon name="settings" folder="dashboardIcon" size="sm" />}
              >
                Full Edit Access
              </Button>
              <Button
                shape="rounded-sm"
                variant="outline"
                className="h-12 px-6"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
        )}
      </ModalBody>
    </Modal>
  );
}
