"use client";

import React from "react";
import Modal from "./Modal";
import { Button } from "../Button";
import { Icon } from "../Icon";

interface RemoveItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productTitle?: string;
}

export const RemoveItemModal: React.FC<RemoveItemModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  productTitle,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title="Remove from Wishlist"
    >
      <div className="flex flex-col items-center text-center gap-6 py-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
          <Icon name="delete_outline" size="lg" />
        </div>
        
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-gray-900">Remove this item?</h3>
          <p className="text-sm text-gray-500 leading-relaxed px-4">
            Are you sure you want to remove <span className="font-bold text-gray-700">"{productTitle}"</span> from your wishlist?
          </p>
        </div>

        <div className="flex flex-col w-full gap-3 mt-2">
          <Button 
            className="w-full h-12 font-bold bg-red-500 hover:bg-red-600 text-white border-transparent" 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Remove Item
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
