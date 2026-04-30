"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useCustomerAuth } from "./CustomerAuthContext";
import { useApiError } from "../hooks/useApiError";
import { 
  useGetCartQuery, 
  useSyncCartMutation, 
  useAddToCartMutation, 
  useUpdateCartItemMutation, 
  useRemoveFromCartMutation, 
  useClearCartMutation 
} from "@/lib/redux/services/cartApi";
import { useSocket } from "./SocketContext";

export interface CartItem {
  id: string;
  title: string;
  price: string;
  image: string;
  quantity: number;
  sku?: string;
  variant?: string;
  meta?: {
    size?: string;
    color?: string;
    material?: string;
    seller?: string;
  };
  itemType?: "Product" | "GiftBox";
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [localCartItems, setLocalCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { isAuthenticated } = useCustomerAuth();

  // RTK Query hooks
  const { data: backendCartData, refetch } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const [syncCart, { isError: isSyncError, error: syncError }] = useSyncCartMutation();
  const [addToCartMut, { isError: isAddError, error: addError }] = useAddToCartMutation();
  const [updateCartItemMut, { isError: isUpdateError, error: updateError }] = useUpdateCartItemMutation();
  const [removeFromCartMut, { isError: isRemoveError, error: removeError }] = useRemoveFromCartMutation();
  const [clearCartMut, { isError: isClearError, error: clearError }] = useClearCartMutation();
  
  const { on, off } = useSocket();

  // Listen for product updates to refresh cart prices/info
  useEffect(() => {
    const handleProductUpdate = () => {
      if (isAuthenticated) {
        refetch();
      }
    };

    on("PRODUCT_UPDATED", handleProductUpdate);
    return () => off("PRODUCT_UPDATED", handleProductUpdate);
  }, [on, off, isAuthenticated, refetch]);

  // Handle API Errors
  useApiError(isSyncError, syncError, "Failed to sync cart", { hideInAdmin: true });
  useApiError(isAddError, addError, "Failed to add to cart", { hideInAdmin: true });
  useApiError(isUpdateError, updateError, "Failed to update quantity", { hideInAdmin: true });
  useApiError(isRemoveError, removeError, "Failed to remove from cart", { hideInAdmin: true });
  useApiError(isClearError, clearError, "Failed to clear cart", { hideInAdmin: true });

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart_items");
    if (savedCart) {
      setLocalCartItems(JSON.parse(savedCart));
    }
    setIsInitialized(true);
  }, []);

  // Sync local cart to backend when user logs in
  useEffect(() => {
    const performSync = async () => {
      if (isAuthenticated && isInitialized) {
        const savedCart = localStorage.getItem("cart_items");
        const parsedCart = savedCart ? JSON.parse(savedCart) : [];
        
        if (parsedCart.length > 0) {
          const syncPayload = parsedCart.map((item: any) => ({
            product: item.id,
            quantity: item.quantity,
            itemType: item.itemType || "Product",
            meta: item.meta,
            sku: item.sku,
            variant: item.variant
          }));
          
          try {
            await syncCart({ items: syncPayload }).unwrap();
            localStorage.removeItem("cart_items");
            setLocalCartItems([]);
            refetch();
          } catch (error) {
            // Error handled by useApiError hook
          }
        }
      }
    };
    performSync();
  }, [isAuthenticated, isInitialized, syncCart, refetch]);

  // Save to localStorage when local state changes (Guest only)
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      localStorage.setItem("cart_items", JSON.stringify(localCartItems));
    }
  }, [localCartItems, isInitialized, isAuthenticated]);

  // Derived cart items depending on auth status
  const cartItems: CartItem[] = isAuthenticated && backendCartData?.data?.items 
    ? backendCartData.data.items.map((item: any) => {
        const itemData = item.item;
        const isPopulated = typeof itemData === "object" && itemData !== null;
        
        return {
          id: isPopulated ? (itemData._id || itemData.id) : (itemData || item._id),
          title: isPopulated ? (itemData.name || itemData.title) : (item.itemType === "GiftBox" ? "Gift Box" : "Unknown Item"),
          price: String(isPopulated ? (itemData.price || 0) : 0),
          image: isPopulated ? (itemData.productImage || itemData.image || "") : "",
          sku: item.sku,
          variant: item.variant,
          quantity: item.quantity,
          meta: item.meta,
          itemType: item.itemType
        };
      })
    : localCartItems;

  const addToCart = React.useCallback(async (item: Omit<CartItem, "quantity">) => {
    if (isAuthenticated) {
      try {
        await addToCartMut({ 
          product: item.id, 
          itemType: item.itemType || "Product",
          quantity: 1, 
          meta: item.meta,
          sku: item.sku,
          variant: item.variant 
        }).unwrap();
      } catch (err) {
        // Error handled by useApiError hook
      }
    } else {
      setLocalCartItems((prev: CartItem[]) => {
        const existing = prev.find(i => i.id === item.id && i.sku === item.sku);
        if (existing) {
          return prev.map(i => (i.id === item.id && i.sku === item.sku) ? { ...i, quantity: i.quantity + 1 } : i);
        }
        return [...prev, { ...item, quantity: 1 }];
      });
    }
  }, [isAuthenticated, addToCartMut]);

  const removeFromCart = React.useCallback(async (id: string) => {
    if (isAuthenticated) {
      try {
        await removeFromCartMut(id).unwrap();
      } catch (err) {
        // Error handled by useApiError hook
      }
    } else {
      setLocalCartItems((prev: CartItem[]) => prev.filter(i => i.id !== id));
    }
  }, [isAuthenticated, removeFromCartMut]);

  const updateQuantity = React.useCallback(async (id: string, quantity: number) => {
    const validQuantity = Math.max(1, quantity);
    if (isAuthenticated) {
      if (!id) {
        console.error("Cannot update quantity: Missing item ID");
        return;
      }
      try {
        await updateCartItemMut({ productId: id, quantity: validQuantity }).unwrap();
      } catch (err) {
        // Error handled by useApiError hook
      }
    } else {
      setLocalCartItems((prev: CartItem[]) => prev.map(i => i.id === id ? { ...i, quantity: validQuantity } : i));
    }
  }, [isAuthenticated, updateCartItemMut]);

  const clearCart = React.useCallback(async () => {
    if (isAuthenticated) {
      try {
        await clearCartMut().unwrap();
      } catch (err) {
        // Error handled by useApiError hook
      }
    } else {
      setLocalCartItems([]);
    }
  }, [isAuthenticated, clearCartMut]);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
