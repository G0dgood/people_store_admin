"use client";

import React from "react";
import { Icon } from "../Icon";
import { Rating, FavoriteButton } from "../Other";

import { PriceTiers, SpecsTable, ProtectionWarranty } from "./ProductDetailSpecs";

import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProductDetailsInfoProps {
  product: any;
}

const ProductDetailsInfo: React.FC<ProductDetailsInfoProps> = ({ product }) => {
  const { addToCart } = useCart();
  const router = useRouter();
  const [selectedVariantIdx, setSelectedVariantIdx] = React.useState<number | null>(
    product?.variants?.length > 0 ? 0 : null
  );
  const [selectedSize, setSelectedSize] = React.useState(0);

  if (!product) return null;

  const currentPrice = React.useMemo(() => {
    if (selectedVariantIdx !== null && product.variants?.[selectedVariantIdx]) {
      return product.variants[selectedVariantIdx].price;
    }
    return product.price;
  }, [product, selectedVariantIdx]);

  const currentSKU = React.useMemo(() => {
    if (selectedVariantIdx !== null && product.variants?.[selectedVariantIdx]) {
      return product.variants[selectedVariantIdx].sku;
    }
    return product.sku || `PRD-${product._id?.slice(-6).toUpperCase()}`;
  }, [product, selectedVariantIdx]);

  const currentStock = React.useMemo(() => {
    if (selectedVariantIdx !== null && product.variants?.[selectedVariantIdx]) {
      return product.variants[selectedVariantIdx].stock;
    }
    return product.stock;
  }, [product, selectedVariantIdx]);

  const sizes = React.useMemo(() => {
    if (product.variants?.length > 0) {
      return product.variants.map((v: any, idx: number) => {
        const attrs = v.attributes || {};
        const color = attrs.color || attrs.Color;
        
        const otherAttrs = Object.entries(attrs)
          .filter(([key]) => key.toLowerCase() !== 'color')
          .map(([_, val]) => {
            if (Array.isArray(val)) return val.join(", ");
            if (typeof val === 'string') {
              try {
                const parsed = JSON.parse(val);
                if (Array.isArray(parsed)) return parsed.join(", ");
              } catch (e) {}
              return val.replace(/[\[\]"]/g, "");
            }
            return val;
          });

        return {
          label: otherAttrs.join(" / ") || `Variant ${idx + 1}`,
          color: typeof color === 'string' ? color.replace(/[\[\]"]/g, "") : color,
          price: `₦${v.price.toLocaleString()}`,
          isActive: true
        };
      });
    }
    const rawSizes = product.size || product.volume || ["One Size"];
    const sizeArray = Array.isArray(rawSizes)
      ? rawSizes
      : typeof rawSizes === "string"
        ? rawSizes.split(",").map(s => s.trim())
        : ["One Size"];

    return sizeArray.map((s: any) => ({
      label: typeof s === 'string' ? s.replace(/[\[\]"]/g, "") : (Array.isArray(s) ? s.join(", ") : String(s)),
      price: `₦${product.price.toLocaleString()}`,
      isActive: true
    }));
  }, [product, selectedVariantIdx]);

  const specs = [
    { label: "SKU:", value: currentSKU },
    { label: "Brand:", value: product.brand?.name || "Artisanal House" },
    { label: "Category:", value: product.category?.name || "Boutique Collection" },
    { label: "Gender:", value: product.gender || "Unisex" },
    { label: "Stock Status:", value: product.stockStatus || "In Stock" },
    { label: "Availability:", value: product.isUnlimited ? "Always Available" : `${currentStock || 0} pieces left` },
  ];

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      title: product.name,
      price: `₦${currentPrice.toLocaleString()}`,
      image: product.productImage,
      sku: currentSKU,
      variant: selectedVariantIdx !== null ? sizes[selectedVariantIdx].label : undefined
    });
    toast.success("Added to Boutique Bag");
  };

  const handleBuyNow = () => {
    addToCart({
      id: product._id,
      title: product.name,
      price: `₦${currentPrice.toLocaleString()}`,
      image: product.productImage,
      sku: currentSKU,
      variant: selectedVariantIdx !== null ? sizes[selectedVariantIdx].label : undefined
    });
    router.push("/checkout");
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
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 border-b border-gray-200 pb-2">
          {product.variants?.length > 0 ? "Select Variant" : "Select Size"}
        </h3>
        <div className="flex flex-wrap gap-4">
          {sizes.map((size: any, idx: number) => (
            <button
              key={idx}
              onClick={() => {
                if (product.variants?.length > 0) {
                  setSelectedVariantIdx(idx);
                } else {
                  setSelectedSize(idx);
                }
              }}
              className={`px-6 py-3 border transition-all duration-300 flex items-center gap-4 rounded-none
                ${(product.variants?.length > 0 ? selectedVariantIdx === idx : selectedSize === idx)
                  ? "border-brand-gold bg-black text-white shadow-xl scale-105"
                  : "border-gray-200 hover:border-brand-gold text-gray-500 hover:text-gray-900"}`}
            >
              {size.color && (
                <div 
                  className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: size.color }}
                />
              )}
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-[11px] font-bold uppercase tracking-widest leading-none">{size.label}</span>
                <span className={`text-[9px] font-medium leading-none mt-1 ${(product.variants?.length > 0 ? selectedVariantIdx === idx : selectedSize === idx) ? "text-brand-gold" : "text-gray-400"}`}>{size.price}</span>
              </div>
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
            Add to Cart
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
        <button 
          onClick={handleBuyNow}
          className="w-full border-2 border-brand-gold text-brand-gold h-14 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-brand-gold hover:text-white transition-all active:scale-95"
        >
          Buy Now
        </button>
      </div>

      <ProtectionWarranty />
    </div>
  );
};

export { ProductDetailsInfo };
