"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "../Modal/Modal";
import { Button } from "../Button";
import { FavoriteButton } from "../Other";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ isOpen, onClose, product }) => {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [selectedIdx, setSelectedIdx] = React.useState<number>(0);

  React.useEffect(() => {
    if (product?.image) {
      setSelectedImage(product.image);
    }
    setSelectedIdx(0);
  }, [product]);

  const images = React.useMemo(() => {
    if (!product) return [];
    return [
      product.image,
      ...(product.media || [])
        .filter((m: any) => m.type === "image" && m.url !== product.image)
        .map((m: any) => m.url)
    ].filter(Boolean);
  }, [product]);

  const sizes = React.useMemo(() => {
    const allOptions: any[] = [];
    if (!product) return allOptions;
    
    // 1. Base sizes (Normal sizes)
    const rawBaseSizes = product.size || product.volume || [];
    const baseSizeArray = Array.isArray(rawBaseSizes)
      ? rawBaseSizes
      : typeof rawBaseSizes === "string"
        ? rawBaseSizes.split(",").map(s => s.trim())
        : [];
 
    baseSizeArray.forEach((s: any, bIdx: number) => {
      if (s) {
        allOptions.push({
          id: `base-${bIdx}`,
          label: typeof s === 'string' ? s.replace(/[\[\]"]/g, "").trim() : String(s),
          price: typeof product.price === 'number' ? `₦${product.price.toLocaleString()}` : product.price,
          isVariant: false,
          originalPrice: product.price,
          originalStock: product.stock,
          originalSku: product.sku
        });
      }
    });
 
    // 2. Variants
    if (product.variants?.length > 0) {
      product.variants.forEach((v: any, vIdx: number) => {
        const attrs = v.attributes || {};
        const color = attrs.color || attrs.Color;
        const otherAttrs = Object.entries(attrs)
          .filter(([key]) => key.toLowerCase() !== 'color')
          .map(([_, val]) => {
            let cleaned = val;
            if (Array.isArray(val)) {
              cleaned = val.join(", ");
            } else if (typeof val === 'string') {
              try {
                const parsed = JSON.parse(val);
                cleaned = Array.isArray(parsed) ? parsed.join(", ") : parsed;
              } catch (e) {
                cleaned = val;
              }
              cleaned = String(cleaned).replace(/[\[\]"]/g, "").trim();
            }
            return cleaned;
          })
          .filter(Boolean);
 
        const uniqueAttrs = Array.from(new Set(otherAttrs));
 
        allOptions.push({
          id: `variant-${vIdx}`,
          label: uniqueAttrs.join(" / ") || `Variant ${vIdx + 1}`,
          color: typeof color === 'string' ? color.replace(/[\[\]"]/g, "").trim() : color,
          price: typeof v.price === 'number' ? `₦${v.price.toLocaleString()}` : v.price,
          isVariant: true,
          variantIdx: vIdx,
          originalPrice: v.price,
          originalStock: v.stock,
          originalSku: v.sku
        });
      });
    }
 
    if (allOptions.length === 0) {
      allOptions.push({
        id: "default",
        label: "One Size",
        price: typeof product.price === 'number' ? `₦${product.price.toLocaleString()}` : product.price,
        isVariant: false,
        originalPrice: product.price,
        originalStock: product.stock,
        originalSku: product.sku
      });
    }
 
    return allOptions;
  }, [product]);

  const handleAddToCart = () => {
    if (!product || !sizes[selectedIdx]) return;
    const selected = sizes[selectedIdx];

    addToCart({
      id: product._id || product.id,
      title: product.name,
      price: selected.price,
      image: product.image,
      variant: selected.label,
      sku: selected.originalSku,
      meta: {
        color: selected.color,
        size: !selected.isVariant ? selected.label : undefined
      }
    });
    toast.success(`${product.name} added to cart`);
    onClose();
  };

  if (!product) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="lg"
    >
      <div className="flex flex-col md:flex-row gap-8 py-2">
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="aspect-square relative bg-white border border-gray-100 p-8 rounded-xl overflow-hidden">
            <Image
              src={selectedImage || product.image}
              alt={product.name || "Product Image"}
              fill
              className="object-contain p-4 transition-all duration-700 hover:scale-110"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
          
          {/* Sub Images Gallery */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-16 h-16 flex-shrink-0 border rounded-lg overflow-hidden transition-all ${
                    selectedImage === img ? "border-brand-gold ring-1 ring-brand-gold" : "border-gray-200 hover:border-brand-gold"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name || "Product"} thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">Featured Collection</span>
            <h2 className="text-2xl font-outfit font-light uppercase tracking-widest text-gray-900 leading-tight">
              {(product.name || "").split(' ').map((word: string, i: number) => 
                i === (product.name || "").split(' ').length - 1 ? <span key={i} className="font-bold">{word}</span> : word + ' '
              )}
            </h2>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-black text-gray-900">
                {sizes[selectedIdx]?.price || product.price}
              </span>
              <FavoriteButton 
                item={{
                  id: product.id,
                  title: product.name,
                  price: product.price,
                  image: product.image,
                } as any}
                variant="outline"
                className="border-gray-200 !w-auto px-4 h-10 flex items-center gap-2"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest">Save for later</span>
              </FavoriteButton>
            </div>
          </div>

          <div className="h-px w-full bg-gray-100" />

          {/* Variant Selection */}
          {sizes.length > 0 && (
            <div className="flex flex-col gap-4">
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Select Option</h4>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedIdx(idx)}
                    className={`px-4 py-2 border transition-all duration-300 flex items-center gap-3 rounded-none
                      ${selectedIdx === idx 
                        ? "border-brand-gold bg-black text-white" 
                        : "border-gray-100 text-gray-400 hover:border-brand-gold"}`}
                  >
                    {size.color && (
                      <div 
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{ backgroundColor: size.color }}
                      />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-widest">{size.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">About the scent</h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              A harmonious blend of notes that perfectly complements your selected fragrance. Part of our curated artisanal collection for the discerning connoisseur.
            </p>
          </div>

          <div className="mt-auto flex flex-col gap-4">
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-black text-white h-12 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-brand-gold transition-all"
            >
              Add to Cart
            </Button>
            <Link 
              href={`/products/detail?id=${product.id}`}
              className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-brand-gold transition-colors"
              onClick={onClose}
            >
              View Full Details
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};
