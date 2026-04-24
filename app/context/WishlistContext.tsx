"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export interface WishlistItem {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating?: number;
  orders?: number;
  shipping?: string;
  description?: string;
  category?: string;
  brand?: string;
  condition?: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist_items");
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    } else {
      // Seed with initial hardcoded data from the WishlistPage
      setWishlistItems([
        {
          id: "w-1",
          title: "Aura Pink Blossom Luxury Eau de Parfum - 50ml",
          price: "₦40,000.00",
          rating: 4.8,
          orders: 154,
          shipping: "Free Shipping",
          description: "A delicate floral fragrance with notes of cherry blossom and pink pepper.",
          image: "/web_images/perfume_product_1_square_1777031387712.png",
        },
        {
          id: "w-2",
          title: "Aurore Noire Intense Designer Fragrance - 100ml",
          price: "₦150,000.00",
          rating: 4.9,
          orders: 2310,
          shipping: "Fast Shipping",
          description: "A bold, seductive scent featuring black orchid and deep sandalwood.",
          image: "/web_images/perfume_product_2_square_1777031402357.png",
        },
        {
          id: "w-3",
          title: "Oceania Fresh Mist Collection - 75ml",
          price: "₦85,000.00",
          rating: 4.7,
          orders: 890,
          shipping: "Free Shipping",
          description: "Crisp marine notes blended with citrus and sea salt for a refreshing finish.",
          image: "/web_images/perfume_product_3_square_1777031417355.png",
        },
      ]);
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("wishlist_items", JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isInitialized]);

  const addToWishlist = (item: WishlistItem) => {
    setWishlistItems(prev => {
      if (prev.find(i => i.id === item.id)) return prev;
      toast.success("Added to wishlist");
      return [...prev, item];
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlistItems(prev => prev.filter(i => i.id !== id));
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const isInWishlist = (id: string) => {
    return wishlistItems.some(item => item.id === id);
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlistItems, 
      addToWishlist, 
      removeFromWishlist, 
      clearWishlist,
      isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
