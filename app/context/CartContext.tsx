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
import { useValidateCouponMutation } from "@/lib/redux/services/boutiqueApi";
import { useSocket } from "./SocketContext";
import { toast } from "../utils/toastWithSound";

export interface CartItem {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
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
  stock?: number;
  isUnlimited?: boolean;
}

export interface Coupon {
  _id: string;
  code: string;
  discount: string;
  type: "Percentage" | "Fixed Rate" | "Shipping";
  minAmount?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  isLoading: boolean;
  appliedCoupon: Coupon | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [localCartItems, setLocalCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const { isAuthenticated } = useCustomerAuth();

  const { data: backendCartData, refetch, isLoading: isBackendLoading } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const [syncCart, { isError: isSyncError, error: syncError }] = useSyncCartMutation();
  const [addToCartMut, { isError: isAddError, error: addError }] = useAddToCartMutation();
  const [updateCartItemMut, { isError: isUpdateError, error: updateError }] = useUpdateCartItemMutation();
  const [removeFromCartMut, { isError: isRemoveError, error: removeError }] = useRemoveFromCartMutation();
  const [clearCartMut, { isError: isClearError, error: clearError }] = useClearCartMutation();
  const [validateCouponMut] = useValidateCouponMutation();

  const { on, off } = useSocket();

  useEffect(() => {
    const handleProductUpdate = () => {
      if (isAuthenticated) {
        refetch();
      }
    };

    on("PRODUCT_UPDATED", handleProductUpdate);
    on("cart_updated", handleProductUpdate);
    return () => {
      off("PRODUCT_UPDATED", handleProductUpdate);
      off("cart_updated", handleProductUpdate);
    };
  }, [on, off, isAuthenticated, refetch]);

  useApiError(isSyncError, syncError, "Failed to sync cart", { hideInAdmin: true });
  useApiError(isAddError, addError, "Failed to add to cart", { hideInAdmin: true });
  useApiError(isUpdateError, updateError, "Failed to update quantity", { hideInAdmin: true });
  useApiError(isRemoveError, removeError, "Failed to remove from cart", { hideInAdmin: true });
  useApiError(isClearError, clearError, "Failed to clear cart", { hideInAdmin: true });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart_items");
      if (savedCart) {
        setLocalCartItems(JSON.parse(savedCart));
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    const performSync = async () => {
      if (isAuthenticated && isInitialized && typeof window !== "undefined") {
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

  useEffect(() => {
    if (isInitialized && !isAuthenticated && typeof window !== "undefined") {
      localStorage.setItem("cart_items", JSON.stringify(localCartItems));
    }
  }, [localCartItems, isInitialized, isAuthenticated]);

  const cartItems: CartItem[] = isAuthenticated && backendCartData?.data?.items
    ? backendCartData.data.items.map((item: any) => {
      const itemData = item.item;
      const isPopulated = typeof itemData === "object" && itemData !== null;

      return {
        id: isPopulated ? (itemData._id || itemData.id) : (itemData || item._id),
        title: isPopulated ? (itemData.name || itemData.title) : (item.itemType === "GiftBox" ? "Gift Box" : "Unknown Item"),
        price: String(isPopulated ? (itemData.price || 0) : 0),
        originalPrice: isPopulated && itemData.discountPrice ? String(itemData.discountPrice) : undefined,
        image: isPopulated ? (itemData.productImage || itemData.image || "") : "",
        sku: item.sku,
        variant: item.variant,
        quantity: item.quantity,
        meta: item.meta,
        itemType: item.itemType,
        stock: isPopulated ? (itemData.stock || 0) : 0,
        isUnlimited: isPopulated ? itemData.isUnlimited : false
      };
    })
    : localCartItems;

  const addToCart = React.useCallback(async (item: Omit<CartItem, "quantity">) => {
    const isOutOfStock = !item.isUnlimited && item.stock !== undefined && item.stock <= 0;
    if (isOutOfStock) {
      toast.error("This magnificent piece is currently out of stock");
      return;
    }

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
          if (!item.isUnlimited && item.stock !== undefined && existing.quantity >= item.stock) {
            toast.info("Maximum artisanal selection reached");
            return prev;
          }
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

    const item = cartItems.find(i => i.id === id);
    if (item && !item.isUnlimited && item.stock !== undefined && validQuantity > item.stock) {
      toast.info(`Only ${item.stock} pieces of this artisanal collection remain`);
      return;
    }

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
  }, [isAuthenticated, updateCartItemMut, cartItems]);

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
    setAppliedCoupon(null);
  }, [isAuthenticated, clearCartMut]);

  const applyCoupon = async (code: string) => {
    const subtotal = cartItems.reduce((acc, item) => {
      const p = parseFloat(String(item.price).replace(/[₦$,]/g, ""));
      return acc + (isNaN(p) ? 0 : p) * item.quantity;
    }, 0);

    try {
      const result = await validateCouponMut({ code, subtotal }).unwrap();
      setAppliedCoupon(result.data);
    } catch (err: any) {
      throw err;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
      isLoading: !isInitialized || (isAuthenticated && isBackendLoading),
      appliedCoupon
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
