"use client";

import React from "react";
import Modal from "../Modal/Modal";
import { Button } from "../Button";
import { HiOutlineExclamationTriangle, HiOutlineCheckCircle, HiOutlineInformationCircle, HiOutlineQuestionMarkCircle } from "react-icons/hi2";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "success" | "info";
  icon?: React.ReactNode;
  isLoading?: boolean;
  children?: React.ReactNode;
}

// Internal icon renderer for the modal
const ModalIcon = ({ icon, config }: { icon: React.ReactNode, config: any }) => {
  return (
    <div className={`w-16 h-16 ${config.iconBg} rounded-[20px] flex items-center justify-center ${config.iconColor} shadow-sm border border-current flex-shrink-0 mb-2 relative overflow-hidden`}>
      <div className="absolute inset-0 bg-current opacity-10"></div>
      <div className="relative z-10 flex items-center justify-center">
        {icon || config.icon}
      </div>
    </div>
  );
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  icon,
  isLoading = false,
  children,
}) => {
  const typeConfig = {
    danger: {
      icon: <HiOutlineExclamationTriangle size={28} />,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      buttonBg: "bg-red-600 hover:bg-red-700",
      shadow: "shadow-red-100",
    },
    warning: {
      icon: <HiOutlineExclamationTriangle size={28} />,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      buttonBg: "bg-amber-600 hover:bg-amber-700",
      shadow: "shadow-amber-100",
    },
    success: {
      icon: <HiOutlineCheckCircle size={28} />,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      buttonBg: "bg-emerald-600 hover:bg-emerald-700",
      shadow: "shadow-emerald-100",
    },
    info: {
      icon: <HiOutlineInformationCircle size={28} />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
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
        <ModalIcon icon={icon} config={config} />

        <div className="flex flex-col gap-2 mt-2">
          <h3 className="text-lg sm:text-xl font-black text-gray-900 leading-tight">{title}</h3>
          <p className="text-[13px] sm:text-sm text-gray-500 font-medium leading-relaxed px-4">
            {message}
          </p>
        </div>

        {children && (
          <div className="w-full px-4 mt-2 text-left">
            {children}
          </div>
        )}

        <div className="flex flex-row justify-end w-full gap-3 mt-4">
          <Button
            variant="ghost"
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            shape="rounded-sm"
            className={` ${config.shadow} transition-all active:scale-95 ${config.buttonBg}`}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
