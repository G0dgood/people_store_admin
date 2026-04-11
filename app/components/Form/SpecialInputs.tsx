"use client";

import React, { useState } from "react";
import { Input, Textarea } from "./Inputs";
import { Icon } from "../Icon";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  showClear?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({ onClear, showClear, value, ...props }) => {
  return (
    <Input
      prefixElement={<Icon name="search" size="sm" className="text-gray-400" />}
      suffixElement={
        (showClear || (value && String(value).length > 0)) ? (
          <button onClick={onClear} className="hover:text-gray-600 transition-colors">
            <Icon name="clear" size="sm" className="text-gray-400" />
          </button>
        ) : undefined
      }
      value={value}
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
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className = "",
}) => {
  return (
    <div className={`flex items-center border border-gray-200 rounded-md bg-white overflow-hidden w-fit ${className}`}>
      <button
        onClick={() => onChange(Math.max(min, value - step))}
        className="px-4 py-2 text-brand-blue hover:bg-gray-50 transition-colors border-r border-gray-100 disabled:opacity-30"
        disabled={value <= min}
      >
        <Icon name="remove" size="xs" />
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-16 text-center text-sm font-semibold text-gray-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        onClick={() => onChange(Math.min(max, value + step))}
        className="px-4 py-2 text-brand-blue hover:bg-gray-50 transition-colors border-l border-gray-100 disabled:opacity-30"
        disabled={value >= max}
      >
        <Icon name="add" size="xs" />
      </button>
    </div>
  );
};

interface RichTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const RichTextArea: React.FC<RichTextAreaProps> = ({ label, ...props }) => {
  const toolbarIcons = [
    { name: "format_bold", label: "Bold" }, // Placeholder names if not found
    { name: "format_italic", label: "Italic" },
    { name: "link", label: "Link" },
    { name: "create", label: "Quote" },
    { name: "code", label: "Code" },
    { name: "photo", label: "Image" },
    { name: "list", label: "List" },
    { name: "sort", label: "Ordered List" },
  ];

  return (
    <div className="flex flex-col border border-gray-200 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-brand-blue/20 focus-within:border-brand-blue transition-all">
      <div className="flex items-center gap-1 p-2 border-b border-gray-100 bg-gray-50/50">
        {toolbarIcons.map((icon, index) => (
          <button
            key={index}
            type="button"
            className="p-1.5 rounded-md text-gray-600 hover:bg-gray-200 transition-colors"
            title={icon.label}
          >
            <Icon name={icon.name} size="xs" />
          </button>
        ))}
      </div>
      <Textarea
        className="border-none rounded-none focus:ring-0 min-h-[150px]"
        {...props}
      />
    </div>
  );
};

export { SearchInput, NumberInput, RichTextArea };
