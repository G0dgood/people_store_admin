"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import ModalHeader from "./ModalHeader";
import { motion, AnimatePresence } from "framer-motion";

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
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, mounted]);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    normal: "max-w-lg",
    large: "max-w-2xl",
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center px-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative bg-white rounded-2xl text-left overflow-hidden shadow-2xl ${sizeClasses[size]} w-full md:w-[60%] z-50 max-h-[85vh] flex flex-col`}
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

            <div className="px-8 py-6 overflow-y-auto flex-1">{children}</div>

            {footer && (
              <div className="px-8 py-6 bg-white border-t border-gray-50">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}
