"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Rating, FavoriteButton } from "../Other";
import { Button } from "../Button/Button";
import { HiEye } from "react-icons/hi2";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";
import { StockWarning } from "../StockWarning";
import { ProductActionOverlay } from "./ProductActionOverlay";

interface ProductProps {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  rating: number;
  orders: number;
  shipping: string;
  description: string;
  image: string;
  stock: number;
  isUnlimited: boolean;
  media?: { type: string, url: string }[];
  onQuickView?: (product: any) => void;
  detailUrl?: string;
}

export const ProductGridItem: React.FC<{ product: ProductProps, variant?: "default" | "joined" }> = ({ product, variant = "default" }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isOutOfStock = !product.isUnlimited && product.stock <= 0;
    if (isOutOfStock) {
      toast.error("This magnificent piece is currently out of stock");
      return;
    }

    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      stock: product.stock,
      isUnlimited: product.isUnlimited,
    });
    toast.success("Added to cart");
  };

  const detailPath = product.detailUrl || `/products/detail?id=${product.id}`;

  return (
    <div className={`bg-white flex flex-col h-full group relative transition-all duration-300 ${variant === 'joined' ? 'border-r border-b border-gray-200' : 'border border-gray-200'}`}>
      <Link
        href={detailPath}
        className="flex flex-col flex-1"
      >
        {/* Image Area */}
        <div className="relative w-full aspect-square p-8 flex items-center justify-center overflow-hidden group/image">
          <div className="relative w-full h-full self-stretch transition-all duration-400 group-hover/image:scale-110">
            {/* Primary Image */}
            <Image
              src={product.image}
              alt={product.title}
              fill
              className={`object-contain transition-opacity duration-700 ${product.media && product.media.length > 1 ? 'group-hover/image:opacity-0' : ''}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Secondary Hover Image */}
            {product.media && product.media.length > 1 && (
              <Image
                src={product.media[1].url}
                alt={`${product.title} - Alternate View`}
                fill
                className="object-contain absolute inset-0 opacity-0 group-hover/image:opacity-100 transition-opacity duration-700"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="px-5 pb-5 pt-0 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5 min-h-[4rem]">
            <h3 className="text-[13px] font-medium text-gray-800 leading-tight line-clamp-2">
              {product.title}
            </h3>
            <span className="font-outfit font-medium text-lg text-gray-900 tracking-tight">{product.price}</span>
          </div>
        </div>
      </Link>

      {/* Action Buttons - Always Visible */}
      <div className="px-5 pb-5 flex flex-col gap-2">
        <Button
          onClick={handleAddToCart}
          disabled={!product.isUnlimited && product.stock <= 0}
          className={`w-full h-10 ${!product.isUnlimited && product.stock <= 0 ? 'bg-gray-300' : 'bg-brand-charcoal hover:bg-brand-gold'} text-white text-[10px] tracking-widest font-bold rounded-none transition-all`}
        >
          {!product.isUnlimited && product.stock <= 0 ? 'Out of stock' : 'Add to cart'}
        </Button>

        <button
          onClick={(e) => {
            e.preventDefault();
            product.onQuickView?.(product);
          }}
          className="w-full h-10 border border-gray-200 text-black text-[10px] tracking-widest font-bold hover:bg-gray-50 transition-all rounded-none cursor-pointer"
        >
          Quick view
        </button>
      </div>
    </div>
  );
};

export const ProductListItem: React.FC<{
  product: ProductProps;
  onRemove?: () => void;
  showFavorite?: boolean;
  variant?: "default" | "joined";
}> = ({
  product,
  onRemove,
  showFavorite = true,
  variant = "default"
}) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const isOutOfStock = !product.isUnlimited && product.stock <= 0;
      if (isOutOfStock) {
        toast.error("This magnificent piece is currently out of stock");
        return;
      }

      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        stock: product.stock,
        isUnlimited: product.isUnlimited,
      });
      toast.success("Added to cart");
    };

    return (
      <div className={`bg-white p-3 md:p-5 flex gap-3 md:gap-6 transition-all relative group ${variant === 'joined' ? 'border-b border-gray-200' : 'border border-gray-200'}`}>
        {/* Product Image */}
        <Link
          href={product.detailUrl || `/products/detail?id=${product.id}`}
          className="w-24 h-24 md:w-48 md:h-48 flex-shrink-0 border border-gray-200 flex items-center justify-center p-2 md:p-4 bg-white cursor-pointer overflow-hidden group/image"
        >
          <div className="relative w-full h-full self-stretch transition-all duration-700 group-hover/image:scale-110">
            {/* Primary Image */}
            <Image
              src={product.image}
              alt={product.title}
              fill
              className={`object-contain transition-opacity duration-700 ${product.media && product.media.length > 1 ? 'group-hover/image:opacity-0' : ''}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Secondary Hover Image */}
            {product.media && product.media.length > 1 && (
              <Image
                src={product.media[1].url}
                alt={`${product.title} - Alternate View`}
                fill
                className="object-contain absolute inset-0 opacity-0 group-hover/image:opacity-100 transition-opacity duration-700"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </div>
        </Link>

        {/* Product Content */}
        <div className="flex-1 flex flex-col gap-1 md:gap-3 pr-8 md:pr-0">
          <div className="flex items-start justify-between">
            <Link
              href={product.detailUrl || `/products/detail?id=${product.id}`}
              className="text-[13px] md:text-base font-bold  tracking-wider text-gray-900 leading-snug hover:text-brand-gold cursor-pointer transition-colors line-clamp-2 md:line-clamp-none"
            >
              {product.title}
            </Link>
          </div>

          <div className="flex flex-col gap-0.5 md:gap-1">
            <div className="flex items-center gap-2 md:gap-3">
              <span className="font-outfit font-bold text-lg md:text-2xl text-gray-900">{product.price}</span>
              {product.originalPrice && (
                <span className="text-gray-400 line-through text-xs md:text-sm font-medium">{product.originalPrice}</span>
              )}
            </div>

            {/* Rating & Orders */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] md:text-sm font-normal">
              <div className="flex items-center gap-1">
                <Rating value={product.rating} />
                <span className="text-brand-gold font-bold ml-0.5 md:ml-1">{product.rating}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400">
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-gray-300" />
                <span className="tracking-widest text-[10px]">{product.orders} orders</span>
              </div>
              <StockWarning
                stock={product.stock}
                quantity={0}
                isUnlimited={product.isUnlimited}
              />
              {/* Shipping Info */}
              <div className="flex items-center gap-1.5 text-brand-gold">
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-brand-gold" />
                <span className="font-bold  tracking-widest text-[10px]">{product.shipping}</span>
              </div>
            </div>
          </div>

          {/* Desktop-only description */}
          <p className="hidden md:block text-gray-500 text-sm leading-relaxed line-clamp-2 mt-1 font-light">
            {product.description}
          </p>

          <div className="flex items-center gap-4 mt-auto pt-2">
            <Link href={product.detailUrl || `/products/detail?id=${product.id}`} className="text-black hover:text-brand-gold font-bold text-[10px]  tracking-widest cursor-pointer flex items-center gap-1 transition-colors">
              View details
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                product.onQuickView?.(product);
              }}
              className="text-gray-400 hover:text-brand-gold font-bold text-[10px]  tracking-widest cursor-pointer flex items-center gap-1 transition-colors"
            >
              <HiEye size={16} />
              Quick View
            </button>
            <button
              onClick={handleAddToCart}
              disabled={!product.isUnlimited && product.stock <= 0}
              className={`md:hidden ${!product.isUnlimited && product.stock <= 0 ? 'text-gray-300' : 'text-brand-gold'} font-bold text-[10px]  tracking-widest cursor-pointer`}
            >
              {!product.isUnlimited && product.stock <= 0 ? 'Out of stock' : 'Add to cart'}
            </button>
          </div>
        </div>

        {/* Actions Section (Right Side) */}
        <div className="hidden md:flex flex-col items-end justify-between py-1 min-w-[160px]">
          <div className="flex flex-col h-full justify-between gap-3 items-end w-full">
            {showFavorite && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <FavoriteButton item={product as any} className="flex-shrink-0" />
              </div>
            )}
            <Button
              onClick={handleAddToCart}
              size="sm"
              disabled={!product.isUnlimited && product.stock <= 0}
              className={`w-full ${!product.isUnlimited && product.stock <= 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-brand-charcoal hover:bg-brand-gold'} text-white font-bold mt-2 shadow-none rounded-none text-[10px] tracking-widest h-10`}
            >
              {!product.isUnlimited && product.stock <= 0 ? 'Out of stock' : 'Add to cart'}
            </Button>
          </div>

          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="text-red-500 font-bold text-[10px]  tracking-widest hover:underline cursor-pointer transition-all mt-auto"
            >
              Remove Item
            </button>
          )}
        </div>

        {/* Heart Icon (Mobile) */}
        {showFavorite && (
          <div className="md:hidden absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <FavoriteButton item={product as any} variant="ghost" />
          </div>
        )}
      </div>
    );
  };
