"use client";

import React from "react";
import { Icon } from "../Icon";
import { Checkbox } from "../Form";

interface DropdownItemProps {
  label: string;
  subtext?: string;
  icon?: string;
  showCheckbox?: boolean;
  checked?: boolean;
  onSelect?: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
  hasSubmenu?: boolean;
  className?: string;
}

const DropdownItem: React.FC<DropdownItemProps> = ({
  label,
  subtext,
  icon,
  showCheckbox = false,
  checked = false,
  onSelect,
  isActive = false,
  isDisabled = false,
  hasSubmenu = false,
  className = "",
}) => {
  return (
    <div
      onClick={!isDisabled ? onSelect : undefined}
      className={`
        flex items-center gap-3 px-4 py-2.5 transition-all cursor-pointer
        ${isDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50"}
        ${isActive ? "bg-brand-blue-light text-brand-blue" : "text-gray-700"}
        ${className}
      `}
    >
      {showCheckbox && (
        <Checkbox 
          checked={checked} 
          onChange={(e) => {
            e.stopPropagation();
            onSelect?.();
          }} 
          className="pointer-events-none"
        />
      )}
      
      {icon && (
        <Icon 
          name={icon} 
          size="sm" 
          className={isActive ? "text-brand-blue" : "text-gray-400"} 
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <span className={`text-sm ${isActive ? "font-bold" : "font-medium"} truncate`}>
          {label}
        </span>
        {subtext && (
          <span className="text-[10px] text-gray-400 font-medium truncate">
            {subtext}
          </span>
        )}
      </div>

      {hasSubmenu && (
        <Icon name="chevron_right" size="xs" className="text-gray-400 ml-2" />
      )}
    </div>
  );
};

interface DropdownMenuProps {
  children: React.ReactNode;
  className?: string;
  width?: string | number;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ 
  children, 
  className = "",
  width = "auto"
}) => {
  return (
    <div 
      className={`bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden py-1 ${className}`}
      style={{ width }}
    >
      {children}
    </div>
  );
};

interface DropdownSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}

const DropdownSearch: React.FC<DropdownSearchProps> = ({
  value,
  onChange,
  onClear,
  placeholder = "Search",
  className = "",
}) => {
  return (
    <div className={`p-2 border-b border-gray-100 ${className}`}>
      <div className="relative flex items-center">
        <Icon name="search" size="xs" className="absolute left-3 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white border border-gray-100 rounded py-2 pl-9 pr-3 text-sm placeholder:text-gray-400 outline-none focus:border-brand-blue transition-colors"
        />
        {value && onClear && (
          <button 
            onClick={onClear}
            className="absolute right-3 p-0.5 hover:bg-gray-100 rounded text-gray-400"
          >
            <Icon name="clear" size="xs" />
          </button>
        )}
      </div>
    </div>
  );
};

interface DropdownFooterActionProps {
  label: string;
  onClick: () => void;
  icon?: string;
  className?: string;
}

const DropdownFooterAction: React.FC<DropdownFooterActionProps> = ({
  label,
  onClick,
  icon = "add",
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 w-full px-4 py-3 text-sm font-bold text-brand-blue bg-gray-50/50 border-t border-gray-100 hover:bg-gray-100 transition-all ${className}`}
    >
      <Icon name={icon} size="xs" />
      {label}
    </button>
  );
};

const DropdownEmptyState: React.FC<{ message?: string }> = ({ 
  message = "Not found" 
}) => (
  <div className="px-4 py-4 text-sm text-gray-400 font-medium">
    {message}
  </div>
);

export { DropdownMenu, DropdownItem, DropdownSearch, DropdownFooterAction, DropdownEmptyState };
