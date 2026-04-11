"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "../Icon";
import { Tag } from "./Tag";

interface Option {
  id: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  isMulti?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select",
  isMulti = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    if (isMulti) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValue = currentValues.includes(option.id)
        ? currentValues.filter((v) => v !== option.id)
        : [...currentValues, option.id];
      onChange?.(newValue);
    } else {
      onChange?.(option.id);
      setIsOpen(false);
    }
  };

  const selectedOptions = isMulti
    ? options.filter((o) => (value as string[])?.includes(o.id))
    : options.find((o) => o.id === value);

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <div
        role="combobox"
        aria-expanded={isOpen}
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={`
          flex items-center justify-between w-full bg-white border rounded-md py-2.5 px-4 text-sm transition-all cursor-pointer outline-none
          ${isOpen ? "border-brand-blue ring-2 ring-brand-blue/20" : "border-gray-200 hover:border-gray-300"}
        `}
      >
        <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
          {isMulti && Array.isArray(selectedOptions) ? (
            selectedOptions.length > 0 ? (
              selectedOptions.map((opt) => (
                <Tag
                  key={opt.id}
                  label={opt.label}
                  onRemove={() => handleSelect(opt)}
                />
              ))
            ) : (
              <span className="text-gray-400 truncate">{placeholder}</span>
            )
          ) : (
            <span className={`${selectedOptions ? "text-gray-900" : "text-gray-400"} truncate`}>
              {(selectedOptions as Option)?.label || placeholder}
            </span>
          )}
        </div>
        <Icon 
          name="expand_more" 
          size="sm" 
          className={`ml-2 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} 
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1.5 bg-white border border-gray-100 rounded-md shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="max-h-60 overflow-y-auto py-1">
            {options.map((option) => {
              const isSelected = isMulti
                ? (value as string[])?.includes(option.id)
                : value === option.id;

              return (
                <li key={option.id}>
                  <button
                    onClick={() => handleSelect(option)}
                    className={`
                      w-full text-left px-4 py-2.5 text-sm transition-colors
                      ${isSelected ? "bg-brand-blue-light text-brand-blue font-semibold" : "text-gray-700 hover:bg-gray-50"}
                    `}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export { Select };
