import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "../Icon";
import { Button } from "../Button";
import Modal from "../Modal/Modal";
import { toast } from "sonner";
import { FavoriteButton } from "../Other";

import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { formatPrice } from "@/app/utils/formatPrice";

const SavedForLater = () => {
  const { addToCart } = useCart();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const [selectedQuickViewItem, setSelectedQuickViewItem] = useState<any>(null);
  const [isQuickViewModalOpen, setIsQuickViewModalOpen] = useState(false);

  const handleMoveToCart = (item: any) => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
    });
    removeFromWishlist(item.id);
    toast.success(`${item.title} moved to cart`);
  };

  const handleQuickView = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedQuickViewItem(item);
    setIsQuickViewModalOpen(true);
  };

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
    });
    toast.success(`${item.title} added to cart`);
    setIsQuickViewModalOpen(false);
  };

  if (wishlistItems.length === 0) {
    return (
      <section className="bg-white border border-gray-200 overflow-hidden ">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Saved for later</h3>
        </div>
        <div className="p-12 flex flex-col items-center text-center gap-2">
          <p className="text-gray-900 font-bold">No saved items</p>
          <p className="text-gray-500 text-sm">Items you save for later will appear here.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white overflow-hidden ">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900">Saved for later ({wishlistItems.length})</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {wishlistItems.map((item) => (
          <div key={item.id} className="p-6 flex flex-col gap-4 hover:bg-gray-50 transition-colors group cursor-pointer">
            <div className="w-full aspect-square relative bg-white border border-gray-200 flex items-center justify-center p-14 md:p-10 overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain scale-75 group-hover:scale-80 transition-transform duration-300"
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
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-gray-900">{formatPrice(item.price)}</span>
                <p className="text-gray-500 text-sm leading-tight line-clamp-2 group-hover:text-brand-gold">{item.title}</p>
              </div>
              <div className="flex flex-row gap-2">
                <Button
                  onClick={() => handleMoveToCart(item)}
                  variant="secondary"
                  size="sm"
                  className="flex-1 font-bold hover:bg-brand-gold hover:text-white shadow-none justify-center"
                  iconLeft={<Icon name="shopping_cart" size="xs" />}
                >
                  Move to cart
                </Button>
                <Button
                  onClick={() => removeFromWishlist(item.id)}
                  variant="ghost"
                  size="sm"
                  className="flex-1 !text-[#EB001B] font-medium border border-brand-gold-light hover:bg-red-50 shadow-none justify-center"
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick View Modal */}
      <Modal
        isOpen={isQuickViewModalOpen}
        onClose={() => setIsQuickViewModalOpen(false)}
        size="lg"
      >
        {selectedQuickViewItem && (
          <div className="flex flex-col md:flex-row gap-8 py-2">
            {/* Image Section */}
            <div className="w-full md:w-1/2 aspect-square relative bg-gray-50 border border-gray-100 p-8 rounded-xl overflow-hidden">
              <Image
                src={selectedQuickViewItem.image}
                alt={selectedQuickViewItem.title}
                fill
                className="object-contain"
              />
            </div>

            {/* Info Section */}
            <div className="w-full md:w-1/2 flex flex-col gap-6 text-left">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">Saved Collection</span>
                <h2 className="text-2xl font-outfit font-light uppercase tracking-widest text-gray-900 leading-tight">
                  {selectedQuickViewItem.title.split(' ').map((word: string, i: number) =>
                    i === selectedQuickViewItem.title.split(' ').length - 1 ? <span key={i} className="font-bold">{word}</span> : word + ' '
                  )}
                </h2>
                <span className="text-2xl font-black text-gray-900 mt-2">{formatPrice(selectedQuickViewItem.price)}</span>
              </div>

              <div className="h-px w-full bg-gray-100" />

              <div className="flex flex-col gap-3">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">About this choice</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  A sophisticated selection you saved for later. Re-experience its premium quality and craftsmanship before bringing it back to your active cart.
                </p>
              </div>

              <div className="mt-auto flex flex-col gap-4">
                <Button
                  onClick={() => handleAddToCart(selectedQuickViewItem)}
                  className="w-full bg-black text-white h-12 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-brand-gold transition-all"
                >
                  Move to Cart
                </Button>
                <Link
                  href={`/products/detail?id=${selectedQuickViewItem.id}`}
                  className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-brand-gold transition-colors"
                  onClick={() => setIsQuickViewModalOpen(false)}
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

export { SavedForLater };
