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
          id: "1",
          title: "Canon EOS R5 Mirrorless Camera with 24-105mm Lens Black, ultra high resolution",
          price: "₦998.00",
          originalPrice: "₦1,128.00",
          rating: 4.8,
          orders: 154,
          shipping: "Free Shipping",
          description: "Experience the ultimate in photography with the Canon EOS R5. featuring a 45MP full-frame CMOS sensor and 8K video recording capabilities. This bundle includes the versatile 24-105mm lens for all your professional needs.",
          image: "/images/camera.jpg",
        },
        {
          id: "2",
          title: "Apple iPhone 14 Pro Max 128GB Deep Purple, unlocked and optimized for global speed",
          price: "₦1,099.00",
          rating: 4.9,
          orders: 2310,
          shipping: "Fast Shipping",
          description: "The latest flagship from Apple featuring the Dynamic Island, 48MP main camera, and the lightning-fast A16 Bionic chip. Experience the best in mobile technology and premium design.",
          image: "/images/iphone.jpg",
        },
        {
          id: "3",
          title: "Sony WH-1000XM5 Noise Canceling Headphones with Auto NC Optimizer",
          price: "₦348.00",
          originalPrice: "₦399.00",
          rating: 4.7,
          orders: 890,
          shipping: "Free Shipping",
          description: "Industry-leading noise cancellation with two processors and eight microphones. Experience crystal clear sound and ultimate comfort with the newest Sony flagship headphones.",
          image: "/images/headphone.jpg",
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
