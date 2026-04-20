"use client";

import React, { useState } from "react";
import { Input, Textarea } from "./Inputs";
import { 
  HiMagnifyingGlass, 
  HiXMark, 
  HiChevronLeft, 
  HiChevronRight,
  HiPlus,
  HiMinus
} from "react-icons/hi2";
import { 
  MdFormatBold, 
  MdFormatItalic, 
  MdInsertLink, 
  MdFormatQuote, 
  MdCode, 
  MdImage, 
  MdFormatListBulleted, 
  MdFormatListNumbered 
} from "react-icons/md";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  showClear?: boolean;
  iconPosition?: "left" | "right";
  containerClassName?: string;
  shape?: "rounded" | "rounded-sm" | "pill";
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  onClear, 
  showClear, 
  value, 
  iconPosition = "left",
  containerClassName = "",
  className = "",
  shape = "rounded",
  ...props 
}) => {
  const icon = <HiMagnifyingGlass className="w-4 h-4 text-gray-400" />;
  
  return (
    <Input
      prefixElement={iconPosition === "left" ? icon : undefined}
      suffixElement={
        <div className="flex items-center gap-2">
          {iconPosition === "right" && icon}
          {(showClear || (value && String(value).length > 0)) && (
            <button onClick={onClear} className="hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
              <HiXMark className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      }
      value={value}
      containerClassName={containerClassName}
      className={className}
      shape={shape}
      {...props}
    />
  );
};

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  shape?: "rounded" | "rounded-sm" | "pill";
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className = "",
  shape = "rounded",
}) => {
  const shapes = {
    rounded: "rounded-none",
    "rounded-sm": "rounded-sm",
    pill: "rounded-full",
  };

  return (
    <div className={`flex items-center border border-gray-200 ${shapes[shape]} bg-white overflow-hidden w-fit ${className}`}>
      <button
        onClick={() => onChange(Math.max(min, value - step))}
        className="px-4 py-2 text-brand-blue hover:bg-gray-50 transition-colors border-r border-gray-200 disabled:opacity-30"
        disabled={value <= min}
      >
        <HiMinus className="w-3 h-3" />
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-16 text-center text-sm font-semibold text-gray-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        onClick={() => onChange(Math.min(max, value + step))}
        className="px-4 py-2 text-brand-blue hover:bg-gray-50 transition-colors border-l border-gray-200 disabled:opacity-30"
        disabled={value >= max}
      >
        <HiPlus className="w-3 h-3" />
      </button>
    </div>
  );
};

interface RichTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  shape?: "rounded" | "rounded-sm" | "pill";
}

const RichTextArea: React.FC<RichTextAreaProps> = ({ label, shape = "rounded", ...props }) => {
  const shapes = {
    rounded: "rounded-none",
    "rounded-sm": "rounded-sm",
    pill: "rounded-full",
  };

  const toolbarShapes = {
    rounded: "rounded-none",
    "rounded-sm": "rounded-sm",
    pill: "rounded-t-2xl",
  };
  const toolbarIcons = [
    { icon: MdFormatBold, label: "Bold" },
    { icon: MdFormatItalic, label: "Italic" },
    { icon: MdInsertLink, label: "Link" },
    { icon: MdFormatQuote, label: "Quote" },
    { icon: MdCode, label: "Code" },
    { icon: MdImage, label: "Image" },
    { icon: MdFormatListBulleted, label: "List" },
    { icon: MdFormatListNumbered, label: "Ordered List" },
  ];

  return (
    <div className={`flex flex-col border border-gray-200 ${shapes[shape]} overflow-hidden bg-white focus-within:ring-4 focus-within:ring-brand-blue/5 focus-within:border-brand-blue transition-all`}>
      <div className={`flex items-center gap-1 p-1.5 border-b border-gray-200 bg-gray-50/30 ${toolbarShapes[shape]}`}>
        {toolbarIcons.map((item, index) => (
          <button
            key={index}
            type="button"
            className="p-2 rounded-md text-gray-500 hover:text-brand-blue hover:bg-brand-blue/10 transition-all"
            title={item.label}
          >
            <item.icon className="w-4 h-4" />
          </button>
        ))}
      </div>
      <Textarea
        className="border-none rounded-none focus:ring-0 min-h-[140px] px-4 py-3 text-[13px] leading-relaxed"
        shape="rounded"
        {...props}
      />
    </div>
  );
};

export { SearchInput, NumberInput, RichTextArea };
