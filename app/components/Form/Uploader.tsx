import React from "react";
import { Icon } from "../Icon";

interface UploaderProps {
  variant?: "dashed" | "solid";
  icon?: string;
  onClick?: () => void;
  className?: string;
}

const Uploader: React.FC<UploaderProps> = ({
  variant = "dashed",
  icon = "cloud_upload",
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-20 h-20 flex items-center justify-center rounded-lg transition-all duration-200
        ${variant === "dashed" 
          ? "border-2 border-dashed border-gray-200 bg-white hover:border-brand-gold hover:bg-gray-50" 
          : "bg-gray-100 border border-transparent hover:bg-gray-200"}
        ${className}
      `}
    >
      <Icon 
        name={icon} 
        size="md" 
        className={variant === "dashed" ? "text-gray-400 group-hover:text-brand-gold" : "text-gray-400"} 
      />
    </button>
  );
};

export { Uploader };
