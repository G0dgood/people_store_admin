"use client";

import React from "react";
import { Icon } from "../Icon";

interface AlertProps {
  title: string;
  description?: string;
  variant?: "success" | "error" | "warning";
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  title,
  description,
  variant = "success",
  onClose,
  className = "",
}) => {
  const variants = {
    success: {
      bg: "bg-brand-gold-light",
      border: "border-blue-100",
      icon: "task_alt",
      iconColor: "text-[#2196F3]",
      titleColor: "text-[#121212]",
    },
    error: {
      bg: "bg-[#FEE2E2]",
      border: "border-[#FECACA]",
      icon: "error",
      iconColor: "text-[#EF4444]",
      titleColor: "text-[#991B1B]",
    },
    warning: {
      bg: "bg-[#FFF7ED]",
      border: "border-[#FFEDD5]",
      icon: "warning",
      iconColor: "text-[#F59E0B]",
      titleColor: "text-[#9A3412]",
    },
  };

  const style = variants[variant];

  return (
    <div className={`
      flex items-start gap-3 p-4 rounded-lg border  transition-all animate-in fade-in slide-in-from-top-1
      ${style.bg} ${style.border} ${className}
    `}>
      <Icon name={style.icon} size="sm" className={`mt-0.5 ${style.iconColor}`} />

      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-bold ${style.titleColor}`}>{title}</h4>
        {description && (
          <p className={`text-xs mt-0.5 font-medium opacity-80 ${style.titleColor}`}>
            {description}
          </p>
        )}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className={`p-1 hover:bg-black/5 rounded transition-colors ${style.iconColor}`}
        >
          <Icon name="clear" size="xs" />
        </button>
      )}
    </div>
  );
};

export { Alert };
