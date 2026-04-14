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

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();

  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isRemoveOneModalOpen, setIsRemoveOneModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<any>(null);

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

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-sans text-black">
      <Header />

      <main className="flex-1 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-4 md:py-8 flex flex-col gap-4 md:gap-8 w-full">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-400 overflow-x-auto whitespace-nowrap scrollbar-none pb-2">
          <Link href="/" className="hover:text-brand-blue transition-colors">
            Home
          </Link>
          <Icon name="chevron_right" size="xs" />
          <span className="text-gray-600 font-medium">Wishlist</span>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                My Wishlist
              </h1>
              <p className="text-gray-500 text-sm">{wishlistItems.length} items saved</p>
            </div>
            {wishlistItems.length > 0 && (
              <button
                onClick={() => setIsClearModalOpen(true)}
                className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Icon name="delete_outline" size="sm" />
                Clear wishlist
              </button>
            )}
          </div>

          {wishlistItems.length > 0 ? (
            <div className="flex flex-col gap-3 md:gap-4">
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
            <div className="bg-white rounded-2xl border border-gray-100 p-12 md:p-20 flex flex-col items-center text-center gap-6 shadow-sm">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-brand-blue animate-pulse">
                <Icon name="favorite" size="lg" />
              </div>
              <div className="flex flex-col gap-2 max-w-sm">
                <h3 className="text-2xl font-bold text-gray-900">
                  Your wishlist is empty
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm md:text-md">
                  Save items that you like to your wishlist and they will appear
                  here, making it easy to find them again later.
                </p>
              </div>
              <Link
                href="/products"
                className="mt-2 bg-brand-blue text-white px-10 py-3.5 rounded-xl font-bold hover:bg-brand-blue/90 transition-all shadow-lg hover:shadow-brand-blue/20 active:scale-95 flex items-center gap-2"
              >
                <Icon name="shopping_basket" size="sm" />
                Start shopping
              </Link>
            </div>
          )}
        </div>

        {/* Recently Viewed */}
        <div className="mt-8 border-t border-gray-100 pt-10 pb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">
            Recently viewed
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              {
                id: "rv1",
                title: "Men's fashion blue jeans",
                price: "₦12.50",
                image: "/images/shirt.jpg",
              },
              {
                id: "rv2",
                title: "Leather brown wallet",
                price: "₦34.00",
                image: "/images/wallet.jpg",
              },
              {
                id: "rv3",
                title: "Smart watch silver edition",
                price: "₦19.00",
                image: "/images/watch.jpg",
              },
              {
                id: "rv4",
                title: "Blue backpack collection",
                price: "₦10.00",
                image: "/images/bag.jpg",
              },
              {
                id: "rv5",
                title: "Tech accessories bundle",
                price: "₦99.00",
                image: "/images/camera.jpg",
              },
              {
                id: "rv6",
                title: "Wireless headphones gray",
                price: "₦89.00",
                image: "/images/headphone.jpg",
              },
            ].map((item) => (
              <Link
                href="/products/detail"
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col gap-3 hover:shadow-md transition-all group"
              >
                <div className="aspect-square relative flex items-center justify-center p-2 bg-gray-50 rounded-md overflow-hidden">
                  <div className="relative w-full h-full transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
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
          </div>
        </div>
      </main>

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

      <Footer />
    </div>
  );
};

export default WishlistPage;
