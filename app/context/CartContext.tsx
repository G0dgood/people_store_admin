"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  title: string;
  price: string;
  image: string;
  quantity: number;
  meta?: {
    size?: string;
    color?: string;
    material?: string;
    seller?: string;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart_items");

    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    } else {
      // Seed with initial hardcoded data if empty
      setCartItems([
        {
          id: "c1",
          title: "T-shirts with multiple colors, for men and boy",
          price: "₦78.99",
          image: "/images/shirt.jpg",
          quantity: 1,
          meta: { size: "Medium", color: "Blue", material: "Cotton", seller: "Artel Market" }
        },
        {
          id: "c2",
          title: "Leather bag for travel and for men",
          price: "₦39.00",
          image: "/images/bag.jpg",
          quantity: 1,
          meta: { size: "Large", color: "Black", material: "Leather", seller: "Best Buy" }
        },
        {
          id: "c3",
          title: "Canon camera black, 100x zoom",
          price: "₦170.00",
          image: "/images/camera.jpg",
          quantity: 1,
          meta: { size: "Small", color: "Black", material: "Plastic", seller: "Photo Max" }
        }
      ]);
    }
    
    setIsInitialized(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart_items", JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i));
  };

  const clearCart = () => {
    setCartItems([]);
  };

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
