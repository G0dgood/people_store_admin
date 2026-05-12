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

  const sizes = React.useMemo(() => {
    const allOptions: any[] = [];

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
          price: `₦${product.price.toLocaleString()}`,
          isVariant: false,
          originalPrice: product.price,
          originalStock: product.stock,
          originalSku: product.sku || `PRD-${product._id?.slice(-6).toUpperCase()}`
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
          price: `₦${v.price.toLocaleString()}`,
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
        price: `₦${product.price.toLocaleString()}`,
        isVariant: false,
        originalPrice: product.price,
        originalStock: product.stock,
        originalSku: product.sku || `PRD-${product._id?.slice(-6).toUpperCase()}`
      });
    }

    return allOptions;
  }, [product]);

  const [selectedIdx, setSelectedIdx] = React.useState(0);
  const currentSelection = sizes[selectedIdx];

  const currentPrice = currentSelection?.originalPrice || product.price;
  const currentSKU = currentSelection?.originalSku || product.sku || `PRD-${product._id?.slice(-6).toUpperCase()}`;
  const currentStock = currentSelection?.originalStock ?? product.stock;

  if (!product) return null;

  const specs = [
    { label: "SKU:", value: currentSKU },
    { label: "Brand:", value: product.brand?.name || "Artisanal House" },
    { label: "Category:", value: product.category?.name || "Boutique Collection" },
    { label: "Gender:", value: product.gender || "Unisex" },
    { label: "Stock Status:", value: product.stockStatus || "In Stock" },
    { label: "Availability:", value: product.isUnlimited ? "Always Available" : `${currentStock || 0} pieces left` },
  ];

  const handleAddToCart = () => {
    const isOutOfStock = !product.isUnlimited && currentStock <= 0;
    if (isOutOfStock) {
      toast.error("This magnificent piece is currently out of stock");
      return;
    }

    addToCart({
      id: product._id,
      title: product.name,
      price: `₦${currentPrice.toLocaleString()}`,
      image: product.productImage,
      sku: currentSKU,
      variant: currentSelection?.label,
      stock: currentStock,
      isUnlimited: product.isUnlimited
    });
    toast.success("Added to Boutique Bag");
  };

  const handleBuyNow = () => {
    const isOutOfStock = !product.isUnlimited && currentStock <= 0;
    if (isOutOfStock) {
      toast.error("This magnificent piece is currently out of stock");
      return;
    }

    addToCart({
      id: product._id,
      title: product.name,
      price: `₦${currentPrice.toLocaleString()}`,
      image: product.productImage,
      sku: currentSKU,
      variant: currentSelection?.label,
      stock: currentStock,
      isUnlimited: product.isUnlimited
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
        <h1 className="text-2xl md:text-3xl font-outfit font-light text-gray-900 leading-tight tracking-tight">
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
          ) : currentStock > 0 ? (
            <div className="flex flex-col gap-2 max-w-[250px]">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <span className={currentStock <= 5 ? "text-rose-500" : "text-gray-400"}>
                  {currentStock <= 5 ? "Limited Availability" : "Inventory Status"}
                </span>
                <span className="text-gray-900">{currentStock} units left</span>
              </div>
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${currentStock <= 5 ? "bg-rose-500" : "bg-brand-gold"}`}
                  style={{ width: `${Math.min((currentStock / 20) * 100, 100)}%` }}
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
          Select Variant / Size
        </h3>
        <div className="flex flex-wrap gap-4">
          {sizes.map((size: any, idx: number) => {
            const isOutOfStock = !product.isUnlimited && size.originalStock <= 0;
            return (
              <button
                key={idx}
                onClick={() => !isOutOfStock && setSelectedIdx(idx)}
                disabled={isOutOfStock}
                className={`px-6 py-3 border transition-all duration-300 flex items-center gap-4 rounded-none
                  ${selectedIdx === idx
                    ? "border-brand-gold bg-black text-white shadow-xl scale-105"
                    : isOutOfStock
                      ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed opacity-60"
                      : "border-gray-200 hover:border-brand-gold text-gray-500 hover:text-gray-900"}`}
              >
                {size.color && (
                  <div
                    className={`w-4 h-4 rounded-full border ${isOutOfStock ? "border-gray-200" : "border-white/20"}  `}
                    style={{ backgroundColor: size.color }}
                  />
                )}
                <div className="flex flex-col items-start gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest leading-none">{size.label}</span>
                    {isOutOfStock && <span className="text-[8px] text-rose-500 font-black">OUT</span>}
                  </div>
                  <span className={`text-[9px] font-medium leading-none mt-1 ${selectedIdx === idx ? "text-brand-gold" : "text-gray-400"}`}>{size.price}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <SpecsTable specs={specs} />

      {/* Availability in Physical Stores */}
      {product.locations?.length > 0 && (
        <div className="flex flex-col gap-4 p-5 bg-gray-50/50 border border-gray-100 rounded-sm">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-900">
            <Icon name="mdi_location (1)" folder="dashboardIcon" size="sm" className="text-brand-gold" />
            <span>Available in {product.locations.length} {product.locations.length === 1 ? 'Location' : 'Locations'}</span>
          </div>
          <div className="flex flex-col gap-4">
            {product.locations.map((loc: any) => (
              <div key={loc._id} className="flex flex-col gap-1 border-l-2 border-brand-gold/20 pl-4">
                <span className="text-[11px] font-black text-gray-800">{loc.name}</span>
                <span className="text-[10px] text-gray-400 leading-relaxed">{loc.address}</span>
                {loc.workingHours && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <Icon name="clock" size="xs" className="text-gray-300" />
                    <span className="text-[9px] text-gray-400 font-medium">{loc.workingHours}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <button
            onClick={handleAddToCart}
            disabled={!product.isUnlimited && currentStock <= 0}
            className={`cursor-pointer flex-1 h-14 font-bold uppercase tracking-[0.2em] text-[11px] transition-all active:scale-95
              ${!product.isUnlimited && currentStock <= 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                : "bg-black text-white hover:bg-brand-gold"}`}
          >
            {!product.isUnlimited && currentStock <= 0 ? "Out of Stock" : "Add to Cart"}
          </button>
          <FavoriteButton
            item={{
              id: product._id || product.id,
              title: product.name,
              price: typeof product.price === 'number' ? `₦${product.price.toLocaleString()}` : product.price,
              image: product.image,
              stock: product.stock,
              isUnlimited: product.isUnlimited,
            } as any}
            variant="outline"
            className="!w-auto px-6 h-14 border-gray-200 flex items-center gap-3 transition-all hover:border-brand-gold hover:text-brand-gold"
          >
            <span className="cursor-pointer text-[10px] font-bold uppercase tracking-widest hidden md:inline">Save for later</span>
          </FavoriteButton>
        </div>
        <button
          onClick={handleBuyNow}
          disabled={!product.isUnlimited && currentStock <= 0}
          className={`cursor-pointer w-full border-2 h-14 font-bold uppercase tracking-[0.2em] text-[11px] transition-all active:scale-95
            ${!product.isUnlimited && currentStock <= 0
              ? "border-gray-200 text-gray-300 cursor-not-allowed"
              : "border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white"}`}
        >
          {!product.isUnlimited && currentStock <= 0 ? "Currently Unavailable" : "Buy Now"}
        </button>
      </div>

      <ProtectionWarranty />
    </div>
  );
};

export { ProductDetailsInfo };
