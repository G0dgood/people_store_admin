"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { Icon } from "../Icon";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal";
  label?: string;
  required?: boolean;
  getOptionDotColor?: (option: DropdownOption) => string | undefined;
  searchable?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = "",
  disabled = false,
  className = "",
  size = "md",
  variant = "minimal",
  label,
  required = false,
  getOptionDotColor,
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownId = useId();

  // Reset search term when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    } else if (searchable && searchInputRef.current) {
      // Auto focus search input when opening
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [isOpen, searchable]);

  const filteredOptions = searchable
    ? options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : options;

  const selectedOption = options.find((option) => option.value === value);
  const selectedDotColor =
    selectedOption && getOptionDotColor
      ? getOptionDotColor(selectedOption)
      : undefined;

  const sizeClasses = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-5 text-base",
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionSelect = (optionValue: string) => {
    if (onChange) {
      onChange(optionValue);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        setIsOpen(!isOpen);
        break;
      case "Escape":
        setIsOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
    }
  };

  // Base styles for the dropdown trigger
  const getTriggerClasses = () => {
    const baseClasses =
      "flex items-center justify-between cursor-pointer transition-all duration-200 outline-none";
    const sizeClass = sizeClasses[size];
    const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";

    if (variant === "minimal") {
      return `${baseClasses} ${sizeClass} ${disabledClass} bg-neutral-50 border border-neutral-200 rounded-[6px] hover:bg-neutral-100 focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold`;
    } else {
      return `${baseClasses} ${sizeClass} ${disabledClass} bg-white border border-neutral-300 rounded-[6px] hover:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold`;
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block md:text-[12px] text-[10px] !font-light !text-[#1F1F1F] mb-2">
          {label}
          {required && (
            <span className="text-brand-gold ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative" ref={dropdownRef}>
        <div
          className={`${getTriggerClasses()} w-full`}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={`dropdown-${dropdownId}`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`font-work font-normal text-[12px] leading-[23px]   ${selectedOption ? "!text-[#1F1F1F]" : "text-[rgba(31,31,31,0.5)]"
                }`}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            {selectedDotColor && (
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: selectedDotColor }}
              />
            )}
          </div>

          <div
            className={`ml-2 transition-transform duration-200 ${isOpen ? "-rotate-180" : "rotate-0"
              }`}
          >
            <Icon name="expand_more" size="sm" className="text-gray-400" />
          </div>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-[6px] shadow-lg z-50 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
            {searchable && (
              <div className="sticky top-0 bg-white p-2 border-b border-neutral-100 z-10">
                <input
                  ref={searchInputRef}
                  type="text"
                  className="w-full h-8 px-2 text-[10px] md:text-[12px] text-[#1F1F1F] placeholder:text-[rgba(31,31,31,0.5)] bg-neutral-50 border border-neutral-200 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-brand-gold/20 focus:border-brand-gold"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            {filteredOptions?.length === 0 ? (
              <div className="px-4 py-3 text-center text-[10px] md:text-[12px] text-neutral-400 italic">
                No results found
              </div>
            ) : (
              <div className="py-1">
                {filteredOptions?.map((option) => (
                  <div
                    key={option.value}
                    className="px-4 py-2 hover:bg-neutral-50 cursor-pointer text-[10px] md:text-[12px] leading-[23px] tracking-[-0.02em] text-[#1F1F1F] transition-colors"
                    onClick={() => handleOptionSelect(option.value)}
                    role="option"
                    aria-selected={value === option.value}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={
                          value === option.value
                            ? "text-brand-gold font-bold"
                            : ""
                        }
                      >
                        {option.label}
                      </span>
                      {getOptionDotColor && getOptionDotColor(option) && (
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: getOptionDotColor(option) }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
