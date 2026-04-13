"use client";

import React from "react";
import Modal from "./Modal";
import { Button } from "../Button";
import { Icon } from "../Icon";

interface ClearWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

export const ClearWishlistModal: React.FC<ClearWishlistModalProps> = ({
  isOpen,
  onClose,
  onClear,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title="Clear Wishlist"
    >
      <div className="flex flex-col items-center text-center gap-6 py-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
          <Icon name="delete_outline" size="lg" />
        </div>
        
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-gray-900">Are you sure?</h3>
          <p className="text-sm text-gray-500 leading-relaxed px-4">
            This will permanently remove all items from your wishlist. This action cannot be undone.
          </p>
        </div>

        <div className="flex flex-col w-full gap-3 mt-2">
          <Button 
            className="w-full h-12 font-bold bg-red-500 hover:bg-red-600 text-white border-transparent" 
            onClick={() => {
              onClear();
              onClose();
            }}
          >
            Clear All Items
          </Button>
          <Button 
            variant="ghost"
            className="w-full h-10 font-bold text-gray-500 hover:text-gray-700" 
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
