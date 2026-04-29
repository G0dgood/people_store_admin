"use client";

import React from "react";
import { ModuleName, getStatusConfig } from "@/app/utils/statusRegistry";
import { Icon } from "./Icon";

interface StatusBadgeProps {
  module: ModuleName;
  value: string;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  module,
  value,
  className = "",
  showIcon = true,
  size = "sm",
}) => {
  const config = getStatusConfig(module, value);

  if (!config) {
    return (
      <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-400 rounded-sm ${className}`}>
        {value}
      </span>
    );
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[9px] gap-1",
    md: "px-3 py-1 text-[10px] gap-1.5",
  };

  return (
    <span 
      className={`inline-flex items-center font-black uppercase tracking-wider rounded border ${config.bgColor} ${sizeClasses[size]} ${className}`}
      style={{
        color: config.color,
        borderColor: `${config.color}30`, // 30% opacity
      }}
    >
      {showIcon && (
        <Icon 
          name={config.icon} 
          folder={config.iconFolder} 
          size="xs" 
          className="opacity-80"
        />
      )}
      {config.label}
    </span>
  );
};
