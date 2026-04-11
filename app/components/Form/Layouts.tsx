import React from "react";
import { Label } from "./Field";

interface InlineFieldProps {
  label: string;
  children: React.ReactNode;
  labelWidth?: string;
  className?: string;
}

const InlineField: React.FC<InlineFieldProps> = ({
  label,
  children,
  labelWidth = "100px",
  className = "",
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex justify-end pr-4 shrink-0" style={{ width: labelWidth }}>
        <Label className="mb-0 text-sm font-medium text-gray-500 whitespace-nowrap">
          {label}:
        </Label>
      </div>
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
};

export { InlineField };
