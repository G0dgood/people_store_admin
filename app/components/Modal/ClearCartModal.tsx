"use client";

import React from "react";
import Modal from "./Modal";
import { Button } from "../Button";
import { Icon } from "../Icon";

interface ClearCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

export const ClearCartModal: React.FC<ClearCartModalProps> = ({
  isOpen,
  onClose,
  onClear,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title="Clear Cart"
    >
      <div className="flex flex-col items-center text-center gap-6 py-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 shadow-sm border border-red-100">
          <Icon name="delete_outline" size="lg" />
        </div>
        
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-black text-gray-900 leading-tight">Clear your cart?</h3>
          <p className="text-sm text-gray-500 font-medium leading-relaxed px-4">
            Are you sure you want to remove all items from your cart? This action cannot be undone.
          </p>
        </div>

        <div className="flex flex-col w-full gap-3 mt-4">
          <Button 
            className="w-full h-12 font-black bg-red-500 hover:bg-red-600 text-white border-transparent shadow-lg shadow-red-100 hover:translate-y-[-1px] transition-all active:scale-95" 
            onClick={() => {
              onClear();
              onClose();
            }}
          >
            Yes, clear all items
          </Button>
          <Button 
            variant="ghost"
            className="w-full h-10 font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50" 
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
