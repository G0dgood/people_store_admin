"use client";

import React, { useState } from "react";
import { Header } from "@/app/components/Header";
import Image from "next/image";
import { Footer } from "@/app/components/Footer";
import { Icon } from "@/app/components/Icon";
import { ProductListItem } from "@/app/components/Products/ProductItems";
import { ClearWishlistModal, RemoveItemModal } from "@/app/components/Modal";
import Link from "next/link";
import { useWishlist } from "@/app/context/WishlistContext";
import { useRecentlyViewed, RecentlyViewedItem } from "@/app/context/RecentlyViewedContext";
import Modal from "@/app/components/Modal/Modal";
import { Button } from "@/app/components/Button";
import { FavoriteButton } from "@/app/components/Other";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { recentlyViewedItems } = useRecentlyViewed();
  const { addToCart } = useCart();

  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isRemoveOneModalOpen, setIsRemoveOneModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<any>(null);
  const [selectedQuickViewItem, setSelectedQuickViewItem] = useState<any>(null);
  const [isQuickViewModalOpen, setIsQuickViewModalOpen] = useState(false);

  const handleClearWishlist = () => {
    clearWishlist();
    setIsClearModalOpen(false);
  };

  const handleRemoveOneRequest = (product: any) => {
    setItemToRemove(product);
    setIsRemoveOneModalOpen(true);
  };

  const confirmRemoveOne = () => {
    if (itemToRemove) {
      removeFromWishlist(itemToRemove.id);
      setItemToRemove(null);
      setIsRemoveOneModalOpen(false);
    }
  };

  const handleQuickView = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedQuickViewItem(item);
    setIsQuickViewModalOpen(true);
  };

  const handleAddToCart = (item: any) => {
    addToCart({
      id: `rv-${item.id}`,
      title: item.title,
      price: item.price,
      image: item.image,
    });
    toast.success(`${item.title} added to cart`);
    setIsQuickViewModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-black">
      <Header />

      <div className="flex-1 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-4 md:py-8 flex flex-col gap-4 md:gap-8 w-full">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 overflow-x-auto whitespace-nowrap scrollbar-none pb-2">
          <Link href="/" className="hover:text-brand-gold transition-colors">
            Home
          </Link>
          <Icon name="chevron_right" size="xs" />
          <span className="text-gray-600 font-bold">Wishlist</span>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl md:text-4xl font-outfit font-light text-gray-900 uppercase tracking-[0.1em]">
                My <span className="font-bold">Wishlist</span>
              </h1>
              <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">{wishlistItems.length} items saved</p>
            </div>
            {wishlistItems.length > 0 && (
              <div className="flex items-center gap-6 mb-1">
                <button
                  onClick={() => {
                    wishlistItems.forEach(item => {
                      addToCart({
                        id: item.id,
                        title: item.title,
                        price: item.price,
                        image: item.image,
                      });
                    });
                    toast.success("All items moved to cart");
                  }}
                  className="text-[10px] font-bold uppercase tracking-widest text-brand-blue hover:text-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Icon name="shopping_cart" size="sm" />
                  Move all to cart
                </button>
                <button
                  onClick={() => setIsClearModalOpen(true)}
                  className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Icon name="delete_outline" size="sm" />
                  Clear wishlist
                </button>
              </div>
            )}
          </div>

          {wishlistItems.length > 0 ? (
            <div className="flex flex-col gap-4">
              {wishlistItems.map((product) => (
                <ProductListItem
                  key={product.id}
                  product={product as any}
                  onRemove={() => handleRemoveOneRequest(product)}
                  showFavorite={false}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50/50 py-20 md:py-32 flex flex-col items-center text-center gap-8 rounded-2xl border border-dashed border-gray-200">
              <div className="w-24 h-24 bg-white shadow-xl rounded-full flex items-center justify-center text-brand-gold animate-pulse">
                <Icon name="perfume_empty" size="lg" />
              </div>
              <div className="flex flex-col gap-3 max-w-sm">
                <h3 className="text-2xl font-outfit font-light text-gray-900 uppercase tracking-widest">
                  Your wishlist is <span className="font-bold">empty</span>
                </h3>
                <p className="text-gray-500 leading-relaxed text-xs uppercase tracking-wider font-medium">
                  Save items that you like to your wishlist and they will appear
                  here, making it easy to find them again later.
                </p>
              </div>
              <Link
                href="/products"
                className="bg-black text-white px-12 py-4 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-brand-gold transition-all active:scale-95 flex items-center gap-3 shadow-lg"
              >
                <Icon name="shopping_basket" size="sm" />
                Start shopping
              </Link>
            </div>
          )}
        </div>

        {/* Recently Viewed */}
        <div className="mt-12 border-t border-gray-200 pt-16 pb-12">
          <h2 className="text-xl font-outfit font-light text-gray-900 mb-8 uppercase tracking-[0.2em]">
            Recently <span className="font-bold">viewed</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {recentlyViewedItems.map((item: RecentlyViewedItem) => (
              <Link
                href={`/products/detail?id=${item.id}`}
                key={item.id}
                className="bg-white border border-gray-200 p-3 flex flex-col gap-3 transition-all group"
              >
                <div className="aspect-square relative flex items-center justify-center p-2 bg-gray-50 overflow-hidden">
                  <div className="relative w-full h-full transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>

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
                  <span className="font-bold text-gray-900 text-sm md:text-md">
                    {item.price}
                  </span>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed group-hover:text-brand-blue transition-colors">
                    {item.title}
                  </p>
                </div>
              </Link>
            ))}
            {recentlyViewedItems.length === 0 && (
              <div className="col-span-full py-8 text-center text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                No recently viewed items yet
              </div>
            )}
          </div>
        </div>
      </div>

      <ClearWishlistModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onClear={handleClearWishlist}
      />

      <RemoveItemModal
        isOpen={isRemoveOneModalOpen}
        onClose={() => setIsRemoveOneModalOpen(false)}
        onConfirm={confirmRemoveOne}
        productTitle={itemToRemove?.title}
      />

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
            <div className="w-full md:w-1/2 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">History Collection</span>
                <h2 className="text-2xl font-outfit font-light uppercase tracking-widest text-gray-900 leading-tight">
                  {selectedQuickViewItem.title.split(' ').map((word: string, i: number) =>
                    i === selectedQuickViewItem.title.split(' ').length - 1 ? <span key={i} className="font-bold">{word}</span> : word + ' '
                  )}
                </h2>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-2xl font-black text-gray-900">{selectedQuickViewItem.price}</span>
                  <FavoriteButton 
                    item={selectedQuickViewItem}
                    variant="outline"
                    className="border-gray-200 !w-auto px-4 h-10 flex items-center gap-2"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest">Saved for later</span>
                  </FavoriteButton>
                </div>
              </div>

              <div className="h-px w-full bg-gray-100" />

              <div className="flex flex-col gap-3">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">About this item</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  A masterpiece you recently admired. Rediscover its sophisticated notes and artisanal craftsmanship that captured your attention.
                </p>
              </div>

              <div className="mt-auto flex flex-col gap-4">
                <Button
                  onClick={() => handleAddToCart(selectedQuickViewItem)}
                  className="w-full bg-black text-white h-12 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-brand-gold transition-all"
                >
                  Add to Cart
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

      <Footer />
    </div>
  );
};

export default WishlistPage;
