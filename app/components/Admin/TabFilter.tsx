import React from "react";
import { motion } from "framer-motion";

interface TabFilterProps {
  id: string;
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
  containerClassName?: string;
  fullWidth?: boolean;
}

export const TabFilter: React.FC<TabFilterProps> = ({
  id,
  tabs,
  activeTab,
  onChange,
  containerClassName = "",
  fullWidth = false,
}) => {
  return (
    <div className={`flex bg-brand-blue-light p-1 rounded-[6px] relative ${fullWidth ? "w-full" : "w-fit"} ${containerClassName}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`relative px-4 py-1.5 rounded-[6px] text-xs font-bold transition-colors z-10 cursor-pointer ${fullWidth ? "flex-1" : ""} ${activeTab === tab
              ? "text-[#2196F3]"
              : "text-[#7B7F84] hover:text-[#2196F3]"
            }`}
        >
          {activeTab === tab && (
            <motion.div
              layoutId={`${id}-bg`}
              className="absolute inset-0 bg-white rounded-[6px] shadow-sm -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          {tab}
        </button>
      ))}
    </div>
  );
};
