"use client";

import React from "react";
import { motion } from "framer-motion";
import { Icon } from "../Icon";

interface FeedToolbarProps {
  activeTab: "all" | "unread";
  onTabChange: (tab: "all" | "unread") => void;
}

export const FeedToolbar: React.FC<FeedToolbarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg relative overflow-hidden">
        {(["all", "unread"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`
              relative px-4 py-1.5 text-sm font-bold rounded-md transition-colors z-10
              ${activeTab === tab ? "text-brand-blue" : "text-gray-500 hover:text-gray-700"}
            `}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white shadow-sm rounded-md z-[-1]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative">
              {tab === "all" ? "All Messages" : "Unread"}
            </span>
          </button>
        ))}
      </div>

      <motion.div 
        whileFocus={{ scale: 1.01 }}
        className="relative w-full sm:w-64"
      >
        <Icon name="search" size="sm" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
        <input
          type="text"
          placeholder="Search messages..."
          className="w-full h-10 pl-10 pr-4 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:border-brand-blue transition-colors text-gray-900 relative z-0"
        />
      </motion.div>
    </div>
  );
};

