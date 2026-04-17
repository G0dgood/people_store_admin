"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { AdminChart } from "./AdminChart";
import { DropdownMenu, DropdownItem } from "../Dropdown/DropdownMenu";
import { HiArrowPath, HiPower, HiBell } from "react-icons/hi2";

interface RealtimeUsersProps {
  onViewInsight?: () => void;
}

export const RealtimeUsers: React.FC<RealtimeUsersProps> = ({ onViewInsight }) => {
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

  return (
    <div className="bg-white p-8 rounded-[6px] border border-gray-100 shadow-sm flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-black text-brand-blue leading-none">Users in last 30 minutes</span>
          <h3 className="text-4xl font-black text-[#1D3557] tracking-tight mt-1">21.5K</h3>
          <p className="text-[11px] font-bold text-gray-500 mt-2">Users per minute</p>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            className={`p-1 rounded-[6px] transition-all ${isDropdownOpen ? "bg-brand-blue-light text-brand-blue shadow-sm" : "text-gray-400 hover:bg-gray-50"}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 z-50">
              <DropdownMenu width={220} className="shadow-2xl border-gray-100">
                <DropdownItem
                  label="Force Refresh"
                  subtext="Manual data pull"
                  icon={<HiArrowPath />}
                  onSelect={() => { console.log("Refresh"); setIsDropdownOpen(false); }}
                />
                <DropdownItem
                  label="Mute Live Feed"
                  subtext="Stop realtime updates"
                  icon={<HiPower />}
                  onSelect={() => { console.log("Mute"); setIsDropdownOpen(false); }}
                />
                <DropdownItem
                  label="Alert Config"
                  subtext="Set user spike thresholds"
                  icon={<HiBell />}
                  onSelect={() => { console.log("Alerts"); setIsDropdownOpen(false); }}
                />
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      <div className="h-20 w-full mt-2">
        <AdminChart
          type="bar"
          data={{
            labels: Array(22).fill(''),
            datasets: [{
              data: [40, 60, 45, 80, 50, 95, 60, 40, 30, 70, 50, 65, 40, 30, 85, 55, 75, 50, 90, 60, 95, 45, 70],
              backgroundColor: '#2196F3',
              borderRadius: 2,
              hoverBackgroundColor: '#1D3557',
            }]
          }}
          options={{
            scales: {
              x: { display: false },
              y: { display: false }
            },
            plugins: {
              tooltip: { enabled: false }
            }
          }}
        />
      </div>

      <div className="flex flex-col gap-6 pt-4 mt-2">
        <div className="flex justify-between items-center px-1">
          <h4 className="text-[13px] font-black text-[#1D3557]">Sales by Country</h4>
          <span className="text-[12px] font-black text-gray-500 uppercase tracking-widest">Sales</span>
        </div>

        {[
          { flag: "🇺🇸", country: "US", val: "30k", perc: 75, trend: "25.8%", isUp: true },
          { flag: "🇧🇷", country: "Brazil", val: "30k", perc: 35, trend: "15.8%", isUp: false },
          { flag: "🇦🇺", country: "Australia", val: "25k", perc: 60, trend: "35.8%", isUp: true },
        ].map((c) => (
          <div key={c.country} className="flex flex-col gap-3">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-4">
                <span className="text-2xl leading-none">{c.flag}</span>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-[#1D3557] leading-none">{c.val}</span>
                  <span className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-tighter">{c.country}</span>
                </div>
              </div>
              <div className={`flex items-center text-[10px] font-black ${c.isUp ? 'text-brand-blue' : 'text-red-500'}`}>
                <Icon name={c.isUp ? 'arrow_upward' : 'arrow_downward'} size="xs" className="mr-0.5" />
                <span>{c.trend}</span>
              </div>
            </div>
            <div className="h-2 w-full bg-gray-50 rounded-[6px] overflow-hidden">
              <div className="h-full bg-brand-blue rounded-[6px]" style={{ width: `${c.perc}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      <Button
        className="w-full text-[11px] font-black uppercase tracking-widest border border-brand-blue/30 text-brand-blue hover:bg-brand-blue hover:text-white h-12 rounded-[6px] transition-all mt-4"
        onClick={onViewInsight}
      >
        View Insight
      </Button>
    </div>
  );
};
