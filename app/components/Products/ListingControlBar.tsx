"use client";

import React from "react";
import { Icon } from "../Icon";

interface ListingControlBarProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  count: number;
}

const ListingControlBar: React.FC<ListingControlBarProps> = ({
  viewMode,
  onViewModeChange,
  count,
}) => {
  const activeFilters = ["Samsung", "Apple", "Super AMOLED", "4 Stars", "Metallic"];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top Bar */}
      <div className="w-full bg-white border border-gray-200 rounded-lg h-16 flex items-center justify-between px-5">
        <div className="flex items-center gap-4">
           <span className="text-sm">
             <span className="font-bold">{count.toLocaleString()}</span> items in <span className="font-bold">Mobile accessory</span>
           </span>
        </div>

        <div className="flex items-center gap-4">
           {/* Verified Only Filter */}
           <div className="flex items-center gap-2 mr-2">
              <input type="checkbox" id="verified" className="w-4 h-4 text-brand-blue border-gray-300 rounded focus:ring-brand-blue" />
              <label htmlFor="verified" className="text-sm cursor-pointer">Verified only</label>
           </div>

           {/* Sort Dropdown */}
           <div className="flex items-center border border-gray-200 rounded px-3 py-1.5 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="text-sm text-gray-700 font-medium">Featured</span>
              <Icon name="expand_more" size="xs" className="text-gray-400 ml-6" />
           </div>

           {/* View Switcher */}
           <div className="flex items-center border border-gray-200 rounded overflow-hidden">
              <button 
                onClick={() => onViewModeChange("grid")}
                className={`w-9 h-9 flex items-center justify-center transition-colors cursor-pointer ${viewMode === "grid" ? "bg-gray-100" : "bg-white hover:bg-gray-50"}`}
              >
                 <Icon name="grid_view" size="sm" className={viewMode === "grid" ? "text-brand-blue" : "text-gray-900"} />
              </button>
              <button 
                onClick={() => onViewModeChange("list")}
                className={`w-9 h-9 flex items-center justify-center border-l border-gray-200 transition-colors cursor-pointer ${viewMode === "list" ? "bg-gray-100" : "bg-white hover:bg-gray-50"}`}
              >
                 <Icon name="list" size="sm" className={viewMode === "list" ? "text-brand-blue" : "text-gray-900"} />
              </button>
           </div>
        </div>
      </div>

      {/* Active Filter Tags */}
      <div className="flex flex-wrap items-center gap-2">
         {activeFilters.map((filter, idx) => (
           <div key={idx} className="flex items-center gap-2 px-3 py-1.5 border border-brand-blue rounded h-8 bg-white cursor-pointer hover:bg-blue-50 transition-colors">
              <span className="text-sm text-gray-700">{filter}</span>
              <Icon name="clear" size="xs" className="text-gray-400" />
           </div>
         ))}
         <button className="text-brand-blue text-sm font-medium ml-2 hover:underline cursor-pointer">
            Clear all filters
         </button>
      </div>
    </div>
  );
};

export { ListingControlBar };
