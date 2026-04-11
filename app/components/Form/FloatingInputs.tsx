"use client";

import React, { useState } from "react";
import { Icon } from "../Icon";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  prefixElement?: React.ReactNode;
  suffixElement?: React.ReactNode;
  error?: boolean;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, prefixElement, suffixElement, error, className = "", onFocus, onBlur, value, defaultValue, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value !== undefined ? String(value).length > 0 : defaultValue !== undefined ? String(defaultValue).length > 0 : false;

    return (
      <div className="relative mt-2">
        <div className="relative flex items-center">
          {prefixElement && (
            <div className="absolute left-3 flex items-center pointer-events-none">
              {prefixElement}
            </div>
          )}
          <input
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            placeholder=" "
            className={`
              peer w-full bg-white border border-gray-200 rounded-md py-3 px-4 text-sm text-gray-900 
              focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue
              placeholder:opacity-0 focus:placeholder:opacity-100 transition-all duration-200
              ${prefixElement ? "pl-11" : ""}
              ${suffixElement ? "pr-11" : ""}
              ${error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""}
              ${className}
            `}
            value={value}
            defaultValue={defaultValue}
            {...props}
          />
          <label
            className={`
              absolute left-3 -top-2 px-1.5 bg-white text-[11px] font-bold transition-all duration-200 pointer-events-none
              ${(isFocused || hasValue) ? "text-gray-400 translate-y-0" : "text-transparent translate-y-5 text-sm"}
              peer-placeholder-shown:translate-y-5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
              peer-focus:-top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-gray-400 peer-focus:font-bold
            `}
          >
            {label}
          </label>
          {suffixElement && (
            <div className="absolute right-3 flex items-center gap-1">
              {suffixElement}
            </div>
          )}
        </div>
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

interface FloatingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: boolean;
}

const FloatingTextarea = React.forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  ({ label, error, className = "", onFocus, onBlur, value, defaultValue, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value !== undefined ? String(value).length > 0 : defaultValue !== undefined ? String(defaultValue).length > 0 : false;

    return (
      <div className="relative mt-2">
        <textarea
          ref={ref}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          placeholder=" "
          className={`
            peer w-full bg-white border border-gray-200 rounded-md py-3 px-4 text-sm text-gray-900 
            focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue
            placeholder:opacity-0 focus:placeholder:opacity-100 transition-all duration-200 min-h-[100px] resize-y
            ${error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""}
            ${className}
          `}
          value={value}
          defaultValue={defaultValue}
          {...props}
        />
        <label
          className={`
            absolute left-3 -top-2 px-1.5 bg-white text-[11px] font-bold transition-all duration-200 pointer-events-none
            ${(isFocused || hasValue) ? "text-gray-400 translate-y-0" : "text-transparent translate-y-5 text-sm"}
            peer-placeholder-shown:translate-y-5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
            peer-focus:-top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-gray-400 peer-focus:font-bold
          `}
        >
          {label}
        </label>
      </div>
    );
  }
);

FloatingTextarea.displayName = "FloatingTextarea";

export { FloatingInput, FloatingTextarea };
