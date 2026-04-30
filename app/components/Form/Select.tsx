"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "../Icon";
import { Tag } from "./Tag";

interface Option {
  value: string;
  label: string;
  subLabel?: string;
  image?: string;
  status?: string;
  isCurrent?: boolean;
}

interface SelectProps<T extends boolean = false> {
  options: Option[];
  value?: T extends true ? string[] : string;
  onChange?: (value: T extends true ? string[] : string) => void;
  placeholder?: string;
  isMulti?: T;
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
  shape?: "rounded" | "rounded-sm" | "pill";
}

export const Select = <T extends boolean = false>({
  options,
  value,
  onChange,
  placeholder = "Select",
  isMulti = false as T,
  searchable = false,
  searchPlaceholder = "Search...",
  className = "",
  shape = "rounded",
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const shapes = {
    rounded: "rounded-none",
    "rounded-sm": "rounded-sm",
    pill: "rounded-full",
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    if (option.isCurrent) return;
    if (isMulti) {
      const currentValues = Array.isArray(value) ? (value as string[]) : [];
      const newValue = currentValues.includes(option.value)
        ? currentValues.filter((v) => v !== option.value)
        : [...currentValues, option.value];
      onChange?.(newValue as any);
    } else {
      onChange?.(option.value as any);
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  const filteredOptions = searchable 
    ? options.filter(o => o.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

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
          flex items-center justify-between w-full bg-white border py-2.5 px-4 text-sm transition-all cursor-pointer outline-none
          ${shapes[shape]}
          ${isOpen ? "border-brand-gold ring-2 ring-brand-gold/20" : "border-gray-200 hover:border-gray-300"}
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
            <div className="flex items-center gap-2 truncate">
               {(selectedOptions as Option)?.image && (
                 <img src={(selectedOptions as Option).image} alt="" className="w-5 h-5 rounded-sm object-cover flex-shrink-0" />
               )}
               <span className={`${selectedOptions ? "text-gray-900 font-bold" : "text-gray-400"} truncate`}>
                 {(selectedOptions as Option)?.label || placeholder}
               </span>
               {(selectedOptions as Option)?.status === "Draft" && (
                 <span className="text-[8px] font-black bg-gray-100 text-gray-400 px-1 py-0.5 rounded uppercase ml-1">Draft</span>
               )}
            </div>
          )}
        </div>
        <Icon
          name="expand_more"
          size="sm"
          className={`ml-2 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className={`absolute z-[100] w-full mt-1 bg-white border border-gray-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${shapes[shape]}`}>
          {searchable && (
            <div className="p-2 border-b border-gray-50">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-8 pr-3 py-2 text-xs border border-gray-100 rounded-md outline-none focus:border-brand-gold/30 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                />
                <Icon name="search-01" folder="dashboardIcon" size="xs" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          )}
          <ul className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <li className="px-4 py-6 text-center text-xs font-bold text-gray-300">
                No results found
              </li>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = isMulti
                  ? (value as string[])?.includes(option.value)
                  : value === option.value;

                return (
                  <li key={option.value}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(option);
                      }}
                      className={`
                        w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-3
                        ${isSelected ? "bg-brand-gold/5 text-brand-gold font-black" : "text-gray-700 hover:bg-gray-50"}
                        ${option.isCurrent ? "opacity-50 cursor-not-allowed pointer-events-none grayscale-[0.5]" : ""}
                      `}
                    >
                      {option.image && (
                         <img src={option.image} alt="" className="w-8 h-8 rounded-[4px] object-cover flex-shrink-0 border border-gray-100" />
                      )}
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                           <span className="truncate">{option.label}</span>
                           {option.status === "Draft" && (
                             <span className="text-[8px] font-black bg-gray-100 text-gray-400 px-1 py-0.5 rounded uppercase">Draft</span>
                           )}
                           {option.isCurrent && (
                             <span className="text-[8px] font-black bg-emerald-100 text-emerald-600 px-1 py-0.5 rounded uppercase">Already Added</span>
                           )}
                        </div>
                        {option.subLabel && (
                          <span className="text-[10px] font-bold text-gray-400 mt-0.5 truncate">{option.subLabel}</span>
                        )}
                      </div>
                      {isSelected && isMulti && <Icon name="check" folder="icon" size="xs" className="text-brand-gold" />}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
