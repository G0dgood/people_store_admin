"use client";

import React from "react";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { MiniChart } from "./MiniChart";
import { DropdownMenu, DropdownItem } from "../Dropdown/DropdownMenu";
import { useState, useRef, useEffect } from "react";
import { MdRefresh, MdDownload, MdContentCopy, MdPushPin } from "react-icons/md";

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
  chartData?: number[];
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  periodLabel = "Last 7 days",
  trendValue,
  trendIsUp = true,
  chartData = [],
  onViewDetails,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const actions = [
    {
      label: "Refresh metric",
      subtext: "Poll latest data from the server",
      icon: <MdRefresh />,
      onClick: () => console.log("Refresh", title)
    },
    {
      label: "Export Trend",
      subtext: "Download CSV of current period",
      icon: <MdDownload />,
      onClick: () => console.log("Export", title)
    },
    {
      label: "Copy Analytics ID",
      subtext: "Useful for deep-link debugging",
      icon: <MdContentCopy />,
      onClick: () => console.log("Copy ID", title)
    },
    {
      label: "Pin to Home",
      subtext: "Keep this metric on login",
      icon: <MdPushPin />,
      onClick: () => console.log("Pin", title)
    }
  ];

  return (
    <div className="bg-white p-6 rounded-[6px] border border-[#1C1C1C1A] flex flex-col gap-4 relative group transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <h3 className="text-[13px] font-black text-gray-400 uppercase tracking-widest leading-none">{title}</h3>
        <div className="relative" ref={dropdownRef}>
          <button
            className={`transition-colors p-1 rounded-md ${isDropdownOpen ? "bg-brand-gold-light text-brand-gold" : "text-gray-300 hover:text-gray-600"}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 z-50">
              <DropdownMenu width={220} className="shadow-2xl border-gray-200">
                {actions.map((action, i) => (
                  <DropdownItem
                    key={i}
                    label={action.label}
                    subtext={action.subtext}
                    icon={action.icon}
                    onSelect={() => {
                      action.onClick();
                      setIsDropdownOpen(false);
                    }}
                  />
                ))}
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-black text-brand-charcoal tracking-tight">{value}</h2>
          {trendValue && (
            <div className={`flex items-center text-[10px] font-black gap-0.5 px-2 py-0.5 rounded-md ${trendIsUp ? "bg-gray-50 text-brand-charcoal" : "bg-rose-50 text-rose-500"}`}>
              <Icon name={trendIsUp ? "arrow_upward" : "arrow_downward"} size="xs" />
              <span>{trendValue}</span>
            </div>
          )}
        </div>

        <div className="h-10 w-full opacity-60 group-hover:opacity-100 transition-opacity">
          <MiniChart
            type="area"
            data={chartData}
            color={trendIsUp ? "#222222" : "#F43F5E"}
            height={40}
          />
        </div>
      </div>

      <div className="mt-2 flex justify-between items-center group/btn">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{periodLabel}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails?.();
          }}
          className="flex items-center gap-1 text-[10px] font-black text-brand-charcoal uppercase hover:underline opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          View Details
          <Icon name="chevron_right" size="xs" className="transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
