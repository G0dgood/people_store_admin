"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string;
  rightElement?: React.ReactNode;
}

export default function Drawer({
  isOpen,
  onClose,
  title,
  children,
  width = "max-w-md",
  rightElement,
}: DrawerProps) {
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

  const drawerContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-9999 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`relative bg-white h-full shadow-2xl z-50 flex flex-col ${width} w-full`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-[18px] font-black text-[#1D3557]">{title}</h3>
              <div className="flex items-center gap-3">
                {rightElement && rightElement}
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-all active:scale-95"
                >
                  <IoMdClose size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-8">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(drawerContent, document.body);
}
