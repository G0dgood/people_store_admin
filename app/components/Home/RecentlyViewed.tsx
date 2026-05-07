"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "../Modal/Modal";
import { Button } from "../Button";
import { FavoriteButton } from "../Other";
import { useCart } from "@/app/context/CartContext";
import { useRecentlyViewed } from "@/app/context/RecentlyViewedContext";
import { toast } from "sonner";
import { Icon } from "../Icon";
import { StockWarning } from "../StockWarning";

const RecentlyViewed = () => {
  const { addToCart } = useCart();
  const { recentlyViewedItems, isLoading } = useRecentlyViewed();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);



  const handleQuickView = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      stock: item.stock,
      isUnlimited: item.isUnlimited,
    });
    toast.success(`${item.title} added to cart`);
    setIsModalOpen(false);
  };

  if (isLoading || recentlyViewedItems.length === 0) return null;

  return (
    <section className="w-full border border-gray-200 overflow-hidden bg-white mt-8 mb-12">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Recently viewed</h3>
        <Link href="/products" className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold hover:tracking-[0.3em] transition-all">
          Explore Boutique
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {recentlyViewedItems?.slice(0, 5).map((item, idx) => (
          <div
            key={item.id}
            className="p-6 flex flex-col gap-4 hover:bg-gray-50 transition-colors group cursor-pointer border-b border-gray-100 last:border-b-0 md:border-b-0 md:border-r last:md:border-r-0 lg:border-r border-gray-100"
          >
            <Link
              href={`/products/detail?id=${item.id}`}
              className="flex flex-col gap-4"
            >
              <div className="w-full aspect-square relative bg-white border border-gray-200 flex items-center justify-center p-14 md:p-10 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain scale-75 group-hover:scale-80 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 25vw, 20vw"
                />

                {/* Quick View Button Overlay */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
                  <button
                    onClick={(e) => handleQuickView(e, item)}
                    className="w-full py-2 bg-black/80 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-brand-gold transition-all"
                  >
                    Quick View
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">

                <span className="font-bold text-gray-900">{item.price}</span>

                <p className="text-gray-500 text-sm leading-tight line-clamp-2 group-hover:text-brand-gold transition-colors font-medium">
                  {item.title}
                </p>
              </div>
            </Link>

            <div className="flex flex-row gap-2 mt-auto">
              <Button
                onClick={() => handleAddToCart(item)}
                variant="secondary"
                size="sm"
                className="flex-1 font-bold hover:bg-brand-gold hover:text-white shadow-none justify-center text-[10px] h-10"
                iconLeft={<Icon name="shopping_cart" size="xs" />}
              >
                Add to Cart
              </Button>
              <FavoriteButton
                item={item as any}
                variant="outline"
                size="sm"
                className="!w-10 !h-10 border-gray-200 shrink-0"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Quick View Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="lg"
      >
        {selectedItem && (
          <div className="flex flex-col md:flex-row gap-8 py-2">
            <div className="w-full md:w-1/2 aspect-square relative bg-gray-50 border border-gray-100 p-8 rounded-xl">
              <Image
                src={selectedItem.image}
                alt={selectedItem.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">Your History</span>
                <h2 className="text-2xl font-outfit font-light uppercase tracking-widest text-gray-900 leading-tight">
                  {selectedItem.title}
                </h2>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-2xl font-black text-gray-900">{selectedItem.price}</span>
                  <FavoriteButton
                    item={selectedItem as any}
                    variant="outline"
                    className="border-gray-200 !w-auto px-4 h-10 flex items-center gap-2"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest">Save for later</span>
                  </FavoriteButton>
                </div>
              </div>

              <div className="h-px w-full bg-gray-100" />

              <div className="flex flex-col gap-3">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Artisanal Choice</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  A sophisticated selection from your history. Re-experience its premium quality and craftsmanship.
                </p>
              </div>

              <div className="mt-auto flex flex-col gap-4">
                <Button
                  onClick={() => handleAddToCart(selectedItem)}
                  className="w-full bg-black text-white h-12 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-brand-gold transition-all"
                >
                  Add to Cart
                </Button>
                <Link
                  href={`/products/detail?id=${selectedItem.id}`}
                  className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-brand-gold transition-colors"
                  onClick={() => setIsModalOpen(false)}
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default RecentlyViewed;
