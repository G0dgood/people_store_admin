"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "./Button";
import { Icon } from "../Icon";

interface DropdownItem {
  label: string;
  onClick?: () => void;
  icon?: string;
}

interface ButtonDropdownProps {
  label: string;
  items: DropdownItem[];
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  shape?: "rounded" | "pill";
}

const ButtonDropdown: React.FC<ButtonDropdownProps> = ({
  label,
  items,
  variant = "primary",
  size = "md",
  shape = "rounded",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <Button
        variant={variant}
        size={size}
        shape={shape}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        showChevron={true}
      >
        {label}
      </Button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                {item.icon && <Icon name={item.icon} size="sm" className="mr-3 text-gray-400" />}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { ButtonDropdown };
