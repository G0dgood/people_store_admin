import React from "react";
import { Icon } from "../Icon";

interface FilterTagProps {
  label: string;
  onRemove: () => void;
  className?: string;
}

export const FilterTag: React.FC<FilterTagProps> = ({ label, onRemove, className = "" }) => (
  <div
    onClick={onRemove}
    className={`flex items-center gap-3 px-4 py-2 border border-gray-200 bg-white cursor-pointer hover:border-brand-gold transition-all duration-300 group ${className}`}
  >
    <span className="text-[10px] font-bold tracking-widest text-gray-600 group-hover:text-gray-900">{label}</span>
    <Icon name="close" size="sm" className="text-gray-300 group-hover:text-brand-gold" />
  </div>
);
