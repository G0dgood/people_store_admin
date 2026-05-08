import React from "react";
import { Icon } from "../Icon";

interface ListingSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const ListingSearch: React.FC<ListingSearchProps> = ({
  value,
  onChange,
  placeholder = "Refine collection...",
  className = "",
}) => {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon
          name="search"
          size="xs"
          className={`transition-colors ${value ? "text-brand-gold" : "text-gray-300 group-hover:text-brand-gold"}`}
        />
      </div>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-10 pl-10 pr-4 text-[10px] font-bold tracking-[0.2em] text-gray-900 placeholder:text-gray-300 focus:bg-white focus:border-brand-gold outline-none transition-all w-70 border ${value ? "border-brand-gold bg-white" : "border-gray-200 bg-gray-50"
          }`}
      />
    </div>
  );
};
