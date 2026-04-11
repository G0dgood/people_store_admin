"use client";

import React from "react";
import { Icon } from "../Icon";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
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
            w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center
            ${props.checked || indeterminate
              ? "bg-brand-blue border-brand-blue"
              : "bg-white border-gray-300 group-hover:border-gray-400"}
          `}>
            {indeterminate ? (
              <Icon name="remove" size="xs" className="text-white" />
            ) : (
              props.checked && <Icon name="check" size="xs" className="text-white" />
            )}
          </div>
        </div>
        {label && <span className="ml-2.5 text-sm font-medium text-gray-700">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
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
            ${props.checked
              ? "border-brand-blue"
              : "bg-white border-gray-300 group-hover:border-gray-400"}
          `}>
            {props.checked && (
              <div className="w-2.5 h-2.5 rounded-full bg-brand-blue animate-in zoom-in-50 duration-200" />
            )}
          </div>
        </div>
        {label && <span className="ml-2.5 text-sm font-medium text-gray-700">{label}</span>}
      </label>
    );
  }
);

Radio.displayName = "Radio";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
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
            ${props.checked ? "bg-brand-blue" : "bg-gray-200 group-hover:bg-gray-300"}
          `} />
          <div className={`
            absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all duration-200 
            ${props.checked ? "translate-x-5" : "translate-x-0"}
          `} />
        </div>
        {label && <span className="ml-3 text-sm font-medium text-gray-700">{label}</span>}
      </label>
    );
  }
);

Switch.displayName = "Switch";

export { Checkbox, Radio, Switch };
