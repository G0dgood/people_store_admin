"use client";

import React from "react";
import { Icon } from "../Icon";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, indeterminate, className = "", ...props }, ref) => {
    const defaultRef = React.useRef<HTMLInputElement>(null);
    const combinedRef = (ref as React.MutableRefObject<HTMLInputElement>) || defaultRef;

    React.useEffect(() => {
      if (combinedRef.current) {
        combinedRef.current.indeterminate = !!indeterminate;
      }
    }, [indeterminate, combinedRef]);

    return (
      <label className={`inline-flex items-center group cursor-pointer ${className}`}>
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            ref={combinedRef}
            className="peer sr-only"
            {...props}
          />
          <div className={`
            w-6 h-6 rounded border-2 transition-all duration-200 flex items-center justify-center
            border-gray-300 bg-white group-hover:border-gray-400
            peer-checked:bg-brand-blue peer-checked:border-brand-blue
            peer-indeterminate:bg-brand-blue peer-indeterminate:border-brand-blue
            peer-focus:ring-2 peer-focus:ring-brand-blue/20
            peer-disabled:opacity-50 peer-disabled:bg-gray-100
          `}>
            <Icon 
              name="check" 
              size="sm" 
              className={`text-white transition-all duration-200 transform scale-50 opacity-0 peer-checked:scale-100 peer-checked:opacity-100 ${indeterminate ? 'hidden' : ''}`} 
            />
            {indeterminate && <Icon name="remove" size="xs" className="text-white animate-in zoom-in-50" />}
          </div>
        </div>
        {label && <div className="ml-2.5 text-sm font-medium text-gray-700 selection-none">{label}</div>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
export type { CheckboxProps };
