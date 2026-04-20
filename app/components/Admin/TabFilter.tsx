import React from "react";
import { motion } from "framer-motion";

interface TabFilterProps {
  id?: string;
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
    <div className={`flex bg-brand-charcoal/10 p-1 rounded-[6px] relative ${fullWidth ? "w-full" : "w-fit"} ${containerClassName}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`relative px-4 py-1.5 rounded-[6px] text-xs font-bold transition-all duration-300 z-10 cursor-pointer ${fullWidth ? "flex-1" : ""} ${activeTab === tab
            ? "text-white"
            : "text-gray-400 hover:text-brand-gold"
            }`}
        >
          {activeTab === tab && (
            <motion.div
              layoutId={`${id}-bg`}
              className="absolute inset-0 bg-brand-gold rounded-[6px] shadow-md -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          {tab}
        </button>
      ))}
    </div>
  );
};
