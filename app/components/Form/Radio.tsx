"use client";

import React from "react";

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <label className={`inline-flex items-center group cursor-pointer ${className}`}>
        <div className="relative flex items-center justify-center">
          <input
            type="radio"
            ref={ref}
            className="peer sr-only"
            {...props}
          />
          <div className={`
            w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center
            border-gray-300 bg-white group-hover:border-gray-400
            peer-checked:border-brand-blue peer-focus:ring-2 peer-focus:ring-brand-blue/20
            peer-disabled:opacity-50
          `}>
            <div className="w-2.5 h-2.5 rounded-full bg-brand-blue transition-all duration-200 transform scale-0 opacity-0 peer-checked:scale-100 peer-checked:opacity-100" />
          </div>
        </div>
        {label && <div className="ml-2.5 text-sm font-medium text-gray-700 selection-none">{label}</div>}
      </label>
    );
  }
);

Radio.displayName = "Radio";

export { Radio };
export type { RadioProps };
