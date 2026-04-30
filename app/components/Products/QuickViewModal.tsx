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

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart({
      id: `qv-${product.name}`,
      title: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success(`${product.name} added to cart`);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="lg"
    >
      <div className="flex flex-col md:flex-row gap-8 py-2">
        {/* Image Section */}
        <div className="w-full md:w-1/2 aspect-square relative bg-white border border-gray-100 p-8 rounded-xl overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-700 hover:scale-110"
          />
        </div>

        {/* Info Section */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">Featured Collection</span>
            <h2 className="text-2xl font-outfit font-light uppercase tracking-widest text-gray-900 leading-tight">
              {product.name.split(' ').map((word: string, i: number) => 
                i === product.name.split(' ').length - 1 ? <span key={i} className="font-bold">{word}</span> : word + ' '
              )}
            </h2>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-black text-gray-900">{product.price}</span>
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
