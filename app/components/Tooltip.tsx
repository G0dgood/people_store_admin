"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  text,
  children,
  position = "top",
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-gray-900",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-gray-900",
    left: "left-full top-1/2 -translate-y-1/2 border-l-gray-900",
    right: "right-full top-1/2 -translate-y-1/2 border-r-gray-900",
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === "top" ? 5 : position === "bottom" ? -5 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: position === "top" ? 5 : position === "bottom" ? -5 : 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute z-[9999] px-2.5 py-1.5 bg-gray-900/95 backdrop-blur-sm text-white text-[10px] font-bold rounded-[4px] whitespace-nowrap pointer-events-none shadow-xl ${positionClasses[position]}`}
          >
            {text}
            <div
              className={`absolute border-4 border-transparent ${arrowClasses[position]}`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
