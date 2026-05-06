"use client";

import React from "react";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <label className={`inline-flex items-center group cursor-pointer ${className}`}>
        <div className="relative">
          <input
            type="checkbox"
            ref={ref}
            className="peer sr-only"
            {...props}
          />
          <div className={`
            w-11 h-6 rounded-full transition-all duration-200
            bg-gray-200 group-hover:bg-gray-300
            peer-checked:bg-brand-gold peer-focus:ring-2 peer-focus:ring-brand-gold/20
            peer-disabled:opacity-50
          `} />
          <div className={`
            absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all duration-200 
            peer-checked:translate-x-5  
          `} />
        </div>
        {label && <div className="ml-3 text-sm font-medium text-gray-700 selection-none">{label}</div>}
      </label>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
export type { SwitchProps };
