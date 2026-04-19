"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "../Icon";
import { Tag } from "./Tag";

interface Option {
  value: string;
  label: string;
}

interface SelectProps<T extends boolean = false> {
  options: Option[];
  value?: T extends true ? string[] : string;
  onChange?: (value: T extends true ? string[] : string) => void;
  placeholder?: string;
  isMulti?: T;
  className?: string;
}

export const Select = <T extends boolean = false>({
  options,
  value,
  onChange,
  placeholder = "Select",
  isMulti = false as T,
  className = "",
}: SelectProps<T>) => {
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
      const currentValues = Array.isArray(value) ? (value as string[]) : [];
      const newValue = currentValues.includes(option.value)
        ? currentValues.filter((v) => v !== option.value)
        : [...currentValues, option.value];
      onChange?.(newValue as any);
    } else {
      onChange?.(option.value as any);
      setIsOpen(false);
    }
  };

  const selectedOptions = isMulti
    ? options.filter((o) => (value as string[])?.includes(o.value))
    : options.find((o) => o.value === value);

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
          flex items-center justify-between w-full bg-white border rounded-[6px] py-2.5 px-4 text-sm transition-all cursor-pointer outline-none
          ${isOpen ? "border-brand-blue ring-2 ring-brand-blue/20" : "border-gray-200 hover:border-gray-300"}
        `}
      >
        <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
          {isMulti && Array.isArray(selectedOptions) ? (
            selectedOptions.length > 0 ? (
              selectedOptions.map((opt) => (
                <Tag
                  key={opt.value}
                  label={opt.label}
                  onRemove={() => handleSelect(opt)}
                />
              ))
            ) : (
              <span className="text-gray-400 truncate">{placeholder}</span>
            )
          ) : (
            <span className={`${selectedOptions ? "text-gray-900 font-bold" : "text-gray-400"} truncate`}>
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
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-[6px] shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="max-h-60 overflow-y-auto">
            {options.map((option) => {
              const isSelected = isMulti
                ? (value as string[])?.includes(option.value)
                : value === option.value;

              return (
                <li key={option.value}>
                  <button
                    onClick={() => handleSelect(option)}
                    className={`
                      w-full text-left px-4 py-3 text-sm transition-colors
                      ${isSelected ? "bg-brand-blue-light text-brand-blue font-black" : "text-gray-700 hover:bg-gray-50"}
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
