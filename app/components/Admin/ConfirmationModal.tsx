"use client";

import React from "react";
import Modal from "../Modal/Modal";
import { Button } from "../Button";
import { Icon } from "../Icon";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "success" | "info";
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
}) => {
  const typeConfig = {
    danger: {
      icon: "delete_outline",
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      buttonBg: "bg-red-500 hover:bg-red-600",
      shadow: "shadow-red-100",
    },
    warning: {
      icon: "warning_amber",
      iconBg: "bg-orange-50",
      iconColor: "text-brand-orange",
      buttonBg: "bg-brand-orange hover:bg-orange-600",
      shadow: "shadow-orange-100",
    },
    success: {
      icon: "check_circle",
      iconBg: "bg-brand-blue-light",
      iconColor: "text-brand-blue",
      buttonBg: "bg-brand-blue hover:bg-blue-600",
      shadow: "shadow-blue-100",
    },
    info: {
      icon: "info",
      iconBg: "bg-brand-blue-light",
      iconColor: "text-brand-blue",
      buttonBg: "bg-brand-blue hover:bg-blue-600",
      shadow: "shadow-blue-100",
    },
  };

  const config = typeConfig[type];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title={title}
    >
      <div className="flex flex-col items-center text-center gap-6 py-4">
        <div className={`w-16 h-16 ${config.iconBg} rounded-[20px] flex items-center justify-center ${config.iconColor} shadow-sm border border-current flex-shrink-0 mb-2 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-current opacity-10"></div>
          <Icon name={config.icon} size="lg" className="relative z-10" />
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <h3 className="text-xl font-black text-gray-900 leading-tight">{title}</h3>
          <p className="text-sm text-gray-500 font-medium leading-relaxed px-4">
            {message}
          </p>
        </div>

        <div className="flex flex-col w-full gap-3 mt-4">
          <Button
            className={`w-full h-12 font-black text-white border-transparent shadow-lg ${config.shadow} transition-all active:scale-95 ${config.buttonBg}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
          <Button
            variant="ghost"
            className="w-full h-12 font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            onClick={onClose}
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
