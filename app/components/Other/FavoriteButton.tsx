"use client";

import React from "react";
import { Icon } from "../Icon";
import { useWishlist, WishlistItem } from "@/app/context/WishlistContext";

interface FavoriteButtonProps {
  className?: string;
  item?: WishlistItem;
  onToggle?: (isFavorite: boolean) => void;
  variant?: "outline" | "ghost" | "none";
  size?: "sm" | "md";
  children?: React.ReactNode;
  showIcon?: boolean;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  className = "",
  item,
  onToggle,
  variant = "outline",
  size = "md",
  children,
  showIcon = true,
}) => {
  const { wishlistItems, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const isFavorite = item ? isInWishlist(item.id) : false;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!item) return;

    if (isFavorite) {
      removeFromWishlist(item.id);
      if (onToggle) onToggle(false);
    } else {
      addToWishlist(item);
      if (onToggle) onToggle(true);
    }
  };

  const baseStyles = "transition-all duration-200 flex items-center justify-center cursor-pointer";

  const variants = {
    outline: "border border-gray-200 hover:text-red-500 hover:border-red-500 bg-white",
    ghost: "text-gray-400 hover:text-red-500",
    none: "",
  };

  const sizes = {
    sm: "w-8 h-8",
    md: "w-9 h-9",
  };

  const combinedClassName = `
    ${baseStyles} 
    ${variant === "outline" ? variants.outline : variant === "ghost" ? variants.ghost : variants.none} 
    ${variant === "outline" ? sizes[size] : ""} 
    ${isFavorite ? "text-red-500 border-red-200 bg-red-50" : ""} 
    ${className}
  `.trim();

  return (
    <button className={combinedClassName} onClick={handleToggle} type="button">
      {showIcon && (
        <Icon
          name={isFavorite ? "favorite" : "favorite_border"}
          size={size === "sm" ? "xs" : "sm"}
          className={isFavorite ? "fill-current" : ""}
        />
      )}
      {children}
    </button>
  );
};
