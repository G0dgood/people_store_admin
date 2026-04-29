"use client";

import React from "react";
import { Icon } from "../Icon";
import { Rating, FavoriteButton } from "../Other";

import { PriceTiers, SpecsTable, ProtectionWarranty } from "./ProductDetailSpecs";

import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";

interface ProductDetailsInfoProps {
  product: any;
}

const ProductDetailsInfo: React.FC<ProductDetailsInfoProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = React.useState(0);

  if (!product) return null;

  const sizes = React.useMemo(() => {
    const rawSizes = product.size || product.volume || "One Size";
    return rawSizes.split(",").map((s: string) => ({
      label: s.trim(),
      price: `₦${product.price.toLocaleString()}`,
      isActive: true
    }));
  }, [product.size, product.volume, product.price]);

  const specs = [
    { label: "Brand:", value: product.brand?.name || "Artisanal House" },
    { label: "Category:", value: product.category?.name || "Boutique Collection" },
    { label: "Gender:", value: product.gender || "Unisex" },
    { label: "Stock Status:", value: product.stockStatus || "In Stock" },
    { label: "Availability:", value: product.isUnlimited ? "Always Available" : `${product.stock || 0} pieces left` },
  ];

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      title: product.name,
      price: `₦${product.price.toLocaleString()}`,
      image: product.productImage,
    });
    toast.success("Added to Boutique Bag");
  };

  return (
    <div className="flex-1 flex flex-col gap-8">
      {/* Header Info */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Icon 
            name={product.stockStatus === "Out of Stock" ? "close" : "check"} 
            size="sm" 
            className={product.stockStatus === "Out of Stock" ? "text-rose-500" : "text-brand-gold"} 
          />
          <span className={`text-[10px] font-bold uppercase tracking-widest ${product.stockStatus === "Out of Stock" ? "text-rose-500" : "text-brand-gold"}`}>
            {product.stockStatus || "In Stock"} & Ready to Ship
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-outfit font-light text-gray-900 leading-tight uppercase tracking-tight">
          {product.name}
        </h1>
        <div className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-gray-400">
          <div className="flex items-center gap-2">
            <Rating value={product.ratings || 0} />
            <span className="text-brand-gold">{product.ratings || 0} Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="chat" size="xs" />
            <span>{product.reviewCount || 0} reviews</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="shopping_basket" size="xs" />
            <span>Authentic Product</span>
          </div>
        </div>

        {/* Prominent Stock Badge */}
        <div className="mt-2">
          {product.isUnlimited ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/10 border border-brand-gold/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Boutique Essential — Always Available</span>
            </div>
          ) : product.stock > 0 ? (
            <div className="flex flex-col gap-2 max-w-[250px]">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <span className={product.stock <= 5 ? "text-rose-500" : "text-gray-400"}>
                  {product.stock <= 5 ? "Limited Availability" : "Inventory Status"}
                </span>
                <span className="text-gray-900">{product.stock} units left</span>
              </div>
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${product.stock <= 5 ? "bg-rose-500" : "bg-brand-gold"}`}
                  style={{ width: `${Math.min((product.stock / 20) * 100, 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-100 rounded-full">
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500">Currently Unavailable</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 border-b border-gray-200 pb-2">Select Size</h3>
        <div className="flex flex-wrap gap-4">
          {sizes.map((size: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setSelectedSize(idx)}
              className={`px-8 py-4 border transition-all duration-300 flex flex-col items-center gap-1 rounded-none
                ${selectedSize === idx
                  ? "border-brand-gold bg-black text-white shadow-xl scale-105"
                  : "border-gray-200 hover:border-brand-gold text-gray-500 hover:text-gray-900"}`}
            >
              <span className="text-xs font-bold uppercase tracking-widest">{size.label}</span>
              <span className={`text-[10px] font-medium ${selectedSize === idx ? "text-brand-gold" : "text-gray-400"}`}>{size.price}</span>
            </button>
          ))}
        </div>
      </div>

      <SpecsTable specs={specs} />

      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-black text-white h-14 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-brand-gold transition-all shadow-xl active:scale-95"
          >
            Add to Bag
          </button>
          <FavoriteButton
            item={{
              id: product._id,
              title: product.name,
              price: `₦${product.price.toLocaleString()}`,
              image: product.productImage,
            } as any}
            variant="outline"
            className="!w-auto px-6 h-14 border-gray-200 flex items-center gap-2"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">Save for later</span>
          </FavoriteButton>
        </div>
        <button className="w-full border-2 border-brand-gold text-brand-gold h-14 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-brand-gold hover:text-white transition-all active:scale-95">
          Buy Now
        </button>
      </div>

      <ProtectionWarranty />
    </div>
  );
};

export { ProductDetailsInfo };
