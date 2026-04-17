"use client";

import React from "react";
import { Icon } from "../Icon";

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  icon?: string;
  rightElement?: React.ReactNode;
  activeColor?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, icon, rightElement, activeColor = "#2196F3", className = "", checked, ...props }, ref) => {
    // Determine dynamic styles for the custom circle
    const circleStyles = checked
      ? { borderColor: activeColor }
      : { borderColor: "#D1D5DB" }; // gray-300

    return (
      <label className={`flex items-center cursor-pointer group w-full ${className}`}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <div className="relative flex items-center justify-center">
              <input
                type="radio"
                ref={ref}
                className="peer sr-only"
                checked={checked}
                {...props}
              />
              <div
                className="w-5 h-5 rounded-full border-1 transition-all duration-200 flex items-center justify-center bg-white group-hover:border-gray-400"
                style={circleStyles}
              >
                {checked && (
                  <div
                    className="w-2.5 h-2.5 rounded-full transition-all animate-in zoom-in-50 duration-200"
                    style={{ backgroundColor: activeColor }}
                  />
                )}
              </div>
            </div>
            {label && (
              <div className={`ml-2.5 text-sm font-medium transition-colors selection-none ${checked ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"}`}>
                {label}
              </div>
            )}
          </div>

          {rightElement ? (
            <div className="flex items-center gap-2">
              {rightElement}
            </div>
          ) : icon && (
            <Icon
              name={icon}
              size="sm"
              className="opacity-80 transition-opacity group-hover:opacity-100"
              style={{ color: activeColor }}
            />
          )}
        </div>
      </label>
    );
  }
);

Radio.displayName = "Radio";

export { Radio };
export type { RadioProps };
