"use client";

import React from "react";
import { Icon } from "../Icon";
import { Button } from "../Button";

interface StatCardProps {
  title: string;
  value: string | number;
  periodLabel?: string;
  trendLabel?: string;
  trendValue?: string;
  trendIsUp?: boolean;
  previousLabel?: string;
  previousValue?: string;
  onViewDetails?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  periodLabel = "Last 7 days",
  trendValue,
  trendIsUp = true,
}) => {
  return (
    <div className="bg-white p-6 rounded-[6px] border border-gray-100 shadow-sm flex flex-col gap-4 relative group transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-semibold text-gray-700 tracking-tight">{title}</h3>
        <button className="text-gray-300 hover:text-gray-600 transition-colors p-1">
          <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{value}</h2>
        {trendValue && (
          <div className={`flex items-center text-xs font-semibold gap-0.5 ${trendIsUp ? "text-blue-500" : "text-rose-500"}`}>
             <Icon name={trendIsUp ? "material-symbols_arrow-upward-rounded" : "material-symbols_arrow-downward-rounded"} folder="dashboardIcon" size="xs" />
             <span>{trendValue}</span>
          </div>
        )}
      </div>
      
      <div className="mt-auto">
        <span className="text-[11px] font-medium text-gray-400">{periodLabel}</span>
      </div>
    </div>
  );
};
