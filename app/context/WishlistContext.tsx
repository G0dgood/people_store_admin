"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useCustomerAuth } from "./CustomerAuthContext";
import { 
  useGetWishlistQuery, 
  useToggleWishlistItemMutation, 
  useClearWishlistMutation 
} from "@/lib/redux/services/wishlistApi";
import { useApiError } from "../hooks/useApiError";
import { usePathname } from "next/navigation";

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
  stock?: number;
  isUnlimited?: boolean;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
  isInWishlist: (id: string) => boolean;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useCustomerAuth();
  const [guestWishlist, setGuestWishlist] = useState<WishlistItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const pathname = usePathname();

  const { data: backendWishlistData, isLoading: isBackendLoading, isError: isGetError, error: getError } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [toggleBackendItem, { isError: isToggleError, error: toggleError }] = useToggleWishlistItemMutation();
  const [clearBackendWishlist, { isError: isClearError, error: clearError }] = useClearWishlistMutation();

  useApiError(isGetError, getError, "Failed to load wishlist", { hideInAdmin: true });
  useApiError(isToggleError, toggleError, "Failed to update wishlist", { hideInAdmin: true });
  useApiError(isClearError, clearError, "Failed to clear wishlist", { hideInAdmin: true });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedWishlist = localStorage.getItem("wishlist_items");
      if (savedWishlist) {
        setGuestWishlist(JSON.parse(savedWishlist));
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated && guestWishlist.length > 0 && isInitialized) {
      const syncItems = async () => {
        for (const item of guestWishlist) {
          try {
            await toggleBackendItem(item.id).unwrap();
          } catch (err) {
            console.error("Failed to sync item:", item.title);
          }
        }
        setGuestWishlist([]);
        if (typeof window !== "undefined") {
          localStorage.removeItem("wishlist_items");
        }
        toast.success("Guest wishlist synchronized with your account");
      };
      syncItems();
    }
  }, [isAuthenticated, isInitialized, guestWishlist, toggleBackendItem]);

  useEffect(() => {
    if (isInitialized && !isAuthenticated && typeof window !== "undefined") {
      localStorage.setItem("wishlist_items", JSON.stringify(guestWishlist));
    }
  }, [guestWishlist, isInitialized, isAuthenticated]);

  const backendWishlist = useMemo(() => {
    if (!backendWishlistData?.data?.products) return [];
    return backendWishlistData.data.products.map((p: any) => ({
      id: p._id,
      title: p.name,
      price: `\u20A6${p.price.toLocaleString()}`,
      image: p.productImage || "/placeholder.png",
      description: p.description,
      rating: p.ratings || 0,
      orders: p.soldCount || 0,
      shipping: "Standard Shipping",
      stock: p.stock || 0,
      isUnlimited: p.isUnlimited || false,
    }));
  }, [backendWishlistData]);

  const wishlistItems = isAuthenticated ? backendWishlist : guestWishlist;

  const addToWishlist = async (item: WishlistItem) => {
    if (isAuthenticated) {
      try {
        await toggleBackendItem(item.id).unwrap();
        toast.success("Added to wishlist");
      } catch (err) {
        // Error handled by useApiError
      }
    } else {
      setGuestWishlist((prev: WishlistItem[]) => {
        if (prev.find(i => i.id === item.id)) return prev;
        toast.success("Added to wishlist");
        return [...prev, item];
      });
    }
  };

  const removeFromWishlist = async (id: string) => {
    if (isAuthenticated) {
      try {
        await toggleBackendItem(id).unwrap();
        toast.success("Removed from wishlist");
      } catch (err) {
        // Error handled by useApiError
      }
    } else {
       setGuestWishlist((prev: WishlistItem[]) => prev.filter(i => i.id !== id));
    }
  };

  const clearWishlist = async () => {
    if (isAuthenticated) {
      try {
        await clearBackendWishlist().unwrap();
        toast.success("Wishlist cleared");
      } catch (err) {
        // Error handled by useApiError
      }
    } else {
      setGuestWishlist([]);
    }
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
      isInWishlist,
      isLoading: isAuthenticated ? isBackendLoading : !isInitialized
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
