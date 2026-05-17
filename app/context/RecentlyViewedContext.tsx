"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useCustomerAuth } from "./CustomerAuthContext";
import {
  useGetRecentlyViewedQuery,
  useAddToRecentlyViewedMutation
} from "@/lib/redux/services/recentlyViewedApi";
import { useApiError } from "../hooks/useApiError";
import { usePathname } from "next/navigation";

export interface RecentlyViewedItem {
  isUnlimited: boolean | undefined;
  stock: number;
  id: string;
  title: string;
  price: string;
  image: string;
  rating?: number;
  media?: { type: string; url: string }[];
}

interface RecentlyViewedContextType {
  recentlyViewedItems: RecentlyViewedItem[];
  addToRecentlyViewed: (item: RecentlyViewedItem) => void;
  isLoading: boolean;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export const RecentlyViewedProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useCustomerAuth();
  const [guestHistory, setGuestHistory] = useState<RecentlyViewedItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const pathname = usePathname();
  const { data: backendHistoryData, isLoading: isBackendLoading, isError: isGetError, error: getError } = useGetRecentlyViewedQuery(undefined);
  const [addBackendItem, { isError: isAddError, error: addError }] = useAddToRecentlyViewedMutation();

  // Handle API Errors
  useApiError(isGetError, getError, "Failed to load history", { hideInAdmin: true });
  useApiError(isAddError, addError, "Failed to update history", { hideInAdmin: true });

  useEffect(() => {
    const saved = localStorage.getItem("recently_viewed");
    if (saved) {
      try {
        setGuestHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      localStorage.setItem("recently_viewed", JSON.stringify(guestHistory));
    }
  }, [guestHistory, isInitialized, isAuthenticated]);

  // Sync guest history to backend upon successful login on web
  useEffect(() => {
    if (isInitialized && isAuthenticated && guestHistory.length > 0) {
      const syncHistory = async () => {
        for (const item of guestHistory) {
          try {
            await addBackendItem(item.id).unwrap();
          } catch (err) {
            console.error("Failed to sync guest item to backend:", item.id, err);
          }
        }
        setGuestHistory([]);
        localStorage.removeItem("recently_viewed");
      };
      syncHistory();
    }
  }, [isAuthenticated, guestHistory, isInitialized, addBackendItem]);

  const backendHistory = useMemo(() => {
    if (!backendHistoryData?.data?.products) return [];
    return backendHistoryData.data.products.map((p: any) => ({
      id: p._id,
      title: p.name,
      price: `₦${p.price.toLocaleString()}`,
      image: p.productImage || "/placeholder.png",
      isUnlimited: p.isUnlimited,
      stock: p.stock,
      rating: p.rating,
      media: p.media
    }));
  }, [backendHistoryData]);

  const recentlyViewedItems = isAuthenticated ? backendHistory : guestHistory;

  const addToRecentlyViewed = async (item: RecentlyViewedItem) => {
    if (isAuthenticated) {
      try {
        await addBackendItem(item.id).unwrap();
      } catch (err) {
        // Error handled by useApiError hook
      }
    } else {
      setGuestHistory((prev: RecentlyViewedItem[]) => {
        const filtered = prev.filter(i => i.id !== item.id);
        const newHistory = [item, ...filtered].slice(0, 10);
        return newHistory;
      });
    }
  };

  return (
    <RecentlyViewedContext.Provider value={{
      recentlyViewedItems,
      addToRecentlyViewed,
      isLoading: isAuthenticated ? isBackendLoading : !isInitialized
    }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider");
  }
  return context;
};
