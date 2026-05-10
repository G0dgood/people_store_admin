import React from "react";
import { HiOutlineCube } from "react-icons/hi2";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export const EmptyState = ({ 
  icon = <HiOutlineCube size={36} />, 
  title, 
  description,
  className = ""
}: EmptyStateProps) => {
  return (
    <div className={`p-16 flex flex-col items-center justify-center text-center gap-4 bg-gray-50/50 ${className}`}>
      <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-gray-200 shadow-inner">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-base font-black text-[#121212]">{title}</span>
        <span className="text-xs text-gray-400 font-bold max-w-xs">{description}</span>
      </div>
    </div>
  );
};
