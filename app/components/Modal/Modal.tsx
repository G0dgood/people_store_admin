"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import ModalHeader from "./ModalHeader";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "normal" | "large";
  footer?: React.ReactNode;
  className?: string;
  hideHeaderBorder?: boolean;
  header?: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  footer,
  className = "",
  hideHeaderBorder = true,
  header,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    normal: "max-w-lg",
    large: "max-w-2xl",
  };

  const modalContent = (
    <div className="fixed inset-0 z-9999 flex items-center justify-center px-4">
      <div
        className="fixed inset-0 bg-[#00000051] bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      <div
        className={`relative bg-white rounded-2xl text-left overflow-hidden shadow-xl ${sizeClasses[size]} w-full md:w-[60%] z-9990 max-h-[80vh] flex flex-col`}
      >
        {header ? (
          header
        ) : (
          <ModalHeader
            title={title || ""}
            onClose={onClose}
            className={className}
            hideBorder={hideHeaderBorder}
          />
        )}

        <div className="px-6 py-4 overflow-y-auto flex-1">{children}</div>

        {footer && (
          <div className="px-6 py-4 bg-white">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
