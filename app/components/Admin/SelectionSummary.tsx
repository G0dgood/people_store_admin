"use client";

import React from "react";
import { Icon } from "../Icon";

interface SelectionSummaryProps {
  selectedIds: any[];
  items: any[];
  idProp?: string;
  labelProp?: string;
  onClear: () => void;
  title?: string;
}

export function SelectionSummary({
  selectedIds,
  items,
  idProp = "id",
  labelProp = "name",
  onClear,
  title = "Selected Items",
}: SelectionSummaryProps) {
  if (selectedIds.length === 0) return null;

  const selectedItems = items.filter((item) => selectedIds.includes(item[idProp]));

  return (
    <div className="flex flex-col gap-4 p-4 rounded-[4px] bg-brand-gold/5 border border-brand-gold/10 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[4px] bg-brand-gold text-white flex items-center justify-center font-black text-xs">
            {selectedIds.length}
          </div>
          <span className="text-[13px] font-black text-[#121212]">{title}</span>
        </div>
        <button
          onClick={onClear}
          className="text-[11px] font-bold text-brand-gold hover:text-amber-600 hover:underline transition-colors"
        >
          Clear Selection
        </button>
      </div>

      <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
        {selectedItems.map((item, idx) => (
          <div
            key={item[idProp] || idx}
            className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-white/60 border border-white  "
          >
            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold opacity-40"></div>
            <span className="text-[11px] font-bold text-gray-600 truncate">
              {item[labelProp] || item[idProp]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
