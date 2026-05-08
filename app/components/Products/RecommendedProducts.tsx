"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../Button/Button";
import { FavoriteButton } from "../Other";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";
import { EmptyState } from "../Admin/EmptyState";
import { HiOutlineSparkles } from "react-icons/hi2";
import { Icon } from "../Icon";
import { StockWarning } from "../StockWarning";
import { SectionHeaderSimple } from "../ui/SectionHeaderSimple";

interface RecommendedProduct {
  isUnlimited: boolean | undefined;
  stock: number;
  id: string;
  title: string;
  price: string;
  image: string;
}

interface RecommendedProductsProps {
  products: RecommendedProduct[];
}

export const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ products }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent, product: RecommendedProduct) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    });
    toast.success("Added to cart");
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col mt-8 border border-gray-200 overflow-hidden bg-white">
      <SectionHeaderSimple title="You may also like" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-6 flex flex-col gap-4 hover:bg-gray-50 transition-colors group cursor-pointer border-b border-gray-100 last:border-b-0 md:border-b-0 md:border-r last:md:border-r-0 lg:border-r border-gray-100"
          >
            <Link href={`/products/detail?id=${product.id}`} className="flex flex-col gap-4">
              <div className="w-full aspect-square relative bg-white border border-gray-200 flex items-center justify-center p-14 md:p-10 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain scale-75 group-hover:scale-80 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Quick View Button Overlay */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
                  <div className="w-full py-2 bg-black/80 backdrop-blur-md text-white text-[9px] font-bold tracking-[0.2em] hover:bg-brand-gold transition-all text-center">
                    Quick View
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-outfit font-bold text-gray-900">{product.price}</span>


                  <StockWarning
                    stock={product.stock}
                    quantity={0}
                    isUnlimited={product.isUnlimited}
                  />
                </div>
                <p className="text-gray-500 text-sm leading-tight line-clamp-2 group-hover:text-brand-gold transition-colors font-outfit font-medium">
                  {product.title}
                </p>
              </div>
            </Link>

            <div className="flex flex-row gap-2 mt-auto">
              <Button
                onClick={(e) => handleAddToCart(e, product)}
                variant="secondary"
                size="sm"
                className="flex-1 font-outfit font-bold hover:bg-brand-gold hover:text-white shadow-none justify-center text-[10px] h-10"
                iconLeft={<Icon name="shopping_cart" size="xs" />}
              >
                Add to Cart
              </Button>
              <FavoriteButton
                item={product as any}
                variant="outline"
                size="sm"
                className="!w-10 !h-10 border-gray-200 shrink-0"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
